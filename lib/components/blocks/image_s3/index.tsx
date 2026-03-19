import Block from 'components/blocks/Block';

export interface S3ImageBlock extends Block {
    type: 's3_image';
    value: string;
}

export default function RenderS3Image({block}: { block: S3ImageBlock }) {
    return (
        <img className={"aspect-auto w-full max-w-md rounded-lg"} src={block.value}/>
    )
}
