import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ta', 'en', 'hi', 'sa'],
  defaultLocale: 'ta',
})
