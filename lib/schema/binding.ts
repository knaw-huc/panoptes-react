import { BindingContext } from './types';

export type BindingSource = 'data' | 'global';

export interface ParsedBinding {
    source: BindingSource;
    path: string[];
    rawPath: string;
}

const BINDING_REGEX = /^\$(data|global)#\/(.+)$/;

export function isBindingExpression(value: string): boolean {
    return BINDING_REGEX.test(value);
}

export function parseBinding(expression: string): ParsedBinding {
    const match = expression.match(BINDING_REGEX);
    if (!match) {
        throw new Error(`Invalid binding expression: ${expression}. Expected format: $data#/path or $global#/path`);
    }

    const source = match[1] as BindingSource;
    const rawPath = match[2];
    const path = rawPath.split('/');

    return { source, path, rawPath };
}

export function resolveBinding(context: BindingContext, expression: string): unknown {
    const { source, path } = parseBinding(expression);

    let root: unknown;
    if (source === 'data') {
        // Check form state values first (for edited values), then fall back to data
        root = context.formState.values[expression] !== undefined
            ? { [path[0]]: context.formState.values }
            : context.data;
    } else {
        root = context.globals;
    }

    return getNestedValue(root, path);
}

export function getNestedValue(obj: unknown, path: string[]): unknown {
    let current: unknown = obj;

    for (const key of path) {
        if (current === null || current === undefined) {
            return undefined;
        }
        if (typeof current !== 'object') {
            return undefined;
        }
        current = (current as Record<string, unknown>)[key];
    }

    return current;
}

export function setNestedValue(
    obj: Record<string, unknown>,
    path: string[],
    value: unknown
): Record<string, unknown> {
    if (path.length === 0) {
        return obj;
    }

    const [head, ...rest] = path;

    if (rest.length === 0) {
        return { ...obj, [head]: value };
    }

    const nested = obj[head];
    const nestedObj = (typeof nested === 'object' && nested !== null)
        ? nested as Record<string, unknown>
        : {};

    return {
        ...obj,
        [head]: setNestedValue(nestedObj, rest, value)
    };
}

export function updateFormValue(
    formValues: Record<string, unknown>,
    expression: string,
    value: unknown
): Record<string, unknown> {
    // Store the value keyed by the full expression for easy lookup
    return {
        ...formValues,
        [expression]: value
    };
}

export function getFormValue(
    context: BindingContext,
    expression: string
): unknown {
    // Check form state first (for user edits)
    if (expression in context.formState.values) {
        return context.formState.values[expression];
    }

    // Fall back to resolved binding from data/globals
    return resolveBinding(context, expression);
}

export function resolveGlobals(
    globalsDefinition: Record<string, string>,
    data: Record<string, unknown>
): Record<string, unknown> {
    const globals: Record<string, unknown> = {};
    const tempContext: BindingContext = {
        data,
        globals: {},
        formState: { values: {}, dirty: new Set(), errors: {}, touched: new Set() }
    };

    for (const [key, expression] of Object.entries(globalsDefinition)) {
        if (isBindingExpression(expression)) {
            globals[key] = resolveBinding(tempContext, expression);
        } else {
            globals[key] = expression;
        }
    }

    return globals;
}

export function resolveOperationParameters(
    parameters: Record<string, string | number | boolean>,
    context: BindingContext
): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(parameters)) {
        if (typeof value === 'string' && isBindingExpression(value)) {
            resolved[key] = getFormValue(context, value);
        } else {
            resolved[key] = value;
        }
    }

    return resolved;
}

export function collectDirtyValues(
    context: BindingContext
): Record<string, unknown> {
    const dirtyValues: Record<string, unknown> = {};

    for (const expression of context.formState.dirty) {
        if (expression in context.formState.values) {
            dirtyValues[expression] = context.formState.values[expression];
        }
    }

    return dirtyValues;
}

export function buildSubmitPayload(
    context: BindingContext,
    includeClean: boolean = false
): Record<string, unknown> {
    if (includeClean) {
        return { ...context.formState.values };
    }
    return collectDirtyValues(context);
}
