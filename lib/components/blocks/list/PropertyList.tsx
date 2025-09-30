import classes from './PropertyList.module.css';

type PropertyListValue = PropertyListData | string | number | boolean | null;

export interface PropertyListData {
    [label: string]: PropertyListValue | PropertyListValue[];
}

export default function PropertyList({data}: { data: PropertyListData }) {
    return (
        <dl className={classes.list}>
            {Object.entries(data).map(([key, value]) =>
                <PropertyListItem key={key} label={key} value={value}/>)}
        </dl>
    );
}

function PropertyListItem({label, value}: { label: string, value: PropertyListValue | PropertyListValue[] }) {
    return (
        <div className={classes.item}>
            <PropertyListLabel label={label}/>
            <PropertyListValues value={value}/>
        </div>
    );
}

function PropertyListLabel({label}: { label: string }) {
    return (
        <dt className={classes.label}>
            {label
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase())}
        </dt>
    );
}

function PropertyListValues({value}: { value: PropertyListValue | PropertyListValue[] }) {
    const values = Array.isArray(value) ? (value.length > 0 ? value : [null]) : [value];

    return (
        <dd className={classes.value}>
            {values.length > 1 ? <ul>
                {values.map((value, index) => <li key={index}>
                    <PropertyListValue value={value}/>
                </li>)}
            </ul> : <PropertyListValue value={values[0]}/>}
        </dd>
    );
}

function PropertyListValue({value}: { value: PropertyListValue }) {
    if (value === null) {
        return <span className={classes.empty} title="No value">—</span>;
    }

    switch (typeof value) {
        case 'object':
            return <PropertyList data={value}/>;
        case 'boolean':
            return value ? 'Yes' : 'No';
        case 'number':
            return value.toLocaleString();
        default:
            return <pre className={classes.text}>{value}</pre>;
    }
}
