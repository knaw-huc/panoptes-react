import { FC } from "react";
import {useRouter} from "@tanstack/react-router";
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import {Block, Schema} from "components/blocks/BlockLoader.tsx";
import {getLinkTo, isLink, isMarkdownHTML, omitProperty} from "../../../schema/schemaSelectors.ts";
import classes from './JsonBlockRenderer.module.css';
import {
    JsonData,
    JsonSchema,
    JsonDataItemValue,
    ListBlock
} from "components/blocks/json/index.tsx";

const isJsonBlock = (block: Block): block is ListBlock => {
    return block.type === "json";
}

/**
 * Render  JSON property label, by doing some label manipulation in the function itself (no proper i18n)
 */
const JsonPropertyLabel = ({ label }: { label: string }) => {
    return (
        <dt className={classes.label}>
            {label
                .replace(/_/g, " ")
                .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase())}
        </dt>
    );
}

const JsonPropertyListValue = ({ propKey, value, schema, model }:
                                 { propKey: string, value: JsonDataItemValue; schema: JsonSchema, model: object }) => {
    const router = useRouter();

    if (value === null || value === '') {
        return <span className={classes.empty} title="No value">—</span>;
    }

    if (isLink(schema, propKey)) {
        const link = router.buildLocation({
                to: getLinkTo(schema, propKey),
                params: model
        }).href;

        return (<a className={classes.link} href={link}>{value as string}</a>);
    }
    if (isMarkdownHTML(schema, propKey)) {
        return (<ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                {value as string}
            </ReactMarkdown>);
    }

    switch (typeof value) {
        case "object":
            return <Json data={value as JsonData} schema={schema as JsonSchema} />;
        case "boolean":
            return value ? "Yes" : "No";
        case "number":
            return value;

        default:
            return <pre className={classes.text}>{value}</pre>;
    }
}

/**
 * Render an JSON property value (this also recognizes arrays!)
 *
 * @param key       the prop key
 * @param value     the prop value
 * @param schema    the schema object
 */
const JsonPropertyValue = ({ propKey, value, schema, model }: { propKey: string, value: JsonDataItemValue; schema: Schema, model: object }) => {
    const values = Array.isArray(value) ? value.length > 0 ? value : [null] : [value];

    return (
        <dd className={classes.value}>
            {values.length > 1 ? (
                <ul>
                    {values.map((v, index) => (
                        <li key={index}>
                            <JsonPropertyListValue propKey={propKey} value={v} schema={schema} model={model} />
                        </li>
                    ))}
                </ul>
            ) : (<JsonPropertyListValue propKey={propKey} value={values[0]} schema={schema} model={model} />)}
        </dd>
    );
}

const Json = ({ data, schema }: { data: JsonData, schema: JsonSchema }) => {

    return (
        <dl className={classes.list}>
            {Object.entries(data).map(([key, value]) => (!omitProperty(schema, key) && (
                <div className={classes.item}>
                    <JsonPropertyLabel label={key} />
                    <JsonPropertyValue propKey={key} value={value} schema={schema} model={data} />
                </div>
            )))}
        </dl>
    );

}

const JsonBlockRenderer: FC<{ block: Block }> = ({ block }) => {
    if (!isJsonBlock(block)) {
        console.error("JsonBlockRenderer used with non-JSON block:", block);
        return null;
    }

    return <Json data={block.value} schema={block.schema} />;
};

export default JsonBlockRenderer;
