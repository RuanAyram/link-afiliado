import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const token = 
      request.headers.get('x-revalidate-secret') || 
      new URL(request.url).searchParams.get('secret');
    
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret || token !== secret) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    revalidatePath('/');
    return NextResponse.json({ revalidated: true, method: 'POST', now: Date.now() });
  } catch (error) {
    console.error('Erro na revalidação via POST:', error);
    return NextResponse.json(
      { error: 'Erro interno ao revalidar cache' },
      { status: 500 }
    );
  }
}

// Suporta GET para facilitar testes manuais rápidos no navegador
export async function GET(request: NextRequest) {
  try {
    const token = new URL(request.url).searchParams.get('secret');
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret || token !== secret) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    revalidatePath('/');
    return NextResponse.json({ revalidated: true, method: 'GET', now: Date.now() });
  } catch (error) {
    console.error('Erro na revalidação via GET:', error);
    return NextResponse.json(
      { error: 'Erro interno ao revalidar cache' },
      { status: 500 }
    );
  }
}
