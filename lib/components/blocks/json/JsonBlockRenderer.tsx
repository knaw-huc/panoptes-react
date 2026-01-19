import {FC} from "react";
import {
    omitProperty,
} from "../../../schema/schemaSelectors.ts";
import {
    JsonBlock,
    JsonSchema,
    JsonValue,
} from "components/blocks/json/index.tsx";
import classes from "./JsonBlockRenderer.module.css";
import BlockLoader, { blocks } from "../BlockLoader.tsx";
import {get} from "radash";
import GhostLine from "components/utils/GhostLine.tsx";

const isJsonBlock = (block: JsonBlock) => block.type === "json";

/** humanize "some_keyName" -> "Some key name" (same behavior as your current component) */
const humanizeLabel = (label: string) =>
    label
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());

type SchemaLike = JsonSchema | undefined | null;

const schemaApi = {
    omit(schema: SchemaLike, key: string): boolean {
        try {
            return schema ? omitProperty(schema, key) : false;
        } catch {
            return false;
        }
    },
    childSchema(schema: SchemaLike, _key: string): SchemaLike {
        return schema ?? undefined;
    },
};


const JsonPropertyLabel = ({ label }: { label: string }) => (
    <dt className={classes.label}>{humanizeLabel(label)}</dt>
);

/** Renders a primitive value (string/number/boolean/null) */
const Primitive = ({ value }: { value: JsonValue }) => {
    if (value === null || value === "") {
        return <span className={classes.empty}>—</span>;
    }
    switch (typeof value) {
        case "boolean":
            return <>{value ? "Yes" : "No"}</>;
        case "number":
            return <>{value}</>;
        case "string":
            return <pre className={classes.text}>{value}</pre>;
        default:
            return <pre className={classes.text}>{String(value)}</pre>;
    }
};

/**
 * Render a single property value.
 * - Applies schema behaviors (external link, internal link, markdown) only when we have a propKey.
 * - Recurses into arrays/objects.
 */
const JsonPropertyValue = ({
    propKey,
    value,
    schema,
    model,
    path,
}: {
    propKey: string;
    value: JsonValue;
    schema: SchemaLike;
    model: JsonValue;
    path: string;
}) => {
    const config = get(schema, propKey);
    if (config && blocks[`./${config.type}/index.tsx`]) {
        const blockLike = { type: config.type, value, ...config, model };
        return <BlockLoader block={blockLike} fallback={<GhostLine />}/>;
    }

    // Generic rendering
    return <JsonValueRenderer value={value} schema={schemaApi.childSchema(schema, propKey)} path={path} />;
};

/**
 * Core renderer that can handle ANY JSON value:
 * - object -> definition list
 * - array  -> ordered list
 * - primitive/null -> Primitive
 */
const JsonValueRenderer = ({
    value,
    schema,
    path,
}: {
    value: JsonValue;
    schema: SchemaLike;
    path: string;
}) => {
    if (value === null || typeof value !== "object") {
        return <Primitive value={value} />;
    }

    // Array
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return <span className={classes.empty}>—</span>;
        }
        return (
            <ol className={classes.array}>
                {value.map((item, idx) => (
                    <li key={`${path}[${idx}]`} className={classes.arrayItem}>
                        <JsonValueRenderer value={item as JsonValue} schema={schema} path={`${path}[${idx}]`} />
                    </li>
                ))}
            </ol>
        );
    }

    // Object
    const entries = Object.entries(value as Record<string, JsonValue>);
    if (entries.length === 0) {
        return <span className={classes.empty}>—</span>;
    }

    return (
        <dl className={classes.list}>
            {entries.map(([key, v]) => {
                if (schemaApi.omit(schema, key)) {
                    return null;
                }
                const itemPath = `${path}.${key}`;
                return (
                    <div key={itemPath} className={classes.item}>
                        <JsonPropertyLabel label={key} />
                        <dd className={classes.value}>
                            <JsonPropertyValue propKey={key}
                                value={v}
                                schema={schema}
                                model={value as JsonValue}
                                path={itemPath} />
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
};

const JsonBlockRenderer: FC<{ block: JsonBlock }> = ({ block }) => {
    if (!isJsonBlock(block)) {
        console.error("JsonBlockRenderer used with non-JSON block:", block);
        return null;
    }

    return (
        <div className={classes.root}>
            <JsonValueRenderer value={block.value} schema={block.config} path="$" />
        </div>
    );
};

export default JsonBlockRenderer;
