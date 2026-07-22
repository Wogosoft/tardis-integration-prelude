/**
 * @module Schema module with default values
 */
export { suspend } from "effect/Schema"
import { Effect, Schema } from "effect"

/**
 * Same as Schema.Boolean but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const Boolean: Schema.withDecodingDefaultTypeKey<Schema.Boolean, never> = Schema.Boolean.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(false))
);

/**
 * Same as Schema.String but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const String: Schema.withDecodingDefaultTypeKey<Schema.String, never> = Schema.String.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(""))
)

/**
 * Same as Schema.Number but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const Number: Schema.withDecodingDefaultTypeKey<Schema.Number, never> = Schema.Number.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(0))
)

/**
 * Same as Schema.BigInt but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const BigInt: Schema.withDecodingDefaultTypeKey<Schema.BigInt, never> = Schema.BigInt.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(0n))
)

/**
 * Same as Schema.Uint8Array but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const Uint8Array: Schema.withDecodingDefaultTypeKey<Schema.Uint8Array, never> = Schema.Uint8Array.pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed(new globalThis.Uint8Array(0)))
)

/**
 * Same as Schema.Array but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const Array: <const T extends Schema.Top>(internal: T) => Schema.withDecodingDefaultTypeKey<Schema.$Array<T>, never> = <const T extends Schema.Top>(internal: T) => Schema.Array(internal).pipe(
    Schema.withDecodingDefaultTypeKey(Effect.succeed([]))
)

/**
 * Same as Schema.Record but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const Record: <const Key extends Schema.Record.Key, const Value extends Schema.Top>(key: Key, value: Value) => Schema.withDecodingDefaultTypeKey<Schema.$Record<Key, Value>, never>
 = <const Key extends Schema.Record.Key, const Value extends Schema.Top>(
    key: Key, 
    value: Value
) => Schema.Record(key, value).pipe(
    // deno-lint-ignore no-explicit-any
    Schema.withDecodingDefaultTypeKey(Effect.succeed({} as any))
)

/**
 * Same as Schema.Struct but already has Effect.withDecodingDefaultTypeKey 
 * applied with the proto3 default
 */
export const Struct: <const Fields extends Schema.Struct.Fields>(fields: Fields) => Schema.withDecodingDefaultTypeKey<Schema.Struct<Fields>, never> = <const Fields extends Schema.Struct.Fields>(fields: Fields) => Schema.Struct(fields).pipe(
    // deno-lint-ignore no-explicit-any
    Schema.withDecodingDefaultTypeKey(Effect.succeed({} as any))
)