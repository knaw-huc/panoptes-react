import {useSuspenseQuery, UseSuspenseQueryResult} from "@tanstack/react-query";
import {getTranslationsQueryOptions, TranslationsResponse} from "queries/translations.ts";
import {usePanoptes} from "hooks/index.ts";
import {useLocale} from "hooks/index.ts";

/**
 * Gets the translations available for the current tenant and the current (or default) locale
 */
export default function useTranslations(): UseSuspenseQueryResult<TranslationsResponse> {
    const {url} = usePanoptes();
    const {locale} = useLocale();

    return useSuspenseQuery(getTranslationsQueryOptions(url, locale));
}
