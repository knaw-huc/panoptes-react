import { FC } from "react";
import { PropertyListData } from "../lib/components/blocks/list/PropertyList.tsx";
import {Block, Schema} from "../lib/components/blocks/BlockLoader.tsx";
import classes from './EntityRenderer.module.css';
import {get} from "radash";
import {getLinkTo, isLink, isMarkdownHTML, omitProperty} from "../lib/schema/schemaSelectors.ts";
import {useRouter} from "@tanstack/react-router";
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";

type EntityData = Record<string, any>;

type EntitySchema = Record<string, any>;

type EntityDataValue =
    | EntityData
    | string
    | number
    | boolean
    | null;

type EntityDataItemValue =
    | EntityDataValue
    | EntityDataValue[];

interface ListBlock extends Block {
    type: "entity";
    value: PropertyListData;
}

const isEntityBlock = (block: Block): block is ListBlock => {
    return block.type === "entity";
}

/**
 * Render an entity property label, by doing some label manipulation in the function itself (no proper i18n)
 */
const EntityPropertyLabel = ({ label }: { label: string }) => {
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

const EntityPropertyListValue = ({ propKey, value, schema }: { propKey: string, value: EntityDataItemValue; schema: Schema }) => {
    const router = useRouter();

    if (value === null || value === '') {
        return <span className={classes.empty} title="No value">—</span>;
    }

    const format = get(schema, `properties.${propKey}.format`, '');
    console.log(format);

    if (isLink(schema, propKey)) {
        const link = router.buildLocation({
                to: getLinkTo(schema, propKey),
                params: { plaatsId: 1 }
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
            // We assume nested objects follow PropertyListData shape
            return <Entity data={value as EntityData} schema={schema as EntitySchema} />;
        case "boolean":
            return value ? "Yes" : "No";
        case "number":
            return value.toLocaleString();
        default:
            return <pre className={classes.text}>{value}</pre>;
    }
}

/**
 * Render an entity property value (this also recognizes arrays!)
 *
 * @param key       the prop key
 * @param value     the prop value
 * @param schema    the entity schema object
 */
const EntityPropertyValue = ({ propKey, value, schema }: { propKey: string, value: EntityDataItemValue; schema: Schema }) => {
    const values = Array.isArray(value) ? value.length > 0 ? value : [null] : [value];

    return (
        <dd className={classes.value}>
            {values.length > 1 ? (
                <ul>
                    {values.map((v, index) => (
                        <li key={index}>
                            <EntityPropertyListValue propKey={propKey} value={v} schema={schema} />
                        </li>
                    ))}
                </ul>
            ) : (<EntityPropertyListValue propKey={propKey} value={values[0]} schema={schema} />)}
        </dd>
    );
}

const Entity = ({ data, schema }: { data: EntityData, schema: EntitySchema }) => {

    return (
        <dl className={classes.list}>
            {Object.entries(data).map(([key, value]) => (!omitProperty(schema, key) && (
                <div className={classes.item}>
                    <EntityPropertyLabel label={key} />
                    <EntityPropertyValue propKey={key} value={value} schema={schema}/>
                </div>
            )))}
        </dl>
    );

}

const EntityRenderer: FC<{ block: Block }> = ({ block }) => {
    if (!isEntityBlock(block)) {
        console.error("EntityRenderer used with non-entity block:", block);
        return null;
    }

    return <Entity data={block.value} schema={block.schema} />;
};

export default EntityRenderer;
