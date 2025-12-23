import {Schema} from "components/blocks/BlockLoader.tsx";
import {get} from "radash";

export const SCHEMA_FORMAT_LINK = 'link';
export const SCHEMA_FORMAT_EXTERNAL_LINK = 'external-link';
export const SCHEMA_FORMAT_MARKDOWN_HTML = 'markdown-html';
export const SCHEMA_FORMAT_OMIT_KEY = 'x-omit';
export const SCHEMA_FORMAT_LINK_TO_KEY = 'x-link-to';
export const SCHEMA_FORMAT_KEY = 'format';

export const omitProperty = (schema: Schema, propertyName: string): boolean => {
    return get(schema, `properties.${propertyName}.${SCHEMA_FORMAT_OMIT_KEY}`, false);
}

export const isLink = (schema: Schema, propertyName: string): boolean => {
    return [ SCHEMA_FORMAT_LINK ].indexOf(get(schema, `properties.${propertyName}.${SCHEMA_FORMAT_KEY}`, '')) > -1;
}

export const isExternalLink = (schema: Schema, propertyName: string): boolean => {
    return [ SCHEMA_FORMAT_EXTERNAL_LINK ].indexOf(get(schema, `properties.${propertyName}.${SCHEMA_FORMAT_KEY}`, '')) > -1;
}

export const isMarkdownHTML = (schema: Schema, propertyName: string): boolean => {
    return [ SCHEMA_FORMAT_MARKDOWN_HTML ].indexOf(get(schema, `properties.${propertyName}.${SCHEMA_FORMAT_KEY}`, '')) > -1;
}

export const getLinkTo = (schema: Schema, propertyName: string): string => {
    return get(schema, `properties.${propertyName}.${SCHEMA_FORMAT_LINK_TO_KEY}`, '');
}
