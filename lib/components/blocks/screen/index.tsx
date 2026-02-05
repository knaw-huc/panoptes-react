import { ScreenProvider } from 'context/ScreenContext.tsx';
import { ScreenBlock } from '../../../schema';
import ScreenRenderer from './ScreenRenderer';

const RenderScreenBlock = ({ block }: { block: ScreenBlock }) => {
    return (
        <ScreenProvider screenDefinition={block.config} data={block.value}>
            <ScreenRenderer />
        </ScreenProvider>
    );
};

export default RenderScreenBlock;
