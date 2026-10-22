# agctl migrate

Reference for the `agctl migrate` command.

Migrate agentgateway resources to newer configurations

### Synopsis

Migrate agentgateway resources to newer configurations.

Prints the changes as YAML by default; pass –write to apply them to the cluster.

Available migrations: virtualkeys-to-configmap

```
agctl migrate [flags]
```

### Examples

```
agctl migrate --apply virtualkeys-to-configmap -n my-namespace | kubectl apply -f -
agctl migrate --apply virtualkeys-to-configmap -n my-namespace > migration.yaml
agctl migrate --apply virtualkeys-to-configmap -n my-namespace --write
```

### Options

```
      --apply strings      migrations to run, comma-separated (virtualkeys-to-configmap)
  -h, --help               help for migrate
  -n, --namespace string   Namespace to migrate resources in
      --policy string      virtualkeys-to-configmap: only migrate the named resource (default: all matching resources in the namespace)
      --write              apply the changes to the cluster (default: print YAML)
```

### Options inherited from parent commands

```
  -k, --kubeconfig string   kubeconfig
```

### SEE ALSO

- [agctl](../agctl/) - agctl controls and inspects Agentgateway resources

[agctl costs import](/docs/standalone/latest/reference/agctl/agctl-costs-import/ 'agctl costs import')[agctl proxy](/docs/standalone/latest/reference/agctl/agctl-proxy/ 'agctl proxy')

Was this page helpful?
