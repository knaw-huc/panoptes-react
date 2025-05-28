export default interface CmdiRecord {
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
