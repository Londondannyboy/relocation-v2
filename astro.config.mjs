// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import cookieconsent from '@jop-software/astro-cookieconsent';

// https://astro.build/config
export default defineConfig({
  site: 'https://placement.quest',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind(),
    cookieconsent({
      guiOptions: {
        consentModal: {
          layout: 'bar inline',
          position: 'bottom',
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      cookie: {
        name: 'placement_cookie_consent',
        domain: 'placement.quest',
        expiresAfterDays: 365,
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
        },
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Cookie Notice',
              description: 'We use cookies to enhance your experience and analyze site traffic. Learn more in our <a href="/privacy" class="cc-link">Privacy Policy</a> and <a href="/terms" class="cc-link">Terms & Conditions</a>.',
              acceptAllBtn: 'Accept All',
              acceptNecessaryBtn: 'Essential Only',
              showPreferencesBtn: 'Customize',
            },
            preferencesModal: {
              title: 'Cookie Preferences',
              acceptAllBtn: 'Accept All',
              acceptNecessaryBtn: 'Essential Only',
              savePreferencesBtn: 'Save My Choices',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Cookie Usage',
                  description: 'We use cookies to ensure basic functionality and enhance your experience on Placement Quest.',
                },
                {
                  title: 'Essential Cookies',
                  description: 'Required for the website to function properly. These cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics Cookies',
                  description: 'Help us understand visitor behavior and improve our content.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'More Information',
                  description: 'For any questions, please review our <a href="/privacy" class="cc-link">Privacy Policy</a> or <a href="/contact" class="cc-link">contact us</a>.',
                },
              ],
            },
          },
        },
      },
    }),
  ],
  server: {
    host: true // Listen on all network interfaces (0.0.0.0)
  }
});
