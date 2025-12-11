import {queryOptions} from "@tanstack/react-query";

export type TranslationsResponse = Record<string, string>;

export function getTranslationsQueryOptions(api: string, locale:string) {
    return queryOptions({
        queryKey: ['translations', api, locale],
        staleTime: 1000 * 6,
        queryFn: () => translations(api, locale),
    });
}

async function translations(api: string, locale: string): Promise<TranslationsResponse> {
    const result = await fetch(`${api}/api/translations/${locale}`);

    if (!result.ok) {
        throw new Error('Failed to obtain I18N translations!');
    }

    return result.json();
}
