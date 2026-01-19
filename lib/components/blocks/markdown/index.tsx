import {Block} from "components/blocks/BlockLoader.tsx";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export interface MarkDownBlock extends Block {
    type: 'markdown';
    value: string;
}

export default function RenderMarkdown({block}: { block: MarkDownBlock }) {
    return (
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {block.value}
        </ReactMarkdown>
    );
}
