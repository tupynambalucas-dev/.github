# agctl proxy config backends

Reference for the `agctl proxy config backends` command.

Retrieve agentgateway backend endpoint status

### Synopsis

Get the status of agentgateway backend endpoints.

```
agctl proxy config backends [flags]
```

### Options

```
      --all    Show endpoints with zero requests
  -h, --help   help for backends
```

### Options inherited from parent commands

```
  -f, --file string            Agentgateway config dump JSON file
  -k, --kubeconfig string      kubeconfig
  -n, --namespace string       Namespace to use when resolving resources
  -o, --output string          Output format: one of short|json|yaml (default "short")
      --proxy-admin-port int   Agentgateway admin port (default 15000)
```

### SEE ALSO

- [agctl proxy config](../agctl-proxy-config/) - Retrieve agentgateway configuration for a resource

[agctl proxy config all](/docs/standalone/latest/reference/agctl/agctl-proxy-config-all/ 'agctl proxy config all')[agctl proxy log](/docs/standalone/latest/reference/agctl/agctl-proxy-log/ 'agctl proxy log')

Was this page helpful?
