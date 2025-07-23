import {Link} from '@tanstack/react-router';
import BlockLoader from 'components/blocks/BlockLoader';
import useDataset from 'hooks/useDataset';
import useDetails from 'hooks/useDetails';
import usePanoptes from 'hooks/usePanoptes';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './Detail.module.css';

export default function Detail() {
    return (
        <div className={classes.detail}>
            <DetailSide/>
            <DetailMain/>
        </div>
    );
}

function DetailSide() {
    return (
        <div className={classes.side}>
            <BackToSearch/>
        </div>
    );
}

function DetailMain() {
    const {data: details} = useDetails();

    return (
        <div className={classes.main}>
            {details.item_data.map((block, index) =>
                <BlockLoader key={index} block={block}/>)}
        </div>
    );
}

function BackToSearch() {
    const {searchPath} = usePanoptes();
    const [dataset] = useDataset('detail');

    return (
        <div className={classes.backToSearch}>
            <Link to={searchPath} params={{dataset}}>
                <img src={iconArrowLeft} alt=""/>
                Search
            </Link>
        </div>
    );
}
