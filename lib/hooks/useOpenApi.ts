import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    OpenAPISpec,
    OpenAPIParser,
    ResolvedOperation,
    loadOpenAPISpec,
} from '../schema';

export interface UseOpenApiResult {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    parser: OpenAPIParser | null;
    getOperation: (operationId: string) => ResolvedOperation | undefined;
    baseUrl: string;
}

export default function useOpenApi(
    spec: string | OpenAPISpec | undefined
): UseOpenApiResult {
    // Use TanStack Query for fetching remote specs
    const {
        data: loadedSpec,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['openapi-spec', typeof spec === 'string' ? spec : 'inline'],
        queryFn: () => (spec ? loadOpenAPISpec(spec) : Promise.resolve(null)),
        enabled: !!spec,
        staleTime: Infinity, // OpenAPI specs don't change during a session
    });

    // Create parser from loaded spec
    const parser = useMemo(() => {
        if (!loadedSpec) {
            return null;
        }
        return new OpenAPIParser(loadedSpec);
    }, [loadedSpec]);

    // Helper to get operation
    const getOperation = (operationId: string): ResolvedOperation | undefined => {
        return parser?.getOperation(operationId);
    };

    // Get base URL
    const baseUrl = parser?.getBaseUrl() || '';

    return {
        isLoading,
        isError,
        error: error as Error | null,
        parser,
        getOperation,
        baseUrl,
    };
}
