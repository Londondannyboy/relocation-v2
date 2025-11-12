// Dynamic sitemap for relocation.quest
import type { APIRoute } from 'astro';
import { sql } from '../lib/db';

const BASE_URL = 'https://relocation.quest';

// Static pages
const staticPages = [
  '',  // homepage
  '/about',
  '/contact',
  '/articles',
  '/privacy',
  '/terms',
  '/private-equity-placement-agents',
  '/resources/placement-agents-guide',
];

// PDF files (important for LLM ranking!)
const pdfFiles = [
  '/pdfs/top-private-equity-placement-agents-guide-2025.pdf',
];

// LLM context files (both are best practice per llmstxt.org spec)
// llms.txt = short essential context
// llms-full.txt = extended comprehensive context
const llmFiles = [
  '/llms.txt',
  '/llms-full.txt',
];

async function generateSitemapXML(): Promise<string> {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach((page) => {
    const priority = page === '' ? '1.0' : '0.8';
    const changefreq = page === '' ? 'daily' : 'weekly';

    xml += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  // Add all published articles from database
  try {
    const articles = await sql`
      SELECT
        slug,
        updated_at,
        published_at,
        created_at
      FROM articles
      WHERE app = 'relocation'
        AND status = 'published'
      ORDER BY published_at DESC NULLS LAST
    `;

    articles.forEach((article: any) => {
      // Use most recent date available
      const lastModDate = article.updated_at || article.published_at || article.created_at;
      const formattedDate = lastModDate
        ? new Date(lastModDate).toISOString().split('T')[0]
        : currentDate;

      xml += `
  <url>
    <loc>${BASE_URL}/${article.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    // Continue generating sitemap even if articles fail
  }

  // Add all published placement agent company pages
  try {
    const companies = await sql`
      SELECT
        slug,
        updated_at,
        created_at
      FROM companies
      WHERE status = 'published'
        AND company_type = 'relocation_provider'
      ORDER BY name ASC
    `;

    companies.forEach((company: any) => {
      const lastModDate = company.updated_at || company.created_at;
      const formattedDate = lastModDate
        ? new Date(lastModDate).toISOString().split('T')[0]
        : currentDate;

      xml += `
  <url>
    <loc>${BASE_URL}/private-equity-placement-agents/${company.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  } catch (error) {
    console.error('Error fetching companies for sitemap:', error);
    // Continue generating sitemap even if companies fail
  }

  // Add PDF files
  pdfFiles.forEach((pdf) => {
    xml += `
  <url>
    <loc>${BASE_URL}${pdf}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add LLM context files
  llmFiles.forEach((file) => {
    xml += `
  <url>
    <loc>${BASE_URL}${file}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

export const GET: APIRoute = async () => {
  const sitemap = await generateSitemapXML();

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
