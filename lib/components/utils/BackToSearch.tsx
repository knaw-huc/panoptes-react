import {Link} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './BackToSearch.module.css';
import {useTranslations} from "../../hooks";
import {get} from "radash";

export default function BackToSearch({
    labelKey = 'search'
}) {
    const {searchPath} = usePanoptes();
    const [dataset] = useDataset('detail');
    const { data:translations } = useTranslations();

    return (
        <div className={classes.backToSearch}>
            <Link to={searchPath} params={{dataset}}>
                <img src={iconArrowLeft} alt=""/>
                {get(translations, labelKey, "Search")}
            </Link>
        </div>
    );
}
