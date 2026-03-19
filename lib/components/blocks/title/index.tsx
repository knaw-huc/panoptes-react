import {Block} from "components/blocks/BlockLoader.tsx";

export interface TitleBlock extends Block {
    type: 'title';
    value: string;
}

export default function RenderTitle({block}: {block: TitleBlock}) {
    return (
        <div className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
            <h1>{block.value}</h1>
        </div>
    )
}
