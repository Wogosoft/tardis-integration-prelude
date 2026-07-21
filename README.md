# Tardis Integration Prelude

A base dependency for the Tardis integration.

Currently, has a single purpose: Allow transforming requests made in @wogo/tardis-client-http-effect-v4

## Usage

```ts
import { RequestTransform } from "@wogo/tardis-integration-prelude";

const addHeader = RequestTransform.layer(HttpClientRequest.setHeader("x-powered-by","wogo"))
```