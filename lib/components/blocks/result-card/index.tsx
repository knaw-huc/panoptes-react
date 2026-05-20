import Block from 'components/blocks/Block';
import ResultCard, {ResultCardProps} from './ResultCard';

export interface ResultCardBlock extends Block {
    type: 'result-card';
    value: ResultCardProps;
}

export default function RenderResultCardBlock({block}: { block: ResultCardBlock }) {
    return <ResultCard {...block.value}/>;
}
