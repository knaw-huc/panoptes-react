import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {
    deepGet,
    omitProperty,
} from "./schemaSelectors.ts";
import {
    JsonBlock,
    JsonSchema,
    JsonValue,
} from "components/blocks/json/index.tsx";
import classes from "./JsonBlockRenderer.module.css";
import useBlock from "hooks/useBlock.ts";
import {Block} from "components/blocks";
import GhostLine from "components/utils/GhostLine.tsx";


const isJsonBlock = (block: JsonBlock) => block.type === "json";

/** humanize "some_keyName" -> "Some key name" */
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

/** Renders a configured block - may throw if block type not found */
const ConfiguredBlockRenderer = ({
    config,
    value,
    model,
}: {
    config: Block;
    value: JsonValue;
    model: JsonValue;
}) => {
    const BlockComponent = useBlock(config);

    if (!BlockComponent) {
        return null;
    }

    const block = { ...config, value, model };
    return (
        <Suspense fallback={<GhostLine/>}>
            <BlockComponent block={block} />
        </Suspense>
    );
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
    const config = deepGet(schema, propKey) as Block;
    const childSchema = schemaApi.childSchema(schema, propKey);

    if (!config?.type) {
        return <JsonValueRenderer value={value} schema={childSchema} path={path} />;
    }

    return (
        <ErrorBoundary fallback={<JsonValueRenderer value={value} schema={childSchema} path={path} />}>
            <ConfiguredBlockRenderer config={config} value={value} model={model} />
        </ErrorBoundary>
    );
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

const JsonBlockRenderer = ({ block }: { block: JsonBlock }) => {
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
