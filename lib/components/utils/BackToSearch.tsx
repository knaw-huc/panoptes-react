import {Link} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './BackToSearch.module.css';

export default function BackToSearch() {
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
