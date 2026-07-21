import { Context, Layer } from "effect";
import type { HttpClientRequest } from "effect/unstable/http";

export type Transform = 
  (self: HttpClientRequest.HttpClientRequest) => HttpClientRequest.HttpClientRequest

/**
 * Transforms an HTTP request. 
 */
export const RequestTransform: Context.Reference<Transform> = Context.Reference<Transform>("RequestTransform", {
  defaultValue: () => (req: HttpClientRequest.HttpClientRequest) => req
})

export const layer = (fn: Transform): Layer.Layer<never> => {
  return Layer.succeed(RequestTransform, RequestTransform.of(fn));
}

export const defaultTransform: Layer.Layer<never> = layer(a => a)