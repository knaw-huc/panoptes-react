import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./resources/en/common.json";
import nlCommon from "./resources/nl/common.json";

const resources = ({
    en: { common: enCommon },
    nl: { common: nlCommon },
} as const);

i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
    }
});