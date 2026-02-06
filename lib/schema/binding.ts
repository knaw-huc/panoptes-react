export interface ParsedBinding {
    source: 'data';
    path: string[];
    rawPath: string;
}

const BINDING_REGEX = /^\$data#\/(.+)$/;

export function isBindingExpression(value: string): boolean {
    return BINDING_REGEX.test(value);
}

export function parseBinding(expression: string): ParsedBinding {
    const match = expression.match(BINDING_REGEX);
    if (!match) {
        throw new Error(`Invalid binding expression: ${expression}. Expected format: $data#/path`);
    }

    const rawPath = match[1];
    const path = rawPath.split('/');

    return { source: 'data', path, rawPath };
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
