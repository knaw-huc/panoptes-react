import useDatasets from 'hooks/useDatasets';
import classes from './DatasetsOverview.module.css';
import {usePanoptes} from "../../hooks";

export default function DatasetsOverview() {
    const {data: datasets } = useDatasets();
    const { translateFn } = usePanoptes();

    return (
        <>
            <h1>{translateFn ? translateFn('panoptes.available-datasets') : 'Available datasets'}</h1>
            <div className={classes.index}>
                <ul className={classes.list}>
                    {datasets.map(dataset => (
                        <li key={dataset.name}>
                            <a href={dataset.data_configuration.home_url}
                               className={classes.card}>
                                <h2 className={classes.title}>{dataset.name}</h2>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
