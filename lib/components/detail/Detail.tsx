import {Fragment} from 'react';
import {useParams} from '@tanstack/react-router';
import {useDetails, CmdiBlock} from 'queries/details';
import Cmdi from 'components/blocks/Cmdi';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './Detail.module.css';

export default function Detail() {
    const {dataset, id} = useParams({from: '/$dataset/$id'});

    return (
        <div className={classes.detail}>
            <DetailSide dataset={dataset}/>
            <DetailMain dataset={dataset} id={id}/>
        </div>
    );
}

function DetailSide({dataset}: { dataset: string }) {
    return (
        <div className={classes.side}>
            <BackToSearch dataset={dataset}/>
        </div>
    );
}

function DetailMain({dataset, id}: { dataset: string, id: string }) {
    const {data: details} = useDetails(dataset, id);

    return (
        <div className={classes.main}>
            {details.item_data.map((item, index) => <Fragment key={index}>
                {item.type === 'cmdi' && <Cmdi record={(item as CmdiBlock).value}/>}
            </Fragment>)}
        </div>
    );
}

function BackToSearch({dataset}: { dataset: string }) {
    return (
        <div className={classes.backToSearch}>
            <a href={`/${dataset}`}>
                <img src={iconArrowLeft} alt=""/>
                Search
            </a>
        </div>
    );
}
