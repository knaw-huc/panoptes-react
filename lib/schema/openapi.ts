// ============================================
// OpenAPI Types (simplified subset)
// ============================================

export interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    paths: Record<string, PathItem>;
}

export interface PathItem {
    get?: Operation;
    post?: Operation;
    put?: Operation;
    delete?: Operation;
    patch?: Operation;
}

export interface Operation {
    operationId?: string;
    summary?: string;
    description?: string;
    parameters?: Parameter[];
    requestBody?: RequestBody;
    responses?: Record<string, Response>;
}

export interface Parameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required?: boolean;
    schema?: Schema;
}

export interface RequestBody {
    required?: boolean;
    content?: Record<string, MediaType>;
}

export interface MediaType {
    schema?: Schema;
}

export interface Response {
    description: string;
    content?: Record<string, MediaType>;
}

export interface Schema {
    type?: string;
    format?: string;
    properties?: Record<string, Schema>;
    items?: Schema;
    $ref?: string;
}

// ============================================
// Resolved Operation Configuration
// ============================================

export interface ResolvedOperation {
    operationId: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    pathParameters: string[];
    queryParameters: string[];
    hasRequestBody: boolean;
}

// ============================================
// OpenAPI Parser
// ============================================

export class OpenAPIParser {
    private spec: OpenAPISpec;
    private operationIndex: Map<string, ResolvedOperation>;

    constructor(spec: OpenAPISpec) {
        this.spec = spec;
        this.operationIndex = new Map();
        this.buildOperationIndex();
    }

    private buildOperationIndex(): void {
        const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;

        for (const [path, pathItem] of Object.entries(this.spec.paths)) {
            for (const method of methods) {
                const operation = pathItem[method];
                if (operation?.operationId) {
                    const resolved: ResolvedOperation = {
                        operationId: operation.operationId,
                        method: method.toUpperCase() as ResolvedOperation['method'],
                        path,
                        pathParameters: this.extractPathParameters(path, operation),
                        queryParameters: this.extractQueryParameters(operation),
                        hasRequestBody: !!operation.requestBody,
                    };
                    this.operationIndex.set(operation.operationId, resolved);
                }
            }
        }
    }

    private extractPathParameters(path: string, _operation: Operation): string[] {
        const pathParams: string[] = [];

        // Extract from path template: /users/{userId}/profiles/{profileId}
        const matches = path.matchAll(/\{([^}]+)\}/g);
        for (const match of matches) {
            pathParams.push(match[1]);
        }

        return pathParams;
    }

    private extractQueryParameters(operation: Operation): string[] {
        if (!operation.parameters) {
            return [];
        }
        return operation.parameters
            .filter((p) => p.in === 'query')
            .map((p) => p.name);
    }

    getOperation(operationId: string): ResolvedOperation | undefined {
        return this.operationIndex.get(operationId);
    }

    getAllOperations(): ResolvedOperation[] {
        return Array.from(this.operationIndex.values());
    }

    getBaseUrl(): string {
        return this.spec.servers?.[0]?.url || '';
    }
}

// ============================================
// URL Builder
// ============================================

export function buildOperationUrl(
    baseUrl: string,
    operation: ResolvedOperation,
    parameters: Record<string, unknown>
): string {
    // Replace path parameters
    let url = operation.path;
    for (const param of operation.pathParameters) {
        const value = parameters[param];
        if (value !== undefined && value !== null) {
            url = url.replace(`{${param}}`, encodeURIComponent(String(value)));
        }
    }

    // Add query parameters
    const queryParams = new URLSearchParams();
    for (const param of operation.queryParameters) {
        const value = parameters[param];
        if (value !== undefined && value !== null) {
            queryParams.set(param, String(value));
        }
    }

    const queryString = queryParams.toString();
    const fullUrl = baseUrl + url;

    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
}

// ============================================
// Spec Loader
// ============================================

export async function loadOpenAPISpec(source: string | OpenAPISpec): Promise<OpenAPISpec> {
    if (typeof source === 'string') {
        // It's a URL, fetch it
        const response = await fetch(source);
        if (!response.ok) {
            throw new Error(`Failed to load OpenAPI spec from ${source}: ${response.statusText}`);
        }
        return response.json();
    }
    // It's already a spec object
    return source;
}
