import {Fragment} from 'react';
import {Link, useParams} from '@tanstack/react-router';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import {useDetails, CmdiBlock} from 'queries/details';
import Cmdi from 'components/blocks/Cmdi';
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
    const {dataset, id} = useParams({from: '/$dataset/$id'});
    const {data: details} = useDetails(dataset, id);

    return (
        <div className={classes.main}>
            {details.item_data.map((item, index) => <Fragment key={index}>
                {item.type === 'cmdi' && <Cmdi record={(item as CmdiBlock).value[0]}/>}
            </Fragment>)}
        </div>
    );
}

function BackToSearch() {
    return (
        <div className={classes.backToSearch}>
            <Link to="/">
                <img src={iconArrowLeft} alt=""/>
                Search
            </Link>
        </div>
    );
}
