import {ReactNode} from 'react';
import classes from './PropertyList.module.css';

type PropertyListValue = PropertyListData | string | number;

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
    const items = Array.isArray(value) ? value : [value];

    return (
        <>
            <PropertyListLabel>{label}</PropertyListLabel>

            {items.map((item, index) => (
                <PropertyListValue key={index}>
                    {typeof item === 'object'
                        ? <PropertyList data={item as PropertyListData}/>
                        : item}
                </PropertyListValue>
            ))}
        </>
    );
}

function PropertyListLabel({children}: { children: ReactNode }) {
    return (
        <dt className={classes.label}>
            {children}
        </dt>
    );
}

function PropertyListValue({children}: { children: ReactNode }) {
    return (
        <dd className={classes.value}>
            {children}
        </dd>
    );
}
