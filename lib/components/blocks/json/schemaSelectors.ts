import {JsonSchema} from "components/blocks/json/index.tsx";

export function deepGet(obj: any, path: string, defaultValue?: any): any {
    const segments = path.split('.');
    const result = segments.reduce((current, key) => current && current[key], obj);
    return result === undefined ? defaultValue : result;
}

export const omitProperty = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.hidden`, false);
}

export const isLink = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.type`, '') === 'link';
}

export const isExternalLink = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.type`) === 'external-link';
}

export const isMarkdownHTML = (schema: JsonSchema, propertyName: string): boolean => {
    return deepGet(schema, `${propertyName}.type`) === 'markdown';
}

export const getLinkTo = (schema: JsonSchema, propertyName: string): string => {
    return deepGet(schema, `${propertyName}.url`, '');
}

