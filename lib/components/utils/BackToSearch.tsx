import {useRouter} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './BackToSearch.module.css';

export default function BackToSearch() {

    const router = useRouter();
    const { searchPath } = usePanoptes();
    const [dataset] = useDataset('detail');

    const handleBack = () => {
        if (router.history.length > 1) {
            router.history.back();
        } else {
            router.navigate({
                to: searchPath,
                params: { dataset },
            });
        }
    };

    return (
        <div className={classes.backToSearch}>
            <a onClick={handleBack} className={classes.button}>
                <img src={iconArrowLeft} alt='' />
            </a>
        </div>
    );

}