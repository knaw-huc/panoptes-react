# Panoptes React

Panoptes React is a React-based dataset search/browse tool backed by Panoptes. It is both a reusable React library (ES
module) that you can embed in your own React app and a standalone application if no further customization is needed.

The library exposes helpers to bootstrap a Panoptes-enabled React application and requires TanStack Query for data
fetching and caching and TanStack Router for client-side routing.

Install the library using:
`npm install @knaw-huc/panoptes-react`\
Build the library using:
`npm run build`\
Build the application using:
`npm run build:app`\
Run for development:
`npm run dev`

- [How to run the application](#how-to-run-the-application)
    - [Mock behavior](#mock-behavior)
- [How to use this library](#how-to-use-this-library)
    - [Setup](#setup)
    - [Customization](#customization)
        - [Hooks](#hooks)
        - [Blocks](#blocks)

## How to run the application

The application uses the following Vite env vars (prefix `VITE_`). You can set them in a .env, .env.local, or via the
shell when running Vite. You can also set them when running the app as a Docker container.

- `VITE_PANOPTES_URL` — Base URL of the Panoptes backend
- `VITE_PANOPTES_IS_EMBEDDED` — `true` to run in embedded mode, else `false` for rendering a menu bar at the top of the
  page
- `VITE_PANOPTES_SEARCH_PATH` — Route for search page; it must include the dataset parameter `$dataset` unless the
  dataset is configured globally via VITE_PANOPTES_DATASET
- `VITE_PANOPTES_DETAIL_PATH` — Route for detail page; it must include the dataset parameter `$dataset` unless the
  dataset is configured globally via VITE_PANOPTES_DATASET, and it must include the id parameter `$id`
- `VITE_PANOPTES_DATASET` — Optional dataset identifier to use globally for all routes

### Mock behavior

If `VITE_PANOPTES_URL` resolves to https://example.org, the application will start a mock API using MSW (see
`src/serverMock.ts`) so you can try the UI without a real backend. The MSW service worker is emitted into `public/`
(configured via the `msw` field in `package.json`).

## How to use this library

### Setup

To use this library, you will have to set up TanStack Query and wrap the application tree with the `Panoptes` context.
This context contains the configuration for the application:

| Parameter         | Value type       | Required? | Default value | Description                                                                                                                                                   |
|-------------------|------------------|-----------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`             | `string`         | ✓         |               | Base URL of the Panoptes backend                                                                                                                              |
| `isEmbedded`      | `boolean`        |           | `false`       | `true` to run in embedded mode, else `false` for rendering a menu bar at the top of the page                                                                  |
| `searchPath`      | `string`         | ✓         |               | Route for search page; it must include the dataset parameter `$dataset` unless the dataset is configured globally                                             |
| `detailPath`      | `string`         | ✓         |               | Route for detail page; it must include the dataset parameter `$dataset` unless the dataset is configured globally, and it must include the id parameter `$id` |
| `dataset`         | `string`         |           |               | Optional dataset identifier to use globally for all routes                                                                                                    |
| `searchComponent` | `RouteComponent` |           |               | Replace the default `Search` component with a custom React component                                                                                          |
| `detailComponent` | `RouteComponent` |           |               | Replace the default `Detail` component with a custom React component                                                                                          |
| `blocks`          | `Block[]`        |           |               | (TODO) Add additional `Block`s to Panoptes for customized rendering, see [Blocks](#blocks)                                                                    |

You can use the `createPanoptesRoot` helper as an alternative for
`createRoot` ([see React docs](https://react.dev/reference/react-dom/client/createRoot)) to create a root element for
your application tree. It behaves just like `createRoot` but will set up TanStack Query and the Panoptes context
provider for you in [Strict Mode](https://react.dev/reference/react/StrictMode).

In addition to TanStack Query, the library also requires TanStack Router for client-side routing. You can set up the
`RouterProvider` yourself or use the `PanoptesRouterProvider` component provided by this library. The
`PanoptesRouterProvider` will configure the application routes based on the configuration provided in the Panoptes
context.

Example setup:

```tsx
import {createPanoptesRoot, PanoptesRouterProvider} from '@knaw-huc/panoptes-react';

const root = createPanoptesRoot(document.getElementById('root')!, {
    url: 'https://your-panoptes.example.org',
    isEmbedded: false,
    searchPath: '/search',
    detailPath: '/detail/$id',
    dataset: 'your-dataset-id'
});

root.render(<PanoptesRouterProvider/>);
```

### Customization

The library exposes a set of hooks to use Panoptes in your own React components. Both the default `Search` and `Detail`
components can be replaced with custom components (using these hooks) by providing custom components to the
`searchComponent` and `detailComponent` parameters of the Panoptes context. That is one way of customizing the UI. The
other way is by providing custom `blocks` for Panoptes to render.

#### Hooks

`const conf = usePanoptes()`

Returns the configuration object from Panoptes. See [Setup](#setup) for the available parameters.

`const [dataset, id] = useDataset(source: 'search' | 'detail')`

Returns the dataset and the identifier for the current route.

`const {searchFn, facets, pageSize} = useSearch(dataset: string)`

Handles search functionality for the given dataset. Returns a `searchFn` function that can be used to fetch results,
a `facets` object with the applied facets for the dataset. The `pageSize` parameter is the page size for the search
results.`

`const facets = useFacets()`

Returns the configured facets for the current dataset.

`const {items} = useFacet(name: string)`

Returns the facet items for the given facet.

`const details = useDetails()`

Returns the details for the current item.

#### Blocks

Blocks are plugin-like React components that can be used to customize the rendering of both search result card and the
detail view. Through Panoptes, you can configure the list of blocks to be rendered for each dataset for both the search
result cards as for the detail view. Panoptes come prepared with some default blocks, but you can also provide your own
blocks (see [Setup](#setup)).

Panoptes provides the following blocks out of the box:

- `list`: Renders a list of items, this may include deep hierarchies
- `cmdi`: Renders a CMDI record
- (TODO) More to come

If you want to provide your own custom blocks, you will have to know the `Block` interface which is defined as follows:

```ts
type BlockValue = string | object | Block[];

interface Block {
    type: string;
    value: BlockValue;
}
```

A block consists of a `type` and a `value`. The `type` determines the rendering of the block. The value is passed to the
block component as a property. A simple block component could look like this:

```tsx
interface HelloWorldBlock extends Block {
    type: 'hello_world';
    value: {hello?: string};
}

function RenderHelloWorld({block}: { block: HelloWorldBlock }) {
    return (
        <h1>Hello ${block.value.hello || 'World'}</h1>
    );
}
```
