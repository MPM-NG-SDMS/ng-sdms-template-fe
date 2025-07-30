
import { createI18n } from 'vue-i18n'
import en from '../../locales/en.json'
import id from '../../locales/id.json'

// Create and export Vue I18n instance
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('locale') || 'id',
  fallbackLocale: 'id',
  messages: { en, id }
});

export default i18n
