import {Block} from "components/blocks/BlockLoader.tsx";
import {PropertyListData} from "components/blocks/list/PropertyList.tsx";
import JsonBlockRenderer from "components/blocks/json/JsonBlockRenderer.tsx";

export type JsonData = Record<string, any>;

export type JsonSchema = Record<string, any>;

type JsonDataValue =
    | JsonData
    | string
    | number
    | boolean
    | null;

export type JsonDataItemValue =
    | JsonDataValue
    | JsonDataValue[];

export interface ListBlock extends Block {
    type: "json";
    value: PropertyListData;
}

const RenderEntity = ({ block }: { block: Block }) => {
    return (<JsonBlockRenderer block={block} />);
};

export default RenderEntity;
