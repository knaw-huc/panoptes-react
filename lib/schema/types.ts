import Block from '../components/blocks/Block';

export interface ScreenDefinition {
    id: string;
    label: string;
    activeTabId?: string;
    screenType: ScreenType;
    tabs: TabDefinition[];
    links?: LinkDefinition[];
    actions: ActionDefinition[];
    form: FormDefinition;
}

export type ScreenType = 'normal';

export interface TabDefinition {
    id: string;
    label: string;
    operation?: OperationDefinition;
    operationList?: OperationListItem[];
}

export interface OperationListItem {
    id: string;
    label: string;
    operation: OperationDefinition;
}

export interface OperationDefinition {
    operationId: string;
    parameters: Record<string, string | number | boolean>;
}

export interface LinkDefinition {
    id: string;
    label: string;
    operation?: OperationDefinition;
    href?: string;
}

export interface ActionDefinition {
    id: string;
    label: string;
    activate: ActivationType;
    confirmation: ConfirmationDefinition;
    operation: OperationDefinition;
}

export type ActivationType = 'always' | 'onDirty' | 'onValid' | 'onDirtyAndValid';

export interface ConfirmationDefinition {
    askConfirmation: 'always' | 'never' | 'onDirty';
    labels?: ConfirmationLabels;
}

export interface ConfirmationLabels {
    title?: string;
    message?: string;
    ok?: string;
    cancel?: string;
}

export interface FormDefinition {
    rows: RowDefinition[];
}

export interface RowDefinition {
    displayType?: DisplayType;
    label?: string;
    groupId?: string;
    elements?: ElementDefinition[];
    columns?: ColumnDefinition[];
}

export type DisplayType = 'header' | 'group' | 'footer' | 'row';

export interface ColumnDefinition {
    elements: ElementDefinition[];
}

export interface ElementDefinition {
    value: string;
    hidden?: boolean;
    addIndeterminate?: boolean;
    label?: string;
    infoLabel?: string;
    type?: string;
    config?: Record<string, unknown>;
}

export type ScreenBlockValue = Record<string, unknown>;

export interface ScreenBlock extends Block {
    type: 'screen';
    value: ScreenBlockValue;
    config: ScreenDefinition;
}
