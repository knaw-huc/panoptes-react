import {useState} from "react";

export const LOCALE_KEY = 'locale';
export const LOCALE_NL = 'NL';

export const DEFAULT_LOCALE = LOCALE_NL;

export type UserLocale = {
    locale: string;
    changeLocale: (locale: string) => void;
}

/**
 * Gets the current locale (from local storage if available) or the default if not set.
 *
 * @return UserLocale   user locale object with the current locale and a callback function to set the locale
 */
export default function useLocale(): UserLocale {

    const [locale, setLocale] = useState(() => {
        return localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE;
    });

    function changeLocale(next: string) {
        localStorage.setItem(LOCALE_KEY, next);
        setLocale(next);
    }

    return { locale, changeLocale };

}