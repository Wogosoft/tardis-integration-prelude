import { Context, Effect } from "effect";
import type { HttpClientRequest } from "effect/unstable/http";

export interface Transform {
  (self: HttpClientRequest.HttpClientRequest): Effect.Effect<HttpClientRequest.HttpClientRequest>
}

export const RequestTransform: Context.Reference<Transform> = Context.Reference<Transform>("RequestTransform", {
  defaultValue: () => (req: HttpClientRequest.HttpClientRequest) => Effect.succeed(req)
})