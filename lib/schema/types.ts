import Block from '../components/blocks/Block';

// ============================================
// Screen Definition Types
// ============================================

export interface ScreenDefinition {
    id: string;
    label: string;
    activeTabId?: string;
    screenType: ScreenType;
    globals?: Record<string, string>;
    tabs: TabDefinition[];
    links?: LinkDefinition[];
    actions: ActionDefinition[];
    form: FormDefinition;
}

export type ScreenType = 'normal' | 'modal' | 'wizard';

// ============================================
// Tab Types
// ============================================

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

// ============================================
// Operation Types
// ============================================

export interface OperationDefinition {
    operationId: string;
    parameters: Record<string, string | number | boolean>;
}

// ============================================
// Link Types
// ============================================

export interface LinkDefinition {
    id: string;
    label: string;
    operation?: OperationDefinition;
    href?: string;
}

// ============================================
// Action Types
// ============================================

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

// ============================================
// Form Definition Types
// ============================================

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
    bind?: boolean;
    readOnly?: boolean;
    hidden?: boolean;
    addIndeterminate?: boolean;
    required?: boolean;
    label?: string;
    infoLabel?: string;
    type?: string;
    config?: Record<string, unknown>;
}

// ============================================
// Binding Context Types
// ============================================

export interface BindingContext {
    data: Record<string, unknown>;
    globals: Record<string, unknown>;
    formState: FormState;
}

export interface FormState {
    values: Record<string, unknown>;
    dirty: Set<string>;
    errors: Record<string, string>;
    touched: Set<string>;
}

// ============================================
// Screen Block Type
// ============================================

export type ScreenBlockValue = Record<string, unknown>;

export interface ScreenBlock extends Block {
    type: 'screen';
    value: ScreenBlockValue;
    config: ScreenDefinition;
}


// ============================================
// Form Action Types (for reducer)
// ============================================

export type FormAction =
    | { type: 'SET_FIELD_VALUE'; path: string; value: unknown }
    | { type: 'SET_FIELD_TOUCHED'; path: string }
    | { type: 'SET_FIELD_ERROR'; path: string; error: string }
    | { type: 'CLEAR_FIELD_ERROR'; path: string }
    | { type: 'RESET_FORM'; initialValues: Record<string, unknown> }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_ERROR'; error: string };
