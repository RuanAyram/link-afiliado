import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vitrinehub.com.br';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Impede crawlers de acessarem rotas internas de API
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
