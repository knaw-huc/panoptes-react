import BlockLoader from 'components/blocks/BlockLoader';
import * as DetailLayout from 'components/utils/DetailLayout';
import BackToSearch from 'components/utils/BackToSearch';
import useDetails from 'hooks/useDetails';

export default function Detail() {
    return (
        <DetailLayout.Root>
            <DetailSide/>
            <DetailMain/>
        </DetailLayout.Root>
    );
}

function DetailSide() {
    return (
        <DetailLayout.Side>
            <BackToSearch/>
        </DetailLayout.Side>
    );
}

function DetailMain() {
    const {data: details} = useDetails();

    return (
        <DetailLayout.Main>
            {details.item_data.map((block, idx) =>
                <BlockLoader key={idx} block={block}/>)}
        </DetailLayout.Main>
    );
}
