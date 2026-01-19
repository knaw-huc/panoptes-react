import {useRouter} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import iconArrowLeft from 'assets/icon-arrow-left.svg';
import classes from './BackLink.module.css';
import {useTranslate} from "hooks/index.ts";

export default function BackLink() {

    const router = useRouter();
    const { searchPath } = usePanoptes();
    const [dataset] = useDataset('detail');
    const translate = useTranslate();

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
                {translate('panoptes.back')}
            </a>
        </div>
    );

}