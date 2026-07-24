import { Context, Effect, Layer, type Scope, type Cause } from "effect";

export interface ServiceMap {
    getURL: (serviceId: string) => Effect.Effect<string, Cause.NoSuchElementError>;
}

export const ServiceMap: Context.Service<ServiceMap, ServiceMap> = Context.Service<ServiceMap>("ServiceMap")

/**
 * Service Accesor
 */
export const getURL = (serviceId: string): Effect.Effect<string, Cause.NoSuchElementError, ServiceMap> => 
    ServiceMap.use(s => s.getURL(serviceId))

/**
 * Create a ServiceMap Layer from an Effect
 */
export const effect: <E, R>(fn: Effect.Effect<ServiceMap, E, R>) => Layer.Layer<ServiceMap, E, Exclude<R, Scope.Scope>>
= <E,R>(fn: Effect.Effect<ServiceMap, E, R>) => Layer.effect(ServiceMap, fn);

/**
 * Create a ServiceMap that always returns the same value
 */
export const fixed: (value: Effect.Effect<string>) => Layer.Layer<ServiceMap> = 
    (value: Effect.Effect<string>): Layer.Layer<ServiceMap> => 
        Layer.succeed(ServiceMap, { getURL: () => value })

/**
 * Create a function that given an Effect that resolves to an object with
 * the URLs for the services given their service name, creates a ServiceMap layer.
 */
export function makeServiceMapFactory<NameToUrlMap extends Record<string, string>>(typeNameToServiceName: Record<string, string>):
<E, R>(effect: Effect.Effect<NameToUrlMap, E, R>) => Layer.Layer<ServiceMap, E, Exclude<R, Scope.Scope>>{
    return function fromEffect<E, R>(effect: Effect.Effect<NameToUrlMap, E, R>)
    : Layer.Layer<ServiceMap, E, Exclude<R, Scope.Scope>>{
        return Layer.effect(ServiceMap, Effect.gen(function*(){
            const urls = yield* effect;
            return {
                getURL: Effect.fn(function*(serviceId: string){
                    const serviceName = yield* Effect.fromNullishOr(typeNameToServiceName[serviceId]);
                    return yield* Effect.fromNullishOr(urls[serviceName])
                })
            }
        }))
    }
}
