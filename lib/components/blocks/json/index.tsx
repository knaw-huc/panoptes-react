import JsonBlockRenderer from "components/blocks/json/JsonBlockRenderer.tsx";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface JsonBlock {
    value: JsonValue;
    label?: string;
    level?: number;
}

const RenderJsonBlock = ({block}: { block: JsonBlock }) => {
    return (<JsonBlockRenderer value={block.value} />);
};

export default RenderJsonBlock;
