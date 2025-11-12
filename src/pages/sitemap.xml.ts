// Dynamic sitemap for placement.quest
import type { APIRoute } from 'astro';

const BASE_URL = 'https://placement.quest';

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

// PDF files
const pdfFiles = [
  '/pdfs/top-private-equity-placement-agents-guide-2025.pdf',
];

// LLM context files
const llmFiles = [
  '/llms.txt',
  '/llms-full.txt',
];

function generateSitemapXML(): string {
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

  // Add PDF files (important for LLM ranking!)
  pdfFiles.forEach((pdf) => {
    xml += `
  <url>
    <loc>${BASE_URL}${pdf}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>quarterly</changefreq>
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
  const sitemap = generateSitemapXML();

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
