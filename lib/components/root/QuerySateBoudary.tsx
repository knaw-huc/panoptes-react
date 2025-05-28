import {ReactNode} from 'react';
import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {ErrorBoundary} from 'react-error-boundary';

export default function QueryStateBoundary({children}: { children: ReactNode }) {
    return (
        <QueryErrorResetBoundary>
            {({reset}) => (
                <ErrorBoundary onReset={reset} fallbackRender={({error, resetErrorBoundary}) => (
                    <div>
                        <h2>Something went wrong!</h2>

                        <pre>
                            {error.message}
                        </pre>

                        <div>
                            <button onClick={() => resetErrorBoundary()}>
                                Try again
                            </button>
                        </div>
                    </div>
                )}>
                    {children}
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
}
