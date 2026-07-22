import { Context, Effect, Layer, pipe } from "effect";
import { ServiceBuilder } from "./service-builder.ts";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

export interface ServiceFactory {
    makeServiceBuilder<
        const BaseUrl extends string,
        const ServiceId extends string,
    >(
        baseUrl: BaseUrl,
        serviceId: ServiceId
    ): Layer.Layer<ServiceBuilder, never, HttpClient.HttpClient>
}

function makeServiceBuilder<
    const BaseUrl extends string,
    const ServiceId extends string,
>(
    baseUrl: BaseUrl,
    serviceId: ServiceId
): Layer.Layer<ServiceBuilder, never, HttpClient.HttpClient> {
    return Layer.effect(ServiceBuilder, Effect.gen(function*(){
        const client = yield* HttpClient.HttpClient;
        const operation = <T extends string>(op: T) =>`${baseUrl}/${serviceId}/${op}` as const;

        return ServiceBuilder.of({
            makeOperation(config){
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
            }
        })
    }))
}

export const ServiceFactory: Context.Reference<ServiceFactory> = Context.Reference<ServiceFactory>("ServiceFactory", {
    defaultValue: () => ({ makeServiceBuilder })
})