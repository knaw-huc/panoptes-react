import {JsonSchema} from "components/blocks/json";
import {get} from "radash";

export const SCHEMA_FORMAT_OMIT_KEY = 'omit';

export const omitProperty = (schema: JsonSchema, propertyName: string): boolean => {
    return get(schema, `${propertyName}.hidden`, false);
}

export const isLink = (schema: JsonSchema, propertyName: string): boolean => {
    return get(schema, `${propertyName}.type`) === 'link';
}

export const isExternalLink = (schema: JsonSchema, propertyName: string): boolean => {
    return get(schema, `${propertyName}.type`) === 'external-link';
}

export const isMarkdownHTML = (schema: JsonSchema, propertyName: string): boolean => {
    return get(schema, `${propertyName}.type`) === 'markdown';
}

export const getLinkTo = (schema: JsonSchema, propertyName: string): string => {
    return get(schema, `${propertyName}.url`, '');
}

