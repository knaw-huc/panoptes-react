import BlockLoader from 'components/blocks/BlockLoader';
import * as DetailLayout from 'components/utils/DetailLayout';
import useDetails from 'hooks/useDetails';
import BackLink from "components/utils/BackLink.tsx";

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
            <BackLink/>
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
