# Listeners

Verified Code examples on this page have been automatically tested and verified.

Define the ports, protocols, and TLS settings where agentgateway accepts incoming traffic.

Listeners are the entrypoints for traffic into agentgateway. Agentgateway supports both HTTP**HTTP
(Hypertext Transfer Protocol)**The protocol used for transmitting web pages and data over the
internet. Agentgateway primarily handles HTTP and HTTPS traffic. and TCP**TCP (Transmission Control
Protocol)**A connection-oriented protocol that provides reliable, ordered delivery of data.
Agentgateway supports TCP listeners for non-HTTP traffic. traffic, with and without TLS**TLS
(Transport Layer Security)**A cryptographic protocol that provides secure communication over a
network. Agentgateway supports TLS for both incoming connections (listeners) and outgoing
connections (backends)..

You configure a listener as part of a gateway. A gateway with a single listener sets the protocol
and TLS settings directly, and a gateway that serves multiple hostnames on one port uses the
`listeners` field to define each one. For more information about gateways and how routes attach to
them, see [Gateways](gateways.md).

## HTTP Listeners

An HTTP listener can be configured by setting `protocol: HTTP` on the gateway. This is also the
default protocol if no protocol is specified.

For example:

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 3000
    protocol: HTTP
routes: []
```

## HTTPS Listeners

Serving HTTPS**HTTPS (HTTP Secure)**HTTP over TLS/SSL, providing encrypted communication.
Agentgateway supports HTTPS listeners with TLS certificate configuration. traffic requires TLS
certificates and setting `protocol: HTTPS` on the gateway. When you set `tls`, the protocol defaults
to `HTTPS`, so you can also omit the `protocol` field.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  default:
    port: 443
    protocol: HTTPS
    tls:
      cert: examples/tls/certs/cert.pem
      key: examples/tls/certs/key.pem
routes: []
```

To generate a self-signed certificate for local testing, you can use `openssl`. Self-signed
certificates trigger security warnings in browsers and clients, so use a certificate from a trusted
certificate authority, such as Let’s Encrypt, in production.

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

By default, a listener will match any traffic on the port. To serve multiple hostnames on one port,
add a named listener for each one under the gateway’s `listeners` field and set the `hostname`
field. Traffic is then routed based on the
[hostname](https://en.wikipedia.org/wiki/Server_Name_Indication). The most exact match will be used,
as well as the corresponding TLS certificates.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  web:
    port: 443
    listeners:
    - name: discrete
      protocol: HTTPS
      hostname: a.example.com
      tls:
        cert: examples/tls/certs/cert-a.pem
        key: examples/tls/certs/key-a.pem
    - name: wildcard
      protocol: HTTPS
      hostname: "*.example.com"
      tls:
        cert: examples/tls/certs/cert-wildcard.pem
        key: examples/tls/certs/key-wildcard.pem
routes: []
```

To attach a route to one of these listeners instead of the whole gateway, reference it as
`web/discrete` or `web/wildcard` in the route’s `gateways` field.

### Redirect HTTP to HTTPS

Listeners under one gateway share a port, so they cannot mix encrypted and plaintext traffic. To
serve both HTTP and HTTPS, define a separate gateway for each, and attach a route with a
`requestRedirect` policy to the HTTP gateway. The following example listens for plaintext HTTP on
port 80 and redirects it to HTTPS, while serving encrypted traffic on port 443.

```
gateways:
  http:
    port: 80
    protocol: HTTP
  https:
    port: 443
    protocol: HTTPS
    tls:
      cert: ./certs/cert.pem
      key: ./certs/key.pem
routes:
- name: redirect
  gateways: [http]  # Redirects plaintext traffic to the https gateway
  policies:
    requestRedirect:
      scheme: https
```

## TCP Listeners

TCP listeners can be configured by setting `protocol: TCP` on the gateway. TCP listeners are useful
when serving traffic that is not HTTP based.

> [!NOTE] Note A large portion of agentgateway’s functionality is specific to HTTP traffic, and not available for TCP traffic.

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  tcp:
    port: 9000
    protocol: TCP
tcpRoutes: []
```

Additionally, note the use of `tcpRoutes` instead of `routes` (which are HTTP routes) in the
example.

## TLS Listeners

For serving TLS traffic, the `protocol: TLS` can be used.

> [!NOTE] Note TLS encrypted HTTP traffic should use HTTPS listeners .

TLS listeners can either _terminate_ or _passthrough_ TLS traffic. While both a TCP and TLS
passthrough listener do not terminate TLS, the latter enables the use of routing based on the
hostname (utilizing [SNI](https://en.wikipedia.org/wiki/Server_Name_Indication)).

```
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
gateways:
  tls:
    port: 8443
    listeners:
    - name: passthrough
      hostname: passthrough.example.com
      protocol: TLS
    - name: termination
      hostname: termination.example.com
      protocol: TLS
      tls:
        cert: examples/tls/certs/cert.pem
        key: examples/tls/certs/key.pem
tcpRoutes: []
```

[Gateways](/docs/standalone/latest/configuration/gateways/ 'Gateways')[Routes](/docs/standalone/latest/configuration/routes/ 'Routes')

Was this page helpful?
