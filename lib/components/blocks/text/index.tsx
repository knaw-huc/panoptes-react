import {Block} from "components/blocks/BlockLoader.tsx";

export interface TextBlock extends Block {
    type: 'title';
    value: string;
}

export default function RenderText({block}: {block: TextBlock}) {
    return (
        <p className={"my-8"}>{block.value}</p>
    )
}
