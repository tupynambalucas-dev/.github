# Install agctl

Install the agctl command-line tool for inspecting and debugging agentgateway.

> [!WARNING] Warning This feature is experimental. Try it out, see how it helps, and provide us feedback in GitHub or Discord. But keep in mind that it is subject to change and not supported for production.

Install `agctl`, the command-line tool that you use to inspect and debug agentgateway.

## About

`agctl` is the agentgateway command-line interface. Use `agctl` to inspect the configuration that an
agentgateway proxy has loaded, capture detailed traces of requests as the proxy handles them, and
manage proxy and controller log levels. The CLI works against agentgateway running in Kubernetes or
as a standalone binary on your workstation.

`agctl` includes the following subcommands.

| Command                | Description                                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agctl proxy trace`    | Capture a tap-style trace to analyze a copy of the next request that an agentgateway proxy handles. Renders the trace in an interactive, text-based terminal user interface (TUI) by default. Alternatively, you can format the output as JSON for piping to other tools. |
| `agctl proxy config`   | Retrieve the runtime configuration that an agentgateway proxy has loaded, including binds, listeners, routes, backends, workloads, and services.                                                                                                                          |
| `agctl proxy log`      | Get or set log levels for the agentgateway proxy at runtime.                                                                                                                                                                                                              |
| `agctl controller log` | Get or set log levels for the agentgateway controller at runtime.                                                                                                                                                                                                         |
| `agctl costs`          | Manage the model cost catalogs that price LLM requests, including importing catalog data from supported pricing sources.                                                                                                                                                  |
| `agctl migrate`        | Migrate agentgateway resources to newer configurations.                                                                                                                                                                                                                   |
| `agctl version`        | Print version information for the `agctl` CLI.                                                                                                                                                                                                                            |
| `agctl completion`     | Turn on autocompletion for your shell in `bash`, `zsh`, `fish`, or `powershell`.                                                                                                                                                                                          |

For a complete list of subcommands and flags, see the [`agctl` CLI
reference](../reference/agctl/index.md).

## Before you begin

Make sure that you have [Graphviz](https://graphviz.org/download/) installed if you plan to use
`agctl` for profile investigation.

If you choose to build `agctl` from source, you must also install [Go](https://go.dev/doc/install)
1.22 or later and [Git](https://git-scm.com/downloads).

## Install agctl

Download the `agctl` binary for your platform from the [releases
page](https://github.com/agentgateway/agentgateway/releases) or build it from source.

Download the pre-compiled binary:

```
curl -sL https://github.com/agentgateway/agentgateway/releases/latest/download/agctl-linux-amd64 -o agctl
chmod +x agctl
sudo mv agctl /usr/local/bin/agctl
```

Download the pre-compiled binary:

```
# Intel
curl -sL https://github.com/agentgateway/agentgateway/releases/latest/download/agctl-darwin-amd64 -o agctl

# Apple Silicon
curl -sL https://github.com/agentgateway/agentgateway/releases/latest/download/agctl-darwin-arm64 -o agctl

chmod +x agctl
sudo mv agctl /usr/local/bin/agctl
```

Download `agctl-windows-amd64.exe` from the [releases page](https://github.com/agentgateway/agentgateway/releases) and add it to your `PATH`.

1. Clone the agentgateway repository.

   ```
   git clone https://github.com/agentgateway/agentgateway.git
   cd agentgateway
   ```

2. Build and install `agctl` to your `GOBIN` directory.

   ```
   go install ./controller/cmd/agctl
   ```

   By default, `go install` places the binary in `$(go env GOBIN)`, or in `$(go env GOPATH)/bin` if
   `GOBIN` is unset. Make sure that this directory is on your `PATH`.

   ```
   export PATH="$(go env GOPATH)/bin:$PATH"
   ```

## Verify the installation

```
agctl --help
```

Example output:

```
agctl controls and inspects Agentgateway resources

Usage:
  agctl [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  controller  Inspect and manage the Agentgateway controller
  help        Help about any command
  proxy       Inspect and manage the Agentgateway proxy
  version     Print agctl version information

Flags:
  -h, --help                help for agctl
  -k, --kubeconfig string   kubeconfig

Use "agctl [command] --help" for more information about a command.
```

## Enable shell completion

`agctl` ships with an autocompletion script for `bash`, `zsh`, `fish`, and `powershell`. Source the
script for your shell to get tab-completion of subcommands, flags, and resource names.

Add the completion script to a directory on your `$fpath`. The following example creates one and
writes the script to it.

```
mkdir -p ~/.zsh/completions
agctl completion zsh > ~/.zsh/completions/_agctl
```

Add the directory to `$fpath` and load completion in your `~/.zshrc`.

```
fpath=(~/.zsh/completions $fpath)
autoload -U compinit && compinit
```

Source the script in your `~/.bashrc`.

```
echo 'source <(agctl completion bash)' >> ~/.bashrc
```

```
agctl completion fish > ~/.config/fish/completions/agctl.fish
```

```
agctl completion powershell | Out-String | Invoke-Expression
```

## Upgrade agctl

To upgrade `agctl`, replace the binary with the new version following the same steps as
installation.

If you built from source, pull the latest changes and rebuild.

```
cd agentgateway
git pull
go install ./controller/cmd/agctl
```

Verify the new version.

```
agctl --help
```

> [!NOTE] Note Use the same agctl version as the agentgateway version that you run in your cluster. Slight skews within minor versions typically work, but compatibility across major versions is not guaranteed.

## Uninstall agctl

To uninstall `agctl`, remove the binary from your system. For example:

```
# If installed to /usr/local/bin
sudo rm /usr/local/bin/agctl

# If installed via GOBIN
rm "$(go env GOPATH)/bin/agctl"
```

[Admin UI](/docs/standalone/latest/operations/ui/ 'Admin UI')

Was this page helpful?
