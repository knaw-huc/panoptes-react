import {useRouter} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './BackLink.module.css';
import { useTranslations } from '../../hooks';
import { get } from 'radash';

export default function BackLink() {

    const router = useRouter();
    const { searchPath } = usePanoptes();
    const [dataset] = useDataset('detail');
    const { data: translations } = useTranslations();

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
        <div className={classes.back}>
            <a onClick={handleBack} className={classes.button}>
                <img src={iconArrowLeft} alt="" />
                {get(translations, 'back', 'Back')}
            </a>
        </div>
    );

}
