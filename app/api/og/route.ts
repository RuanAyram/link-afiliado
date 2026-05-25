import { NextRequest, NextResponse } from 'next/server';
import { scrapeOpenGraph } from '@/lib/og';
import { db, products } from '@/lib/db';
import { eq, and, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'O parâmetro "url" é obrigatório.' },
        { status: 400 }
      );
    }

    // Realiza o scraping de Open Graph
    const data = await scrapeOpenGraph(targetUrl);

    // Se encontramos uma imagem, atualizamos o banco de dados de forma transparente
    if (data.image) {
      try {
        // Apenas atualiza se a imagem no banco estiver atualmente nula para evitar escritas desnecessárias
        const updateResult = await db
          .update(products)
          .set({ imageUrl: data.image })
          .where(
            and(
              eq(products.url, targetUrl),
              isNull(products.imageUrl)
            )
          );

        // Se o banco foi atualizado, revalida o cache da home para refletir a imagem diretamente no HTML
        revalidatePath('/');
        console.log(`✅ Imagem atualizada e cache revalidado para o produto com URL: ${targetUrl}`);
      } catch (dbError) {
        // Loga o erro mas não falha a requisição do usuário
        console.error('⚠️ Erro ao atualizar image_url no banco de dados:', dbError);
      }
    }

    // Retorna com cache de 24 horas (CDN/Navegador) para evitar requisições repetidas
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Erro na API /api/og:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar o metadado.' },
      { status: 500 }
    );
  }
}
