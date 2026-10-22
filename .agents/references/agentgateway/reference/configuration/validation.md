# Schema validation

Configure your IDE or editor to validate agentgateway YAML against the JSON schema.

Many integrated development environments (IDEs) and editors support schema validation for your
standalone agentgateway configuration file.

## Default schema validation off `main`

The examples throughout the docs use the following schema that redirects to the agentgateway config
on `main`.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
```

## Version-specific schema validation

Replace `$VERSION` in the following schema with the version of agentgateway that you are using, such
as `1.4.1`.

```
# yaml-language-server: $schema=https://raw.githubusercontent.com/agentgateway/agentgateway/refs/tags/$VERSION/schema/config.json
```

For example:

```
# yaml-language-server: $schema=https://raw.githubusercontent.com/agentgateway/agentgateway/refs/tags/v0.12.0/schema/config.json
```

[Configuration schema explorer](/docs/standalone/latest/reference/configuration/schema/ 'Configuration schema explorer')

Was this page helpful?
