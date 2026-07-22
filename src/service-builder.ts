import { Effect, pipe, type Schema } from "effect";
import { type HttpBody, HttpClient, type HttpClientError, HttpClientRequest, HttpClientResponse } from "effect/unstable/http" 

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

export class ServiceBuilder {
    static make<
        const BaseUrl extends string,
        const ServiceId extends string
    >(
        baseUrl: BaseUrl,
        serviceId: ServiceId
    ): Effect.Effect<ServiceBuilder, never, HttpClient.HttpClient> {
        return Effect.gen(function*(){
            const client = yield* HttpClient.HttpClient;
            const operation = <T extends string>(op: T) =>`${baseUrl}/${serviceId}/${op}` as const;

            return {
                makeOperation(config) {
                    return (payload, meta) => Effect.gen(function*(){
                    const url = operation(config.operationId);

                    const request = yield* pipe(
                        HttpClientRequest.post(url),
                        req => meta?.headers ? HttpClientRequest.setHeaders(meta?.headers ?? {})(req): req,
                        req => meta?.bearerToken ? HttpClientRequest.bearerToken(meta.bearerToken)(req): req,
                        HttpClientRequest.schemaBodyJson(config.inputSchema)(payload)
                    )

                    const response = yield* client.execute(request);

                    return yield* HttpClientResponse.schemaBodyJson(config.outputSchema)(response);
                })
                },
            }
        })
    }
}