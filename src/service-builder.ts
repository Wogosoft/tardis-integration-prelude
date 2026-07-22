import { type Effect, Context, type Schema } from "effect";
import type { HttpBody, HttpClientError } from "effect/unstable/http" 

export interface OperationMeta {
    headers?: Record<string, string>,
    /**
     * Utility: set the bearer token for the request. 
     * Will override Authorization header
     */
    bearerToken?: string
}

export type IntegrationError =
  | HttpClientError.HttpClientError
  | Schema.SchemaError
  | HttpBody.HttpBodyError

export interface ServiceBuilder {
    makeOperation<
        const OperationId extends string,
        const In extends Schema.Top,
        const Out extends Schema.Top,
    >(config: {
        operationId: OperationId,
        inputSchema: In,
        outputSchema: Out,
    }): (payload: Schema.Schema.Type<In>, meta?: OperationMeta) => Effect.Effect<
        Out["Type"],
        IntegrationError,
        Out["DecodingServices"] | In["EncodingServices"]
    >
}

export const ServiceBuilder: Context.Service<ServiceBuilder, ServiceBuilder> = 
    Context.Service<ServiceBuilder>("ServiceBuilder")