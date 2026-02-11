import JsonBlockRenderer from "components/blocks/json/JsonBlockRenderer.tsx";
import {Block} from "components/blocks";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonData = JsonValue;
export type JsonSchema = JsonObject;

export interface JsonBlock extends Block {
    type: "json";
    value: JsonData;
    config: JsonSchema;
}

const RenderJsonBlock = ({ block }: { block: JsonBlock }) => {
    return (<JsonBlockRenderer block={block} />);
};

export default RenderJsonBlock;
