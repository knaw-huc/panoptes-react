import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/common.json";
import nl from "./locales/nl/common.json";

i18n.use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: "en",
    resources: {
        en: { common: en },
        nl: { common: nl },
    },
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
    }
});