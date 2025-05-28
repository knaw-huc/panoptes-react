import {Link, useParams} from '@tanstack/react-router';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import {useDetails} from 'queries/details';
import CmdiRecord from 'interfaces/cmdi';
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
    const {data: details} = useDetails<CmdiRecord>(dataset, id);

    return (
        <div className={classes.main}>
            <Cmdi record={details.item_data}/>
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
