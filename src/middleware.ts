import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  // Force redirect from Railway URL to custom domain
  const url = new URL(context.request.url);

  // If accessing via Railway URL, redirect to relocation.quest
  if (url.hostname.includes('railway.app')) {
    const redirectUrl = `https://relocation.quest${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 301);
  }

  return next();
});
