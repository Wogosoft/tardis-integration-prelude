# Tardis Integration Prelude

A base dependency for the Tardis integration.

Contains 3 structures:

- Schema: Wraps Schemas with default values. Only supplies the ones needed by Tardis clients.
- Service Builder: Builds a client for a GRPC service.
- Service Map: Stores URLs for Services.

This is to be used in code generation in Tardis Clients