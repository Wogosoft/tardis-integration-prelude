import { Context, type Effect, Layer, type Scope, type Cause } from "effect";

export interface ServiceMap {
    getUrl: (serviceId: string) => Effect.Effect<string, Cause.NoSuchElementError>;
}

export const ServiceMap: Context.Service<ServiceMap, ServiceMap> = Context.Service<ServiceMap>("ServiceMap")

/**
 * Create a ServiceMap Layer from an Effect
 */
export const effect: <E, R>(fn: Effect.Effect<ServiceMap, E, R>) => Layer.Layer<ServiceMap, E, Exclude<R, Scope.Scope>>
= <E,R>(fn: Effect.Effect<ServiceMap, E, R>) => Layer.effect(ServiceMap, fn);

