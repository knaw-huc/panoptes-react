import {useMemo} from 'react';
import PropertyList from './PropertyList';
import CmdiRecord, {
    CmdiRecordComponent,
    CmdiRecordContent,
    CmdiRecordContentComponent,
    CmdiRecordElement
} from 'interfaces/cmdi';

interface CmdiRecordData {
    [label: string]: string[] | CmdiRecordData[];
}

export default function Cmdi({record}: { record: CmdiRecord }) {
    const data = useMemo(() => mapCmdiRecord(record), [record]);

    return (
        <PropertyList data={data}/>
    );
}

function mapCmdiRecord(data: CmdiRecord): CmdiRecordData {
    const componentsRecords = data.record.find(rec => rec.name === 'Components')?.value as CmdiRecordComponent[];
    return (mapToCmdiRecordData(data.content, componentsRecords)[1] as CmdiRecordData[])[0];
}

function mapToCmdiRecordData(
    content: CmdiRecordContent,
    record: (CmdiRecordComponent | CmdiRecordElement)[]
): [string, string[] | CmdiRecordData[]] {
    const records = record.filter(r => r.name === content.attributes.name);

    if (content.type === 'Component') {
        const component = content as CmdiRecordContentComponent;
        const values = records.map(r =>
            Object.fromEntries(component.content.map(c =>
                mapToCmdiRecordData(c, r.value as CmdiRecordElement[]))));

        return [content.attributes.label, values];
    }

    return [content.attributes.label, (records as CmdiRecordElement[]).map(el => el.value)];
}
