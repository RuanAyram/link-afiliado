export interface OGData {
  title: string | null;
  image: string | null;
  description: string | null;
}

export async function scrapeOpenGraph(targetUrl: string): Promise<OGData> {
  try {
    // Adiciona protocolo se faltar
    let url = targetUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // Faz o fetch com timeout e headers de navegador comum para evitar bloqueios
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Regex para buscar og:image
    const ogImageMatch = 
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    
    // Regex para buscar og:title
    const ogTitleMatch = 
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);

    // Regex para buscar og:description
    const ogDescMatch = 
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);

    // Fallbacks
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch = 
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);

    const title = ogTitleMatch ? ogTitleMatch[1] : (titleMatch ? titleMatch[1].trim() : null);
    const image = ogImageMatch ? ogImageMatch[1] : null;
    const description = ogDescMatch ? ogDescMatch[1] : (descMatch ? descMatch[1] : null);

    // Tratar entidades HTML básicas (como &amp;, &quot;, &#39;, etc.)
    const decodeHtml = (str: string | null) => {
      if (!str) return null;
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ');
    };

    return {
      title: decodeHtml(title),
      image: image, // URLs geralmente não possuem entidades codificadas
      description: decodeHtml(description),
    };
  } catch (error) {
    console.error(`Erro ao fazer scraping da URL ${targetUrl}:`, error);
    return {
      title: null,
      image: null,
      description: null,
    };
  }
}
