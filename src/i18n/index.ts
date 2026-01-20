import i18next from 'i18next';
import en from './locales/en/common.json';
import nl from './locales/nl/common.json';
import type {TranslateFn} from '@knaw-huc/faceted-search-react';

const supportedLocales = ['en', 'nl'] as const;
type SupportedLocale = typeof supportedLocales[number];

function detectLocale(): SupportedLocale {
    const browserLang = navigator.language.split('-')[0];
    return supportedLocales.includes(browserLang as SupportedLocale)
        ? browserLang as SupportedLocale
        : 'en';
}

i18next.init({
    lng: detectLocale(),
    fallbackLng: 'en',
    resources: {
        en: {translation: en},
        nl: {translation: nl},
    },
    interpolation: {
        escapeValue: false,
    },
});

export function createTranslate(): TranslateFn {
    return (key: string, options?: Record<string, unknown>): string => i18next.t(key, options);
}

