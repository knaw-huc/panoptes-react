export interface CmdiRecord {
    id: string;
    nr: string;
    when: string;
    content: CmdiRecordContent;
    record: (CmdiRecordComponent | CmdiRecordElement)[];
}

export interface CmdiRecordContent {
    ID: string;
    level: number;
    type: 'Component' | 'Element';
    attributes: CmdiRecordContentAttributes;
}

export interface CmdiRecordContentComponent extends CmdiRecordContent {
    type: 'Component';
    content: CmdiRecordContent[];
}

export interface CmdiRecordContentElement extends CmdiRecordContent {
    type: 'Element';
}

export interface CmdiRecordContentAttributes {
    name: string;
    label: string;
    initialOrder: string;
}

export interface CmdiRecordComponent {
    name: string;
    type: 'component';
    value: (CmdiRecordComponent | CmdiRecordElement)[];
}

export interface CmdiRecordElement {
    name: string;
    type: 'element';
    value: string;
}

export interface CmdiRecordData {
    [label: string]: string[] | CmdiRecordData[];
}

export function mapCmdiRecord(data: CmdiRecord): CmdiRecordData {
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
        const values = records
            .filter(r => Array.isArray(r.value))
            .map(r =>
                Object.fromEntries(component.content.map(c =>
                    mapToCmdiRecordData(c, r.value as CmdiRecordElement[]))));

        return [content.attributes.label, values];
    }

    return [content.attributes.label, (records as CmdiRecordElement[]).map(el => el.value)];
}
