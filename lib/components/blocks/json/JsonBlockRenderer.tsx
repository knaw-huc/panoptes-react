import React from "react";
import {JsonBlock, JsonPrimitive} from "components/blocks/json/index.tsx";

function formatPrimitive(value: JsonPrimitive): string {
    if (typeof value === "string") return `"${value}"`;
    if (value === null) return "null";
    return String(value);
}

function colorForPrimitive(value: JsonPrimitive): string {
    if (typeof value === "string") return "#0B7285";   // teal-ish
    if (typeof value === "number") return "#5C940D";   // green-ish
    if (typeof value === "boolean") return "#E67700";  // orange-ish
    return "#868E96";                                  // gray for null
}

const indentSize = 16;

const JsonBlockRenderer: React.FC<JsonBlock> = ({
                                                          value,
                                                          label,
                                                          level = 0,
                                                      }: JsonBlock) => {
    const indentStyle: React.CSSProperties = {
        paddingLeft: level * indentSize,
        fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
        fontSize: 13,
        lineHeight: 1.4,
    };

    // Primitive
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
    ) {
        return (
            <div style={indentStyle}>
                {label && <span style={{ fontWeight: 600 }}>{label}: </span>}
                <span style={{ color: colorForPrimitive(value) }}>
          {formatPrimitive(value)}
        </span>
            </div>
        );
    }

    // Array
    if (Array.isArray(value)) {
        return (
            <div style={indentStyle}>
                {label && <span style={{ fontWeight: 600 }}>{label}: </span>}
                <details open>
                    <summary>[Array] ({value.length})</summary>
                    <div>
                        {value.map((item, index) => (
                            <JsonBlockRenderer
                                key={index}
                                value={item}
                                label={String(index)}
                                level={level + 1}
                            />
                        ))}
                    </div>
                </details>
            </div>
        );
    }

    // Object
    const entries = Object.entries(value);

    return (
        <div style={indentStyle}>
            {label && <span style={{ fontWeight: 600 }}>{label}: </span>}
            <details open>
                <summary>{"{Object}"}</summary>
                <div>
                    {entries.map(([k, v]) => (
                        <JsonBlockRenderer key={k} value={v} label={k} level={level + 1} />
                    ))}
                </div>
            </details>
        </div>
    );
};

export default JsonBlockRenderer;
