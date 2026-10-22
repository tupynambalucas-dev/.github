# Configuration schema explorer

Explore the agentgateway standalone configuration schema interactively, including nested fields and
validation details.

Generated from the [agentgateway JSON
schema](https://github.com/agentgateway/agentgateway/blob/main/schema/config.json).

- config

  - enableIpv6boolean
  - dns

    - lookupFamilystring
    - edns0boolean

  - localXdsPathstring
  - caAddressstring
  - caAuthTokenstring
  - xdsAddressstring
  - xdsAuthTokenstring
  - namespacestring
  - gatewaystring
  - trustDomainstring
  - additionalTrustDomainsstring
  - skipValidateTrustDomainboolean
  - serviceAccountstring
  - clusterIdstring
  - networkstring
  - adminAddrstring
  - statsAddrstring
  - readinessAddrstring
  - session

    - \*keystring

  - mcp

    - sessionTtlstring

  - connectionTerminationDeadlinestring
  - connectionMinTerminationDeadlinestring
  - workerThreadsstring
  - tracing

    - otlpEndpointstring
    - headersobject
    - otlpProtocolstring
    - fields

      - removestring[]
      - addobject

    - randomSamplingstring|number|boolean
    - clientSamplingstring|number|boolean
    - pathstring

  - logging

    - filterstring
    - fields

      - removestring[]
      - addobject

    - levelstring[]
    - formatstring

  - metrics

    - removestring[]
    - fields

      - addobject

  - backend

    - keepalives

      - enabledboolean
      - timestring
      - intervalstring
      - retriesinteger

    - connectTimeoutstring
    - poolIdleTimeoutstring
    - poolMaxSizeinteger

  - hbone

    - windowSizeinteger
    - connectionWindowSizeinteger
    - frameSizeinteger
    - poolMaxStreamsPerConninteger
    - poolUnusedReleaseTimeoutstring

- frontendPolicies

  - http

    - maxBufferSizeinteger
    - http1MaxHeadersinteger
    - http1IdleTimeoutstring
    - http1HeaderCasestring
    - http2WindowSizeinteger
    - http2ConnectionWindowSizeinteger
    - http2FrameSizeinteger
    - http2MaxHeaderSizeinteger
    - http2KeepaliveIntervalstring
    - http2KeepaliveTimeoutstring
    - maxConnectionDurationstring

  - tls

    - handshakeTimeoutstring
    - alpnarray[]
    - minVersionstring
    - maxVersionstring
    - cipherSuitesstring[]
    - keyExchangeGroupsstring[]

  - tcp

    - \*keepalives

      - enabledboolean
      - timestring
      - intervalstring
      - retriesinteger

  - networkAuthorization

    - \*rulesstring[]

  - proxyProtocol

    - versionstring
    - modestring

  - accessLog

    - filterstring
    - addobject
    - removestring[]
    - otlp

      - \*service

        - \*name

          - \*namespacestring
          - \*hostnamestring

        - \*portinteger

  - tracing

    - \*service

      - \*name

        - \*namespacestring
        - \*hostnamestring

      - \*portinteger

- binds

  - \*portinteger
  - \*listeners

    - namestring
    - namespacestring
    - hostnamestring
    - protocolstring
    - tls

      - \*certstring
      - \*keystring
      - rootstring
      - cipherSuitesstring[]
      - minTLSVersionstring
      - maxTLSVersionstring
      - keyExchangeGroupsstring[]

    - routes

      - namestring
      - namespacestring
      - ruleNamestring
      - hostnamesstring[]
      - matches

        - headers

          - \*namestring
          - \*value

            - \*exactstring

        - path

          - \*exactstring

        - methodstring
        - query

          - \*namestring
          - \*value

            - \*exactstring

      - policies

        - requestHeaderModifier

          - addobject
          - setobject
          - removestring[]

        - responseHeaderModifier

          - addobject
          - setobject
          - removestring[]

        - requestRedirect

          - schemestring
          - authority

            - \*fullstring

          - path

            - \*fullstring

          - statusinteger

        - urlRewrite

          - authority

            - \*fullstring

          - path

            - \*fullstring

        - requestMirror

          - \*backend

            - \*service

              - \*name

                - \*namespacestring
                - \*hostnamestring

              - \*portinteger

          - \*percentagenumber

        - directResponse

          - \*conditional

            - conditionstring
            - bodyarray|string
            - bodyExpressionstring
            - headersobject
            - \*statusinteger

        - cors

          - allowCredentialsboolean
          - allowHeadersstring[]
          - allowMethodsstring[]
          - allowOriginsstring[]
          - exposeHeadersstring[]
          - maxAgestring

        - mcpAuthorization

          - \*rulesstring[]

        - authorization

          - \*rulesstring[]

        - mcpAuthentication

          - \*issuerstring
          - \*audiencesstring[]
          - provider

            - \*auth0object

          - \*resourceMetadataobject
          - \*jwks

            - \*filestring

          - modestring
          - authorizationLocation

            - \*header

              - \*namestring
              - prefixstring

          - jwtValidationOptions

            - requiredClaimsstring[]

          - clientIdstring

        - a2aobject
        - ai

          - promptGuard

            - request

              - \*regex

                - actionstring
                - \*rules

                  - \*builtinstring

            - response

              - \*regex

                - actionstring
                - \*rules

                  - \*builtinstring

          - defaultsobject
          - overridesobject
          - transformationsobject
          - prompts

            - append

              - \*rolestring
              - \*contentstring

            - prepend

              - \*rolestring
              - \*contentstring

          - modelAliasesobject
          - promptCaching

            - cacheSystemboolean
            - cacheMessagesboolean
            - cacheToolsboolean
            - minTokensinteger
            - cacheMessageOffsetinteger

          - routesobject

        - backendTLS

          - certstring
          - keystring
          - rootstring
          - hostnamestring
          - insecureboolean
          - insecureHostboolean
          - alpnstring[]
          - subjectAltNamesstring[]
          - keyExchangeGroupsstring[]

        - backendTunnel

          - \*proxy

            - \*service

              - \*name

                - \*namespacestring
                - \*hostnamestring

              - \*portinteger

        - backendAuth

          - \*passthrough

            - location

              - \*header

                - \*namestring
                - prefixstring

        - localRateLimit

          - \*conditional

            - conditionstring
            - maxTokensinteger
            - tokensPerFillinteger
            - \*fillIntervalstring
            - typestring

        - remoteRateLimit

          - \*conditional

            - \*service

              - \*name

                - \*namespacestring
                - \*hostnamestring

              - \*portinteger

        - jwtAuth

          - modestring
          - location

            - \*header

              - \*namestring
              - prefixstring

          - \*providers

            - \*issuerstring
            - audiencesstring[]
            - \*jwks

              - \*filestring

            - jwtValidationOptions

              - requiredClaimsstring[]

        - oidc

          - \*issuerstring
          - discovery

            - \*filestring

          - authorizationEndpointstring
          - tokenEndpointstring
          - tokenEndpointAuthstring
          - jwks

            - \*filestring

          - \*clientIdstring
          - \*clientSecretstring
          - \*redirectURIstring
          - scopesstring[]

        - basicAuth

          - \*htpasswd

            - \*filestring

          - realmstring
          - modestring
          - authorizationLocation

            - \*header

              - \*namestring
              - prefixstring

        - apiKey

          - \*keys

            - \*keystring
            - metadata

          - modestring
          - location

            - \*header

              - \*namestring
              - prefixstring

        - extAuthz

          - \*conditional

            - \*service

              - \*name

                - \*namespacestring
                - \*hostnamestring

              - \*portinteger

        - extProc

          - \*conditional

            - \*service

              - \*name

                - \*namespacestring
                - \*hostnamestring

              - \*portinteger

        - transformations

          - \*conditional

            - conditionstring
            - request

              - addobject
              - setobject
              - removestring[]
              - bodystring
              - metadataobject

            - response

              - addobject
              - setobject
              - removestring[]
              - bodystring
              - metadataobject

        - csrf

          - additionalOriginsstring[]

        - timeout

          - requestTimeoutstring
          - backendRequestTimeoutstring

        - retry

          - attemptsinteger
          - backoffstring
          - \*codesinteger[]

      - backends

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - tcpRoutes

      - namestring
      - namespacestring
      - ruleNamestring
      - hostnamesstring[]
      - policies

        - backendTLS

          - certstring
          - keystring
          - rootstring
          - hostnamestring
          - insecureboolean
          - insecureHostboolean
          - alpnstring[]
          - subjectAltNamesstring[]
          - keyExchangeGroupsstring[]

      - backends

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - policies

      - oidc

        - \*issuerstring
        - discovery

          - \*filestring

        - authorizationEndpointstring
        - tokenEndpointstring
        - tokenEndpointAuthstring
        - jwks

          - \*filestring

        - \*clientIdstring
        - \*clientSecretstring
        - \*redirectURIstring
        - scopesstring[]

      - jwtAuth

        - modestring
        - location

          - \*header

            - \*namestring
            - prefixstring

        - \*providers

          - \*issuerstring
          - audiencesstring[]
          - \*jwks

            - \*filestring

          - jwtValidationOptions

            - requiredClaimsstring[]

      - extAuthz

        - \*conditional

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

      - extProc

        - \*conditional

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

      - transformations

        - \*conditional

          - conditionstring
          - request

            - addobject
            - setobject
            - removestring[]
            - bodystring
            - metadataobject

          - response

            - addobject
            - setobject
            - removestring[]
            - bodystring
            - metadataobject

      - basicAuth

        - \*htpasswd

          - \*filestring

        - realmstring
        - modestring
        - authorizationLocation

          - \*header

            - \*namestring
            - prefixstring

      - apiKey

        - \*keys

          - \*keystring
          - metadata

        - modestring
        - location

          - \*header

            - \*namestring
            - prefixstring

  - tunnelProtocolstring

- llm

  - portinteger
  - \*models

    - \*namestring
    - params

      - modelstring
      - apiKey

        - \*filestring

      - awsRegionstring
      - vertexRegionstring
      - vertexProjectstring
      - azureResourceNamestring
      - azureResourceTypestring
      - azureApiVersionstring
      - azureProjectNamestring
      - baseUrlstring
      - hostOverridestring
      - pathOverridestring
      - pathPrefixstring
      - tokenizeboolean

    - \*provider

      - \*custom

        - modelstring
        - \*formats

          - \*typestring
          - pathstring

    - defaultsobject
    - overridesobject
    - transformationobject
    - requestHeaders

      - addobject
      - setobject
      - removestring[]

    - responseHeaders

      - addobject
      - setobject
      - removestring[]

    - tls

      - certstring
      - keystring
      - rootstring
      - hostnamestring
      - insecureboolean
      - insecureHostboolean
      - alpnstring[]
      - subjectAltNamesstring[]
      - keyExchangeGroupsstring[]

    - auth

      - \*passthrough

        - location

          - \*header

            - \*namestring
            - prefixstring

    - health

      - unhealthyExpressionstring
      - eviction

        - durationstring
        - restoreHealthnumber
        - consecutiveFailuresinteger
        - healthThresholdnumber

    - backendTunnel

      - \*proxy

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - guardrails

      - request

        - \*regex

          - actionstring
          - \*rules

            - \*builtinstring

      - response

        - \*regex

          - actionstring
          - \*rules

            - \*builtinstring

    - matches

      - headers

        - \*namestring
        - \*value

          - \*exactstring

  - policies

    - oidc

      - \*issuerstring
      - discovery

        - \*filestring

      - authorizationEndpointstring
      - tokenEndpointstring
      - tokenEndpointAuthstring
      - jwks

        - \*filestring

      - \*clientIdstring
      - \*clientSecretstring
      - \*redirectURIstring
      - scopesstring[]

    - jwtAuth

      - modestring
      - location

        - \*header

          - \*namestring
          - prefixstring

      - \*providers

        - \*issuerstring
        - audiencesstring[]
        - \*jwks

          - \*filestring

        - jwtValidationOptions

          - requiredClaimsstring[]

    - extAuthz

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - extProc

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - transformations

      - \*conditional

        - conditionstring
        - request

          - addobject
          - setobject
          - removestring[]
          - bodystring
          - metadataobject

        - response

          - addobject
          - setobject
          - removestring[]
          - bodystring
          - metadataobject

    - basicAuth

      - \*htpasswd

        - \*filestring

      - realmstring
      - modestring
      - authorizationLocation

        - \*header

          - \*namestring
          - prefixstring

    - apiKey

      - \*keys

        - \*keystring
        - metadata

      - modestring
      - location

        - \*header

          - \*namestring
          - prefixstring

    - authorization

      - \*rulesstring[]

    - localRateLimit

      - maxTokensinteger
      - tokensPerFillinteger
      - \*fillIntervalstring
      - typestring

    - remoteRateLimit

      - \*service

        - \*name

          - \*namespacestring
          - \*hostnamestring

        - \*portinteger

- mcp

  - portinteger
  - \*targets

    - \*sse

      - hoststring
      - portinteger
      - pathstring
      - backendstring

  - statefulModestring
  - prefixModestring
  - failureModestring
  - policies

    - requestHeaderModifier

      - addobject
      - setobject
      - removestring[]

    - responseHeaderModifier

      - addobject
      - setobject
      - removestring[]

    - requestRedirect

      - schemestring
      - authority

        - \*fullstring

      - path

        - \*fullstring

      - statusinteger

    - urlRewrite

      - authority

        - \*fullstring

      - path

        - \*fullstring

    - requestMirror

      - \*backend

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

      - \*percentagenumber

    - directResponse

      - \*conditional

        - conditionstring
        - bodyarray|string
        - bodyExpressionstring
        - headersobject
        - \*statusinteger

    - cors

      - allowCredentialsboolean
      - allowHeadersstring[]
      - allowMethodsstring[]
      - allowOriginsstring[]
      - exposeHeadersstring[]
      - maxAgestring

    - mcpAuthorization

      - \*rulesstring[]

    - authorization

      - \*rulesstring[]

    - mcpAuthentication

      - \*issuerstring
      - \*audiencesstring[]
      - provider

        - \*auth0object

      - \*resourceMetadataobject
      - \*jwks

        - \*filestring

      - modestring
      - authorizationLocation

        - \*header

          - \*namestring
          - prefixstring

      - jwtValidationOptions

        - requiredClaimsstring[]

      - clientIdstring

    - a2aobject
    - ai

      - promptGuard

        - request

          - \*regex

            - actionstring
            - \*rules

              - \*builtinstring

        - response

          - \*regex

            - actionstring
            - \*rules

              - \*builtinstring

      - defaultsobject
      - overridesobject
      - transformationsobject
      - prompts

        - append

          - \*rolestring
          - \*contentstring

        - prepend

          - \*rolestring
          - \*contentstring

      - modelAliasesobject
      - promptCaching

        - cacheSystemboolean
        - cacheMessagesboolean
        - cacheToolsboolean
        - minTokensinteger
        - cacheMessageOffsetinteger

      - routesobject

    - backendTLS

      - certstring
      - keystring
      - rootstring
      - hostnamestring
      - insecureboolean
      - insecureHostboolean
      - alpnstring[]
      - subjectAltNamesstring[]
      - keyExchangeGroupsstring[]

    - backendTunnel

      - \*proxy

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - backendAuth

      - \*passthrough

        - location

          - \*header

            - \*namestring
            - prefixstring

    - localRateLimit

      - \*conditional

        - conditionstring
        - maxTokensinteger
        - tokensPerFillinteger
        - \*fillIntervalstring
        - typestring

    - remoteRateLimit

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - jwtAuth

      - modestring
      - location

        - \*header

          - \*namestring
          - prefixstring

      - \*providers

        - \*issuerstring
        - audiencesstring[]
        - \*jwks

          - \*filestring

        - jwtValidationOptions

          - requiredClaimsstring[]

    - oidc

      - \*issuerstring
      - discovery

        - \*filestring

      - authorizationEndpointstring
      - tokenEndpointstring
      - tokenEndpointAuthstring
      - jwks

        - \*filestring

      - \*clientIdstring
      - \*clientSecretstring
      - \*redirectURIstring
      - scopesstring[]

    - basicAuth

      - \*htpasswd

        - \*filestring

      - realmstring
      - modestring
      - authorizationLocation

        - \*header

          - \*namestring
          - prefixstring

    - apiKey

      - \*keys

        - \*keystring
        - metadata

      - modestring
      - location

        - \*header

          - \*namestring
          - prefixstring

    - extAuthz

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - extProc

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - transformations

      - \*conditional

        - conditionstring
        - request

          - addobject
          - setobject
          - removestring[]
          - bodystring
          - metadataobject

        - response

          - addobject
          - setobject
          - removestring[]
          - bodystring
          - metadataobject

    - csrf

      - additionalOriginsstring[]

    - timeout

      - requestTimeoutstring
      - backendRequestTimeoutstring

    - retry

      - attemptsinteger
      - backoffstring
      - \*codesinteger[]

- policies

  - \*name

    - \*namestring
    - \*namespacestring

  - \*target

    - \*gateway

      - \*gatewayNamestring
      - \*gatewayNamespacestring
      - listenerNamestring
      - portinteger

  - phasestring
  - \*policy

    - requestHeaderModifier

      - addobject
      - setobject
      - removestring[]

    - responseHeaderModifier

      - addobject
      - setobject
      - removestring[]

    - requestRedirect

      - schemestring
      - authority

        - \*fullstring

      - path

        - \*fullstring

      - statusinteger

    - urlRewrite

      - authority

        - \*fullstring

      - path

        - \*fullstring

    - requestMirror

      - \*backend

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

      - \*percentagenumber

    - directResponse

      - \*conditional

        - conditionstring
        - bodyarray|string
        - bodyExpressionstring
        - headersobject
        - \*statusinteger

    - cors

      - allowCredentialsboolean
      - allowHeadersstring[]
      - allowMethodsstring[]
      - allowOriginsstring[]
      - exposeHeadersstring[]
      - maxAgestring

    - mcpAuthorization

      - \*rulesstring[]

    - authorization

      - \*rulesstring[]

    - mcpAuthentication

      - \*issuerstring
      - \*audiencesstring[]
      - provider

        - \*auth0object

      - \*resourceMetadataobject
      - \*jwks

        - \*filestring

      - modestring
      - authorizationLocation

        - \*header

          - \*namestring
          - prefixstring

      - jwtValidationOptions

        - requiredClaimsstring[]

      - clientIdstring

    - a2aobject
    - ai

      - promptGuard

        - request

          - \*regex

            - actionstring
            - \*rules

              - \*builtinstring

        - response

          - \*regex

            - actionstring
            - \*rules

              - \*builtinstring

      - defaultsobject
      - overridesobject
      - transformationsobject
      - prompts

        - append

          - \*rolestring
          - \*contentstring

        - prepend

          - \*rolestring
          - \*contentstring

      - modelAliasesobject
      - promptCaching

        - cacheSystemboolean
        - cacheMessagesboolean
        - cacheToolsboolean
        - minTokensinteger
        - cacheMessageOffsetinteger

      - routesobject

    - backendTLS

      - certstring
      - keystring
      - rootstring
      - hostnamestring
      - insecureboolean
      - insecureHostboolean
      - alpnstring[]
      - subjectAltNamesstring[]
      - keyExchangeGroupsstring[]

    - backendTunnel

      - \*proxy

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - backendAuth

      - \*passthrough

        - location

          - \*header

            - \*namestring
            - prefixstring

    - localRateLimit

      - \*conditional

        - conditionstring
        - maxTokensinteger
        - tokensPerFillinteger
        - \*fillIntervalstring
        - typestring

    - remoteRateLimit

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - jwtAuth

      - modestring
      - location

        - \*header

          - \*namestring
          - prefixstring

      - \*providers

        - \*issuerstring
        - audiencesstring[]
        - \*jwks

          - \*filestring

        - jwtValidationOptions

          - requiredClaimsstring[]

    - oidc

      - \*issuerstring
      - discovery

        - \*filestring

      - authorizationEndpointstring
      - tokenEndpointstring
      - tokenEndpointAuthstring
      - jwks

        - \*filestring

      - \*clientIdstring
      - \*clientSecretstring
      - \*redirectURIstring
      - scopesstring[]

    - basicAuth

      - \*htpasswd

        - \*filestring

      - realmstring
      - modestring
      - authorizationLocation

        - \*header

          - \*namestring
          - prefixstring

    - apiKey

      - \*keys

        - \*keystring
        - metadata

      - modestring
      - location

        - \*header

          - \*namestring
          - prefixstring

    - extAuthz

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - extProc

      - \*conditional

        - \*service

          - \*name

            - \*namespacestring
            - \*hostnamestring

          - \*portinteger

    - transformations

      - \*conditional

        - conditionstring
        - request

          - addobject
          - setobject
          - removestring[]
          - bodystring
          - metadataobject

        - response

          - addobject
          - setobject
          - removestring[]
          - bodystring
          - metadataobject

    - csrf

      - additionalOriginsstring[]

    - timeout

      - requestTimeoutstring
      - backendRequestTimeoutstring

    - retry

      - attemptsinteger
      - backoffstring
      - \*codesinteger[]

- workloads
- services
- backends

  - \*hoststring

- routeGroups

  - \*namestring
  - \*routes

    - namestring
    - namespacestring
    - ruleNamestring
    - hostnamesstring[]
    - matches

      - headers

        - \*namestring
        - \*value

          - \*exactstring

      - path

        - \*exactstring

      - methodstring
      - query

        - \*namestring
        - \*value

          - \*exactstring

    - policies

      - requestHeaderModifier

        - addobject
        - setobject
        - removestring[]

      - responseHeaderModifier

        - addobject
        - setobject
        - removestring[]

      - requestRedirect

        - schemestring
        - authority

          - \*fullstring

        - path

          - \*fullstring

        - statusinteger

      - urlRewrite

        - authority

          - \*fullstring

        - path

          - \*fullstring

      - requestMirror

        - \*backend

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

        - \*percentagenumber

      - directResponse

        - \*conditional

          - conditionstring
          - bodyarray|string
          - bodyExpressionstring
          - headersobject
          - \*statusinteger

      - cors

        - allowCredentialsboolean
        - allowHeadersstring[]
        - allowMethodsstring[]
        - allowOriginsstring[]
        - exposeHeadersstring[]
        - maxAgestring

      - mcpAuthorization

        - \*rulesstring[]

      - authorization

        - \*rulesstring[]

      - mcpAuthentication

        - \*issuerstring
        - \*audiencesstring[]
        - provider

          - \*auth0object

        - \*resourceMetadataobject
        - \*jwks

          - \*filestring

        - modestring
        - authorizationLocation

          - \*header

            - \*namestring
            - prefixstring

        - jwtValidationOptions

          - requiredClaimsstring[]

        - clientIdstring

      - a2aobject
      - ai

        - promptGuard

          - request

            - \*regex

              - actionstring
              - \*rules

                - \*builtinstring

          - response

            - \*regex

              - actionstring
              - \*rules

                - \*builtinstring

        - defaultsobject
        - overridesobject
        - transformationsobject
        - prompts

          - append

            - \*rolestring
            - \*contentstring

          - prepend

            - \*rolestring
            - \*contentstring

        - modelAliasesobject
        - promptCaching

          - cacheSystemboolean
          - cacheMessagesboolean
          - cacheToolsboolean
          - minTokensinteger
          - cacheMessageOffsetinteger

        - routesobject

      - backendTLS

        - certstring
        - keystring
        - rootstring
        - hostnamestring
        - insecureboolean
        - insecureHostboolean
        - alpnstring[]
        - subjectAltNamesstring[]
        - keyExchangeGroupsstring[]

      - backendTunnel

        - \*proxy

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

      - backendAuth

        - \*passthrough

          - location

            - \*header

              - \*namestring
              - prefixstring

      - localRateLimit

        - \*conditional

          - conditionstring
          - maxTokensinteger
          - tokensPerFillinteger
          - \*fillIntervalstring
          - typestring

      - remoteRateLimit

        - \*conditional

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

      - jwtAuth

        - modestring
        - location

          - \*header

            - \*namestring
            - prefixstring

        - \*providers

          - \*issuerstring
          - audiencesstring[]
          - \*jwks

            - \*filestring

          - jwtValidationOptions

            - requiredClaimsstring[]

      - oidc

        - \*issuerstring
        - discovery

          - \*filestring

        - authorizationEndpointstring
        - tokenEndpointstring
        - tokenEndpointAuthstring
        - jwks

          - \*filestring

        - \*clientIdstring
        - \*clientSecretstring
        - \*redirectURIstring
        - scopesstring[]

      - basicAuth

        - \*htpasswd

          - \*filestring

        - realmstring
        - modestring
        - authorizationLocation

          - \*header

            - \*namestring
            - prefixstring

      - apiKey

        - \*keys

          - \*keystring
          - metadata

        - modestring
        - location

          - \*header

            - \*namestring
            - prefixstring

      - extAuthz

        - \*conditional

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

      - extProc

        - \*conditional

          - \*service

            - \*name

              - \*namespacestring
              - \*hostnamestring

            - \*portinteger

      - transformations

        - \*conditional

          - conditionstring
          - request

            - addobject
            - setobject
            - removestring[]
            - bodystring
            - metadataobject

          - response

            - addobject
            - setobject
            - removestring[]
            - bodystring
            - metadataobject

      - csrf

        - additionalOriginsstring[]

      - timeout

        - requestTimeoutstring
        - backendRequestTimeoutstring

      - retry

        - attemptsinteger
        - backoffstring
        - \*codesinteger[]

    - backends

      - \*service

        - \*name

          - \*namespacestring
          - \*hostnamestring

        - \*portinteger

config

object

No description for this field.

Validation

Defaultnull

config.enableIpv6

boolean

No description for this field.

config.dns

object

DNS resolver settings.

config.dns.lookupFamily

string

Controls which IP address families the DNS resolver will query for  
upstream connections.  
Accepted values: All, Auto, V4Preferred, V4Only, V6Only.  
Defaults to Auto (IPv4-only when enableIpv6 is false, both when true).

Validation

ConstAll

config.dns.edns0

boolean

Whether to enable EDNS0 (Extension Mechanisms for DNS) in the resolver.  
When `None`, the system-provided resolver setting is preserved.  
Can also be set via the `DNS_EDNS0` environment variable.

config.localXdsPath

string

Local XDS path. If not specified, the current configuration file will be used.

config.caAddress

string

No description for this field.

config.caAuthToken

string

No description for this field.

config.xdsAddress

string

No description for this field.

config.xdsAuthToken

string

No description for this field.

config.namespace

string

No description for this field.

config.gateway

string

No description for this field.

config.trustDomain

string

No description for this field.

config.additionalTrustDomains

string

Comma-separated list of additional SPIFFE trust domains accepted on inbound HBONE  
connections. The local trust_domain is always implicitly included.

config.skipValidateTrustDomain

boolean

When true, skip SPIFFE trust-domain verification on inbound HBONE connections.

config.serviceAccount

string

No description for this field.

config.clusterId

string

No description for this field.

config.network

string

No description for this field.

config.adminAddr

string

Admin UI address in the format "ip:port", "localhost:port", "unix:/path/to/socket", or "off"

config.statsAddr

string

Stats/metrics server address in the format "ip:port", "localhost:port", "unix:/path/to/socket", or "off"

config.readinessAddr

string

Readiness probe server address in the format "ip:port", "localhost:port", "unix:/path/to/socket", or "off"

config.session

object

Configuration for stateful session management

config.session.key

stringRequired

The AES-256-GCM session protection key to be used for session tokens.  
If not set, sessions will not be encrypted.  
For example, generated via `openssl rand -hex 32`.

config.mcp

object

MCP gateway settings.

config.mcp.sessionTtl

string

No description for this field.

Validation

Defaultnull

config.connectionTerminationDeadline

string

No description for this field.

Validation

Defaultnull

config.connectionMinTerminationDeadline

string

No description for this field.

Validation

Defaultnull

config.workerThreads

string

No description for this field.

config.tracing

object

No description for this field.

config.tracing.otlpEndpoint

string

No description for this field.

config.tracing.headers

object

No description for this field.

Validation

Default{}

config.tracing.otlpProtocol

string

No description for this field.

Validation

Enumgrpc, http

Defaultgrpc

config.tracing.fields

object

No description for this field.

config.tracing.fields.remove

string[]

No description for this field.

Validation

Default[]

config.tracing.fields.add

object

No description for this field.

Validation

Default{}

config.tracing.randomSampling

string|number|boolean

Expression to determine the amount of \*random sampling\*.  
Random sampling will initiate a new trace span if the incoming request does not have a trace already.  
This should evaluate to either a float between 0.0-1.0 (0-100%) or true/false.  
This defaults to 'false'.

config.tracing.clientSampling

string|number|boolean

Expression to determine the amount of \*client sampling\*.  
Client sampling determines whether to initiate a new trace span if the incoming request does have a trace already.  
This should evaluate to either a float between 0.0-1.0 (0-100%) or true/false.  
This defaults to 'true'.

config.tracing.path

string

OTLP path. Default is /v1/traces

config.logging

object

No description for this field.

config.logging.filter

string

No description for this field.

config.logging.fields

object

No description for this field.

config.logging.fields.remove

string[]

No description for this field.

Validation

Default[]

config.logging.fields.add

object

No description for this field.

Validation

Default{}

config.logging.level

string[]

No description for this field.

config.logging.format

string

No description for this field.

Validation

Enumtext, json

config.metrics

object

No description for this field.

config.metrics.remove

string[]

No description for this field.

Validation

Default[]

config.metrics.fields

object

No description for this field.

config.metrics.fields.add

object

No description for this field.

Validation

Default{}

config.backend

object

No description for this field.

Validation

Default{"keepalives": {"enabled": true, "time": "3m0s", "interval": "3m0s", "retries": 9}, "connectTimeout": "10s", "poolIdleTimeout": "1m30s", "poolMaxSize": null}

config.backend.keepalives

object

No description for this field.

Validation

Default{"enabled": true, "time": "3m0s", "interval": "3m0s", "retries": 9}

config.backend.keepalives.enabled

boolean

No description for this field.

Validation

Defaulttrue

config.backend.keepalives.time

string

No description for this field.

Validation

Default3m0s

config.backend.keepalives.interval

string

No description for this field.

Validation

Default3m0s

config.backend.keepalives.retries

integer

No description for this field.

Validation

Default9

Formatuint32

Minimum0

config.backend.connectTimeout

string

No description for this field.

Validation

Default10s

config.backend.poolIdleTimeout

string

The maximum duration to keep an idle connection alive.

Validation

Default1m30s

config.backend.poolMaxSize

integer

The maximum number of connections allowed in the pool, per hostname. If set, this will limit  
the total number of connections kept alive to any given host.  
Note: excess connections will still be created, they will just not remain idle.  
If unset, there is no limit

Validation

Defaultnull

Formatuint

Minimum0

config.hbone

object

No description for this field.

config.hbone.windowSize

integer

No description for this field.

Validation

Formatuint32

Minimum0

config.hbone.connectionWindowSize

integer

No description for this field.

Validation

Formatuint32

Minimum0

config.hbone.frameSize

integer

No description for this field.

Validation

Formatuint32

Minimum0

config.hbone.poolMaxStreamsPerConn

integer

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

config.hbone.poolUnusedReleaseTimeout

string

No description for this field.

frontendPolicies

object

No description for this field.

frontendPolicies.http

object

Settings for handling incoming HTTP requests.

Validation

Defaultnull

frontendPolicies.http.maxBufferSize

integer

No description for this field.

Validation

Default2097152

Formatuint

Minimum0

frontendPolicies.http.http1MaxHeaders

integer

The maximum number of headers allowed in a request. Changing this value results in a performance  
degradation, even if set to a lower value than the default (100)

Validation

Defaultnull

Formatuint

Minimum0

frontendPolicies.http.http1IdleTimeout

string

No description for this field.

Validation

Default10m0s

frontendPolicies.http.http1HeaderCase

string

Preserves the original casing of HTTP/1 request header names when encoding responses on the same connection.

Validation

Enumlowercase, preserve

Defaultlowercase

frontendPolicies.http.http2WindowSize

integer

No description for this field.

Validation

Defaultnull

Formatuint32

Minimum0

frontendPolicies.http.http2ConnectionWindowSize

integer

No description for this field.

Validation

Defaultnull

Formatuint32

Minimum0

frontendPolicies.http.http2FrameSize

integer

No description for this field.

Validation

Defaultnull

Formatuint32

Minimum0

frontendPolicies.http.http2MaxHeaderSize

integer

No description for this field.

Validation

Defaultnull

Formatuint32

Minimum0

frontendPolicies.http.http2KeepaliveInterval

string

No description for this field.

Validation

Defaultnull

frontendPolicies.http.http2KeepaliveTimeout

string

No description for this field.

Validation

Defaultnull

frontendPolicies.http.maxConnectionDuration

string

Maximum duration a connection is allowed to remain open. After this duration,  
the connection is gracefully closed after the current in-flight request completes.  
Useful for ensuring even traffic distribution behind load balancers during scaling events.

Validation

Defaultnull

frontendPolicies.tls

object

Settings for handling incoming TLS connections.

Validation

Defaultnull

frontendPolicies.tls.handshakeTimeout

string

No description for this field.

Validation

Default15s

frontendPolicies.tls.alpn

array[]

No description for this field.

Validation

Defaultnull

frontendPolicies.tls.minVersion

string

No description for this field.

Validation

EnumTLS_V1_0, TLS_V1_1, TLS_V1_2, TLS_V1_3

frontendPolicies.tls.maxVersion

string

No description for this field.

Validation

EnumTLS_V1_0, TLS_V1_1, TLS_V1_2, TLS_V1_3

frontendPolicies.tls.cipherSuites

string[]

No description for this field.

frontendPolicies.tls.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

frontendPolicies.tcp

object

Settings for handling incoming TCP connections.

Validation

Defaultnull

frontendPolicies.tcp.keepalives

objectRequired

No description for this field.

frontendPolicies.tcp.keepalives.enabled

boolean

No description for this field.

Validation

Defaulttrue

frontendPolicies.tcp.keepalives.time

string

No description for this field.

Validation

Default3m0s

frontendPolicies.tcp.keepalives.interval

string

No description for this field.

Validation

Default3m0s

frontendPolicies.tcp.keepalives.retries

integer

No description for this field.

Validation

Default9

Formatuint32

Minimum0

frontendPolicies.networkAuthorization

object

CEL authorization for downstream network connections.

Validation

Defaultnull

frontendPolicies.networkAuthorization.rules

string[]Required

No description for this field.

frontendPolicies.proxyProtocol

object

Enable downstream PROXY protocol handling on this gateway or port, including  
version matching and whether PROXY headers are required or optional.

Validation

Defaultnull

frontendPolicies.proxyProtocol.version

string

No description for this field.

Validation

Enumv1, v2, all

Defaultv2

frontendPolicies.proxyProtocol.mode

string

No description for this field.

Validation

Enumstrict, optional

Defaultstrict

frontendPolicies.accessLog

object

Settings for request access logs.

Validation

Defaultnull

frontendPolicies.accessLog.filter

string

No description for this field.

frontendPolicies.accessLog.add

object

No description for this field.

frontendPolicies.accessLog.remove

string[]

No description for this field.

Validation

Unique itemstrue

frontendPolicies.accessLog.otlp

object

Service reference. Service must be defined in the top level services list.

frontendPolicies.accessLog.otlp.service

objectRequired

No description for this field.

frontendPolicies.accessLog.otlp.service.name

objectRequired

No description for this field.

frontendPolicies.accessLog.otlp.service.name.namespace

stringRequired

No description for this field.

frontendPolicies.accessLog.otlp.service.name.hostname

stringRequired

No description for this field.

frontendPolicies.accessLog.otlp.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

frontendPolicies.tracing

object

Service reference. Service must be defined in the top level services list.

Validation

Defaultnull

frontendPolicies.tracing.service

objectRequired

No description for this field.

frontendPolicies.tracing.service.name

objectRequired

No description for this field.

frontendPolicies.tracing.service.name.namespace

stringRequired

No description for this field.

frontendPolicies.tracing.service.name.hostname

stringRequired

No description for this field.

frontendPolicies.tracing.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds

object[]

No description for this field.

binds.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners

object[]Required

No description for this field.

binds.listeners.name

string

No description for this field.

Validation

Defaultnull

binds.listeners.namespace

string

No description for this field.

Validation

Defaultnull

binds.listeners.hostname

string

Can be a wildcard

binds.listeners.protocol

string

No description for this field.

Validation

EnumHTTP, HTTPS, TLS, TCP, HBONE

binds.listeners.tls

object

No description for this field.

binds.listeners.tls.cert

stringRequired

No description for this field.

binds.listeners.tls.key

stringRequired

No description for this field.

binds.listeners.tls.root

string

No description for this field.

binds.listeners.tls.cipherSuites

string[]

Optional cipher suite allowlist (order is preserved).

binds.listeners.tls.minTLSVersion

string

Minimum supported TLS version (only TLS 1.2 and 1.3 are supported).

Validation

EnumTLS_V1_0, TLS_V1_1, TLS_V1_2, TLS_V1_3

binds.listeners.tls.maxTLSVersion

string

Maximum supported TLS version (only TLS 1.2 and 1.3 are supported).

Validation

EnumTLS_V1_0, TLS_V1_1, TLS_V1_2, TLS_V1_3

binds.listeners.tls.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

binds.listeners.routes

object[]

No description for this field.

binds.listeners.routes.name

string

No description for this field.

Validation

Defaultnull

binds.listeners.routes.namespace

string

No description for this field.

Validation

Defaultnull

binds.listeners.routes.ruleName

string

No description for this field.

Validation

Defaultnull

binds.listeners.routes.hostnames

string[]

Can be a wildcard

binds.listeners.routes.matches

object[]

No description for this field.

Validation

Default[{"path": {"pathPrefix": "/"}}]

binds.listeners.routes.matches.headers

object[]

No description for this field.

binds.listeners.routes.matches.headers.name

stringRequired

No description for this field.

binds.listeners.routes.matches.headers.value

objectRequired

No description for this field.

binds.listeners.routes.matches.headers.value.exact

stringRequired

No description for this field.

binds.listeners.routes.matches.path

object

No description for this field.

Validation

Default{"pathPrefix": "/"}

binds.listeners.routes.matches.path.exact

stringRequired

No description for this field.

binds.listeners.routes.matches.method

string

No description for this field.

binds.listeners.routes.matches.query

object[]

No description for this field.

binds.listeners.routes.matches.query.name

stringRequired

No description for this field.

binds.listeners.routes.matches.query.value

objectRequired

No description for this field.

binds.listeners.routes.matches.query.value.exact

stringRequired

No description for this field.

binds.listeners.routes.policies

object

No description for this field.

binds.listeners.routes.policies.requestHeaderModifier

object

Headers to be modified in the request.

Validation

Defaultnull

binds.listeners.routes.policies.requestHeaderModifier.add

object

No description for this field.

binds.listeners.routes.policies.requestHeaderModifier.set

object

No description for this field.

binds.listeners.routes.policies.requestHeaderModifier.remove

string[]

No description for this field.

binds.listeners.routes.policies.responseHeaderModifier

object

Headers to be modified in the response.

Validation

Defaultnull

binds.listeners.routes.policies.responseHeaderModifier.add

object

No description for this field.

binds.listeners.routes.policies.responseHeaderModifier.set

object

No description for this field.

binds.listeners.routes.policies.responseHeaderModifier.remove

string[]

No description for this field.

binds.listeners.routes.policies.requestRedirect

object

Directly respond to the request with a redirect.

Validation

Defaultnull

binds.listeners.routes.policies.requestRedirect.scheme

string

No description for this field.

binds.listeners.routes.policies.requestRedirect.authority

object

No description for this field.

binds.listeners.routes.policies.requestRedirect.authority.full

stringRequired

No description for this field.

binds.listeners.routes.policies.requestRedirect.path

object

No description for this field.

binds.listeners.routes.policies.requestRedirect.path.full

stringRequired

No description for this field.

binds.listeners.routes.policies.requestRedirect.status

integer

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

binds.listeners.routes.policies.urlRewrite

object

Modify the URL path or authority.

Validation

Defaultnull

binds.listeners.routes.policies.urlRewrite.authority

object

No description for this field.

binds.listeners.routes.policies.urlRewrite.authority.full

stringRequired

No description for this field.

binds.listeners.routes.policies.urlRewrite.path

object

No description for this field.

binds.listeners.routes.policies.urlRewrite.path.full

stringRequired

No description for this field.

binds.listeners.routes.policies.requestMirror

object

Mirror incoming requests to another destination.

Validation

Defaultnull

binds.listeners.routes.policies.requestMirror.backend

objectRequired

Service reference. Service must be defined in the top level services list.

binds.listeners.routes.policies.requestMirror.backend.service

objectRequired

No description for this field.

binds.listeners.routes.policies.requestMirror.backend.service.name

objectRequired

No description for this field.

binds.listeners.routes.policies.requestMirror.backend.service.name.namespace

stringRequired

No description for this field.

binds.listeners.routes.policies.requestMirror.backend.service.name.hostname

stringRequired

No description for this field.

binds.listeners.routes.policies.requestMirror.backend.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.routes.policies.requestMirror.percentage

numberRequired

No description for this field.

Validation

Formatdouble

binds.listeners.routes.policies.directResponse

object

Directly respond to the request with a static response.

binds.listeners.routes.policies.directResponse.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.routes.policies.directResponse.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

binds.listeners.routes.policies.directResponse.conditional.body

array|string

No description for this field.

binds.listeners.routes.policies.directResponse.conditional.bodyExpression

string

No description for this field.

binds.listeners.routes.policies.directResponse.conditional.headers

object

No description for this field.

binds.listeners.routes.policies.directResponse.conditional.status

integerRequired

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

binds.listeners.routes.policies.cors

object

Handle CORS preflight requests and append configured CORS headers to applicable requests.

Validation

Defaultnull

binds.listeners.routes.policies.cors.allowCredentials

boolean

No description for this field.

Validation

Defaultfalse

binds.listeners.routes.policies.cors.allowHeaders

string[]

No description for this field.

Validation

Default[]

binds.listeners.routes.policies.cors.allowMethods

string[]

No description for this field.

Validation

Default[]

binds.listeners.routes.policies.cors.allowOrigins

string[]

No description for this field.

Validation

Default[]

binds.listeners.routes.policies.cors.exposeHeaders

string[]

No description for this field.

Validation

Default[]

binds.listeners.routes.policies.cors.maxAge

string

No description for this field.

Validation

Defaultnull

binds.listeners.routes.policies.mcpAuthorization

object

Authorization policies for MCP access.

Validation

Defaultnull

binds.listeners.routes.policies.mcpAuthorization.rules

string[]Required

No description for this field.

binds.listeners.routes.policies.authorization

object

Authorization policies for HTTP access.

Validation

Defaultnull

binds.listeners.routes.policies.authorization.rules

string[]Required

No description for this field.

binds.listeners.routes.policies.mcpAuthentication

object

Authentication for MCP clients.

binds.listeners.routes.policies.mcpAuthentication.issuer

stringRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.audiences

string[]Required

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.provider

object

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.provider.auth0

objectRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.resourceMetadata

objectRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.jwks

objectRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.jwks.file

stringRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.mode

string

A valid token, issued by a configured issuer, must be present.  
This is the default option.

Validation

Conststrict

Defaultstrict

binds.listeners.routes.policies.mcpAuthentication.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

binds.listeners.routes.policies.mcpAuthentication.authorizationLocation.header

objectRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.authorizationLocation.header.name

stringRequired

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.authorizationLocation.header.prefix

string

No description for this field.

binds.listeners.routes.policies.mcpAuthentication.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

binds.listeners.routes.policies.mcpAuthentication.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

binds.listeners.routes.policies.mcpAuthentication.clientId

string

No description for this field.

binds.listeners.routes.policies.a2a

object

Mark this traffic as A2A to enable A2A processing and telemetry.

Validation

Defaultnull

binds.listeners.routes.policies.ai

object

Mark this as LLM traffic to enable LLM processing.

Validation

Defaultnull

binds.listeners.routes.policies.ai.promptGuard

object

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.request

object[]

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.request.regex

objectRequired

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.request.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

binds.listeners.routes.policies.ai.promptGuard.request.regex.rules

object[]Required

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.request.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

binds.listeners.routes.policies.ai.promptGuard.response

object[]

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.response.regex

objectRequired

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.response.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

binds.listeners.routes.policies.ai.promptGuard.response.regex.rules

object[]Required

No description for this field.

binds.listeners.routes.policies.ai.promptGuard.response.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

binds.listeners.routes.policies.ai.defaults

object

No description for this field.

binds.listeners.routes.policies.ai.overrides

object

No description for this field.

binds.listeners.routes.policies.ai.transformations

object

No description for this field.

binds.listeners.routes.policies.ai.prompts

object

No description for this field.

Validation

Min properties1

binds.listeners.routes.policies.ai.prompts.append

object[]

No description for this field.

binds.listeners.routes.policies.ai.prompts.append.role

stringRequired

No description for this field.

binds.listeners.routes.policies.ai.prompts.append.content

stringRequired

No description for this field.

binds.listeners.routes.policies.ai.prompts.prepend

object[]

No description for this field.

binds.listeners.routes.policies.ai.prompts.prepend.role

stringRequired

No description for this field.

binds.listeners.routes.policies.ai.prompts.prepend.content

stringRequired

No description for this field.

binds.listeners.routes.policies.ai.modelAliases

object

No description for this field.

binds.listeners.routes.policies.ai.promptCaching

object

No description for this field.

binds.listeners.routes.policies.ai.promptCaching.cacheSystem

boolean

No description for this field.

Validation

Defaulttrue

binds.listeners.routes.policies.ai.promptCaching.cacheMessages

boolean

No description for this field.

Validation

Defaulttrue

binds.listeners.routes.policies.ai.promptCaching.cacheTools

boolean

No description for this field.

Validation

Defaultfalse

binds.listeners.routes.policies.ai.promptCaching.minTokens

integer

No description for this field.

Validation

Default1024

Formatuint

Minimum0

binds.listeners.routes.policies.ai.promptCaching.cacheMessageOffset

integer

No description for this field.

Validation

Default0

Formatuint

Minimum0

binds.listeners.routes.policies.ai.routes

object

No description for this field.

binds.listeners.routes.policies.backendTLS

object

Send TLS to the backend.

binds.listeners.routes.policies.backendTLS.cert

string

No description for this field.

binds.listeners.routes.policies.backendTLS.key

string

No description for this field.

binds.listeners.routes.policies.backendTLS.root

string

No description for this field.

binds.listeners.routes.policies.backendTLS.hostname

string

No description for this field.

binds.listeners.routes.policies.backendTLS.insecure

boolean

No description for this field.

Validation

Defaultfalse

binds.listeners.routes.policies.backendTLS.insecureHost

boolean

No description for this field.

Validation

Defaultfalse

binds.listeners.routes.policies.backendTLS.alpn

string[]

No description for this field.

Validation

Defaultnull

binds.listeners.routes.policies.backendTLS.subjectAltNames

string[]

No description for this field.

Validation

Defaultnull

binds.listeners.routes.policies.backendTLS.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

Validation

Defaultnull

binds.listeners.routes.policies.backendTunnel

object

Tunnel to the backend.

Validation

Defaultnull

binds.listeners.routes.policies.backendTunnel.proxy

objectRequired

Reference to the proxy address

binds.listeners.routes.policies.backendTunnel.proxy.service

objectRequired

No description for this field.

binds.listeners.routes.policies.backendTunnel.proxy.service.name

objectRequired

No description for this field.

binds.listeners.routes.policies.backendTunnel.proxy.service.name.namespace

stringRequired

No description for this field.

binds.listeners.routes.policies.backendTunnel.proxy.service.name.hostname

stringRequired

No description for this field.

binds.listeners.routes.policies.backendTunnel.proxy.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.routes.policies.backendAuth

object

Authenticate to the backend.

Validation

Defaultnull

binds.listeners.routes.policies.backendAuth.passthrough

objectRequired

No description for this field.

binds.listeners.routes.policies.backendAuth.passthrough.location

object

No description for this field.

binds.listeners.routes.policies.backendAuth.passthrough.location.header

objectRequired

No description for this field.

binds.listeners.routes.policies.backendAuth.passthrough.location.header.name

stringRequired

No description for this field.

binds.listeners.routes.policies.backendAuth.passthrough.location.header.prefix

string

No description for this field.

binds.listeners.routes.policies.localRateLimit

object

Rate limit incoming requests. State is kept local.

binds.listeners.routes.policies.localRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.routes.policies.localRateLimit.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

binds.listeners.routes.policies.localRateLimit.conditional.maxTokens

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

binds.listeners.routes.policies.localRateLimit.conditional.tokensPerFill

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

binds.listeners.routes.policies.localRateLimit.conditional.fillInterval

stringRequired

No description for this field.

binds.listeners.routes.policies.localRateLimit.conditional.type

string

No description for this field.

Validation

Enumrequests, tokens

Defaultrequests

binds.listeners.routes.policies.remoteRateLimit

object

Rate limit incoming requests. State is managed by a remote server.

binds.listeners.routes.policies.remoteRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.routes.policies.remoteRateLimit.conditional.service

objectRequired

No description for this field.

binds.listeners.routes.policies.remoteRateLimit.conditional.service.name

objectRequired

No description for this field.

binds.listeners.routes.policies.remoteRateLimit.conditional.service.name.namespace

stringRequired

No description for this field.

binds.listeners.routes.policies.remoteRateLimit.conditional.service.name.hostname

stringRequired

No description for this field.

binds.listeners.routes.policies.remoteRateLimit.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.routes.policies.jwtAuth

object

Authenticate incoming JWT requests.

binds.listeners.routes.policies.jwtAuth.mode

string

A valid token, issued by a configured issuer, must be present.

Validation

Conststrict

Defaultoptional

binds.listeners.routes.policies.jwtAuth.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

binds.listeners.routes.policies.jwtAuth.location.header

objectRequired

No description for this field.

binds.listeners.routes.policies.jwtAuth.location.header.name

stringRequired

No description for this field.

binds.listeners.routes.policies.jwtAuth.location.header.prefix

string

No description for this field.

binds.listeners.routes.policies.jwtAuth.providers

object[]Required

No description for this field.

binds.listeners.routes.policies.jwtAuth.providers.issuer

stringRequired

No description for this field.

binds.listeners.routes.policies.jwtAuth.providers.audiences

string[]

No description for this field.

binds.listeners.routes.policies.jwtAuth.providers.jwks

objectRequired

No description for this field.

binds.listeners.routes.policies.jwtAuth.providers.jwks.file

stringRequired

No description for this field.

binds.listeners.routes.policies.jwtAuth.providers.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

binds.listeners.routes.policies.jwtAuth.providers.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

binds.listeners.routes.policies.oidc

object

Authenticate incoming browser requests with OIDC authorization code flow.

binds.listeners.routes.policies.oidc.issuer

stringRequired

Issuer used for discovery and ID token validation.

binds.listeners.routes.policies.oidc.discovery

object

Optional discovery document override. If omitted, discovery uses  
`${issuer}/.well-known/openid-configuration`.

binds.listeners.routes.policies.oidc.discovery.file

stringRequired

No description for this field.

binds.listeners.routes.policies.oidc.authorizationEndpoint

string

Authorization endpoint used to start the browser login flow.

Validation

Defaultnull

binds.listeners.routes.policies.oidc.tokenEndpoint

string

Token endpoint used to exchange the authorization code.

Validation

Defaultnull

binds.listeners.routes.policies.oidc.tokenEndpointAuth

string

Token endpoint client authentication method for explicit provider configuration.

Discovery mode derives this from provider metadata. Explicit mode defaults to  
`clientSecretBasic` when omitted.

Validation

EnumclientSecretBasic, clientSecretPost

Defaultnull

binds.listeners.routes.policies.oidc.jwks

object

JWKS source used to validate returned ID tokens.

binds.listeners.routes.policies.oidc.jwks.file

stringRequired

No description for this field.

binds.listeners.routes.policies.oidc.clientId

stringRequired

OAuth2 client identifier used for authorization and token exchange.

binds.listeners.routes.policies.oidc.clientSecret

stringRequired

OAuth2 client secret used for token exchange.

binds.listeners.routes.policies.oidc.redirectURI

stringRequired

Absolute callback URI handled by the gateway.  
This policy always redirects unauthenticated non-callback requests back through this login  
flow.

binds.listeners.routes.policies.oidc.scopes

string[]

Additional OAuth2 scopes to request. `openid` is always included.

Validation

Default[]

binds.listeners.routes.policies.basicAuth

object

Authenticate incoming requests using Basic Authentication with htpasswd.

binds.listeners.routes.policies.basicAuth.htpasswd

objectRequired

.htpasswd file contents/reference

binds.listeners.routes.policies.basicAuth.htpasswd.file

stringRequired

No description for this field.

binds.listeners.routes.policies.basicAuth.realm

string

Realm name for the WWW-Authenticate header

Validation

Defaultnull

binds.listeners.routes.policies.basicAuth.mode

string

Validation mode for basic authentication

Validation

Conststrict

Defaultoptional

binds.listeners.routes.policies.basicAuth.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Basic "}}

binds.listeners.routes.policies.basicAuth.authorizationLocation.header

objectRequired

No description for this field.

binds.listeners.routes.policies.basicAuth.authorizationLocation.header.name

stringRequired

No description for this field.

binds.listeners.routes.policies.basicAuth.authorizationLocation.header.prefix

string

No description for this field.

binds.listeners.routes.policies.apiKey

object

Authenticate incoming requests using API Keys

binds.listeners.routes.policies.apiKey.keys

object[]Required

List of API keys

binds.listeners.routes.policies.apiKey.keys.key

stringRequired

No description for this field.

binds.listeners.routes.policies.apiKey.keys.metadata

No description for this field.

binds.listeners.routes.policies.apiKey.mode

string

Validation mode for API keys

Validation

Conststrict

Defaultoptional

binds.listeners.routes.policies.apiKey.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

binds.listeners.routes.policies.apiKey.location.header

objectRequired

No description for this field.

binds.listeners.routes.policies.apiKey.location.header.name

stringRequired

No description for this field.

binds.listeners.routes.policies.apiKey.location.header.prefix

string

No description for this field.

binds.listeners.routes.policies.extAuthz

object

Authenticate incoming requests by calling an external authorization server.

binds.listeners.routes.policies.extAuthz.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.routes.policies.extAuthz.conditional.service

objectRequired

No description for this field.

binds.listeners.routes.policies.extAuthz.conditional.service.name

objectRequired

No description for this field.

binds.listeners.routes.policies.extAuthz.conditional.service.name.namespace

stringRequired

No description for this field.

binds.listeners.routes.policies.extAuthz.conditional.service.name.hostname

stringRequired

No description for this field.

binds.listeners.routes.policies.extAuthz.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.routes.policies.extProc

object

Extend agentgateway with an external processor

binds.listeners.routes.policies.extProc.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.routes.policies.extProc.conditional.service

objectRequired

No description for this field.

binds.listeners.routes.policies.extProc.conditional.service.name

objectRequired

No description for this field.

binds.listeners.routes.policies.extProc.conditional.service.name.namespace

stringRequired

No description for this field.

binds.listeners.routes.policies.extProc.conditional.service.name.hostname

stringRequired

No description for this field.

binds.listeners.routes.policies.extProc.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.routes.policies.transformations

object

Modify requests and responses

binds.listeners.routes.policies.transformations.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.routes.policies.transformations.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

binds.listeners.routes.policies.transformations.conditional.request

object

No description for this field.

binds.listeners.routes.policies.transformations.conditional.request.add

object

No description for this field.

Validation

Default{}

binds.listeners.routes.policies.transformations.conditional.request.set

object

No description for this field.

Validation

Default{}

binds.listeners.routes.policies.transformations.conditional.request.remove

string[]

No description for this field.

Validation

Default[]

binds.listeners.routes.policies.transformations.conditional.request.body

string

No description for this field.

Validation

Defaultnull

binds.listeners.routes.policies.transformations.conditional.request.metadata

object

No description for this field.

Validation

Default{}

binds.listeners.routes.policies.transformations.conditional.response

object

No description for this field.

binds.listeners.routes.policies.transformations.conditional.response.add

object

No description for this field.

Validation

Default{}

binds.listeners.routes.policies.transformations.conditional.response.set

object

No description for this field.

Validation

Default{}

binds.listeners.routes.policies.transformations.conditional.response.remove

string[]

No description for this field.

Validation

Default[]

binds.listeners.routes.policies.transformations.conditional.response.body

string

No description for this field.

Validation

Defaultnull

binds.listeners.routes.policies.transformations.conditional.response.metadata

object

No description for this field.

Validation

Default{}

binds.listeners.routes.policies.csrf

object

Handle CSRF protection by validating request origins against configured allowed origins.

Validation

Defaultnull

binds.listeners.routes.policies.csrf.additionalOrigins

string[]

No description for this field.

Validation

Default[]

Unique itemstrue

binds.listeners.routes.policies.timeout

object

Timeout requests that exceed the configured duration.

Validation

Defaultnull

binds.listeners.routes.policies.timeout.requestTimeout

string

No description for this field.

binds.listeners.routes.policies.timeout.backendRequestTimeout

string

No description for this field.

binds.listeners.routes.policies.retry

object

Retry matching requests.

Validation

Defaultnull

binds.listeners.routes.policies.retry.attempts

integer

No description for this field.

Validation

Default1

Formatuint8

Minimum1

Maximum255

binds.listeners.routes.policies.retry.backoff

string

No description for this field.

binds.listeners.routes.policies.retry.codes

integer[]Required

No description for this field.

binds.listeners.routes.backends

object[]

No description for this field.

binds.listeners.routes.backends.service

objectRequired

No description for this field.

binds.listeners.routes.backends.service.name

objectRequired

No description for this field.

binds.listeners.routes.backends.service.name.namespace

stringRequired

No description for this field.

binds.listeners.routes.backends.service.name.hostname

stringRequired

No description for this field.

binds.listeners.routes.backends.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.tcpRoutes

object[]

No description for this field.

binds.listeners.tcpRoutes.name

string

No description for this field.

Validation

Defaultnull

binds.listeners.tcpRoutes.namespace

string

No description for this field.

Validation

Defaultnull

binds.listeners.tcpRoutes.ruleName

string

No description for this field.

Validation

Defaultnull

binds.listeners.tcpRoutes.hostnames

string[]

Can be a wildcard

binds.listeners.tcpRoutes.policies

object

No description for this field.

binds.listeners.tcpRoutes.policies.backendTLS

object

No description for this field.

binds.listeners.tcpRoutes.policies.backendTLS.cert

string

No description for this field.

binds.listeners.tcpRoutes.policies.backendTLS.key

string

No description for this field.

binds.listeners.tcpRoutes.policies.backendTLS.root

string

No description for this field.

binds.listeners.tcpRoutes.policies.backendTLS.hostname

string

No description for this field.

binds.listeners.tcpRoutes.policies.backendTLS.insecure

boolean

No description for this field.

Validation

Defaultfalse

binds.listeners.tcpRoutes.policies.backendTLS.insecureHost

boolean

No description for this field.

Validation

Defaultfalse

binds.listeners.tcpRoutes.policies.backendTLS.alpn

string[]

No description for this field.

Validation

Defaultnull

binds.listeners.tcpRoutes.policies.backendTLS.subjectAltNames

string[]

No description for this field.

Validation

Defaultnull

binds.listeners.tcpRoutes.policies.backendTLS.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

Validation

Defaultnull

binds.listeners.tcpRoutes.backends

object[]

No description for this field.

binds.listeners.tcpRoutes.backends.service

objectRequired

No description for this field.

binds.listeners.tcpRoutes.backends.service.name

objectRequired

No description for this field.

binds.listeners.tcpRoutes.backends.service.name.namespace

stringRequired

No description for this field.

binds.listeners.tcpRoutes.backends.service.name.hostname

stringRequired

No description for this field.

binds.listeners.tcpRoutes.backends.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.policies

object

No description for this field.

binds.listeners.policies.oidc

object

Authenticate incoming browser requests with OIDC authorization code flow.

binds.listeners.policies.oidc.issuer

stringRequired

Issuer used for discovery and ID token validation.

binds.listeners.policies.oidc.discovery

object

Optional discovery document override. If omitted, discovery uses  
`${issuer}/.well-known/openid-configuration`.

binds.listeners.policies.oidc.discovery.file

stringRequired

No description for this field.

binds.listeners.policies.oidc.authorizationEndpoint

string

Authorization endpoint used to start the browser login flow.

Validation

Defaultnull

binds.listeners.policies.oidc.tokenEndpoint

string

Token endpoint used to exchange the authorization code.

Validation

Defaultnull

binds.listeners.policies.oidc.tokenEndpointAuth

string

Token endpoint client authentication method for explicit provider configuration.

Discovery mode derives this from provider metadata. Explicit mode defaults to  
`clientSecretBasic` when omitted.

Validation

EnumclientSecretBasic, clientSecretPost

Defaultnull

binds.listeners.policies.oidc.jwks

object

JWKS source used to validate returned ID tokens.

binds.listeners.policies.oidc.jwks.file

stringRequired

No description for this field.

binds.listeners.policies.oidc.clientId

stringRequired

OAuth2 client identifier used for authorization and token exchange.

binds.listeners.policies.oidc.clientSecret

stringRequired

OAuth2 client secret used for token exchange.

binds.listeners.policies.oidc.redirectURI

stringRequired

Absolute callback URI handled by the gateway.  
This policy always redirects unauthenticated non-callback requests back through this login  
flow.

binds.listeners.policies.oidc.scopes

string[]

Additional OAuth2 scopes to request. `openid` is always included.

Validation

Default[]

binds.listeners.policies.jwtAuth

object

Authenticate incoming JWT requests.

binds.listeners.policies.jwtAuth.mode

string

A valid token, issued by a configured issuer, must be present.

Validation

Conststrict

Defaultoptional

binds.listeners.policies.jwtAuth.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

binds.listeners.policies.jwtAuth.location.header

objectRequired

No description for this field.

binds.listeners.policies.jwtAuth.location.header.name

stringRequired

No description for this field.

binds.listeners.policies.jwtAuth.location.header.prefix

string

No description for this field.

binds.listeners.policies.jwtAuth.providers

object[]Required

No description for this field.

binds.listeners.policies.jwtAuth.providers.issuer

stringRequired

No description for this field.

binds.listeners.policies.jwtAuth.providers.audiences

string[]

No description for this field.

binds.listeners.policies.jwtAuth.providers.jwks

objectRequired

No description for this field.

binds.listeners.policies.jwtAuth.providers.jwks.file

stringRequired

No description for this field.

binds.listeners.policies.jwtAuth.providers.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

binds.listeners.policies.jwtAuth.providers.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

binds.listeners.policies.extAuthz

object

Authenticate incoming requests by calling an external authorization server.

binds.listeners.policies.extAuthz.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.policies.extAuthz.conditional.service

objectRequired

No description for this field.

binds.listeners.policies.extAuthz.conditional.service.name

objectRequired

No description for this field.

binds.listeners.policies.extAuthz.conditional.service.name.namespace

stringRequired

No description for this field.

binds.listeners.policies.extAuthz.conditional.service.name.hostname

stringRequired

No description for this field.

binds.listeners.policies.extAuthz.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.policies.extProc

object

Extend agentgateway with an external processor

binds.listeners.policies.extProc.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.policies.extProc.conditional.service

objectRequired

No description for this field.

binds.listeners.policies.extProc.conditional.service.name

objectRequired

No description for this field.

binds.listeners.policies.extProc.conditional.service.name.namespace

stringRequired

No description for this field.

binds.listeners.policies.extProc.conditional.service.name.hostname

stringRequired

No description for this field.

binds.listeners.policies.extProc.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

binds.listeners.policies.transformations

object

Modify requests and responses

binds.listeners.policies.transformations.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

binds.listeners.policies.transformations.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

binds.listeners.policies.transformations.conditional.request

object

No description for this field.

binds.listeners.policies.transformations.conditional.request.add

object

No description for this field.

Validation

Default{}

binds.listeners.policies.transformations.conditional.request.set

object

No description for this field.

Validation

Default{}

binds.listeners.policies.transformations.conditional.request.remove

string[]

No description for this field.

Validation

Default[]

binds.listeners.policies.transformations.conditional.request.body

string

No description for this field.

Validation

Defaultnull

binds.listeners.policies.transformations.conditional.request.metadata

object

No description for this field.

Validation

Default{}

binds.listeners.policies.transformations.conditional.response

object

No description for this field.

binds.listeners.policies.transformations.conditional.response.add

object

No description for this field.

Validation

Default{}

binds.listeners.policies.transformations.conditional.response.set

object

No description for this field.

Validation

Default{}

binds.listeners.policies.transformations.conditional.response.remove

string[]

No description for this field.

Validation

Default[]

binds.listeners.policies.transformations.conditional.response.body

string

No description for this field.

Validation

Defaultnull

binds.listeners.policies.transformations.conditional.response.metadata

object

No description for this field.

Validation

Default{}

binds.listeners.policies.basicAuth

object

Authenticate incoming requests using Basic Authentication with htpasswd.

binds.listeners.policies.basicAuth.htpasswd

objectRequired

.htpasswd file contents/reference

binds.listeners.policies.basicAuth.htpasswd.file

stringRequired

No description for this field.

binds.listeners.policies.basicAuth.realm

string

Realm name for the WWW-Authenticate header

Validation

Defaultnull

binds.listeners.policies.basicAuth.mode

string

Validation mode for basic authentication

Validation

Conststrict

Defaultoptional

binds.listeners.policies.basicAuth.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Basic "}}

binds.listeners.policies.basicAuth.authorizationLocation.header

objectRequired

No description for this field.

binds.listeners.policies.basicAuth.authorizationLocation.header.name

stringRequired

No description for this field.

binds.listeners.policies.basicAuth.authorizationLocation.header.prefix

string

No description for this field.

binds.listeners.policies.apiKey

object

Authenticate incoming requests using API Keys

binds.listeners.policies.apiKey.keys

object[]Required

List of API keys

binds.listeners.policies.apiKey.keys.key

stringRequired

No description for this field.

binds.listeners.policies.apiKey.keys.metadata

No description for this field.

binds.listeners.policies.apiKey.mode

string

Validation mode for API keys

Validation

Conststrict

Defaultoptional

binds.listeners.policies.apiKey.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

binds.listeners.policies.apiKey.location.header

objectRequired

No description for this field.

binds.listeners.policies.apiKey.location.header.name

stringRequired

No description for this field.

binds.listeners.policies.apiKey.location.header.prefix

string

No description for this field.

binds.tunnelProtocol

string

No description for this field.

Validation

Enumdirect, hboneWaypoint, hboneGateway, proxy

Defaultdirect

llm

object

No description for this field.

llm.port

integer

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

llm.models

object[]Required

models defines the set of models that can be served by this gateway. The model name refers to the  
model in the users request that is matched; the model sent to the actual LLM can be overridden  
on a per-model basis.

llm.models.name

stringRequired

name is the name of the model we are matching from a users request. If params.model is set, that  
will be used in the request to the LLM provider. If not, the incoming model is used.

llm.models.params

object

params customizes parameters for the outgoing request

llm.models.params.model

string

The model to send to the provider.  
If unset, the same model will be used from the request.

Validation

Defaultnull

llm.models.params.apiKey

object

An API key to attach to the request.  
If unset this will be automatically detected from the environment.

llm.models.params.apiKey.file

stringRequired

No description for this field.

llm.models.params.awsRegion

string

No description for this field.

llm.models.params.vertexRegion

string

No description for this field.

llm.models.params.vertexProject

string

No description for this field.

llm.models.params.azureResourceName

string

For Azure: the resource name of the deployment

llm.models.params.azureResourceType

string

For Azure: the type of Azure endpoint (openAI or foundry)

Validation

ConstopenAI

llm.models.params.azureApiVersion

string

For Azure: the API version to use

llm.models.params.azureProjectName

string

For Azure: the Foundry project name (required for foundry resource type)

llm.models.params.baseUrl

string

Base URL for the upstream provider. Expands to hostOverride, pathPrefix, and tls for https URLs.

Validation

Defaultnull

llm.models.params.hostOverride

string

Override the upstream host for this provider.

Validation

Defaultnull

llm.models.params.pathOverride

string

Override the upstream path for this provider.

Validation

Defaultnull

llm.models.params.pathPrefix

string

Override the default base path prefix for this provider.

Validation

Defaultnull

llm.models.params.tokenize

boolean

Whether to tokenize the request before forwarding it upstream.

Validation

Defaultfalse

llm.models.provider

objectRequired

provider of the LLM we are connecting too

llm.models.provider.custom

objectRequired

No description for this field.

llm.models.provider.custom.model

string

No description for this field.

llm.models.provider.custom.formats

object[]Required

No description for this field.

llm.models.provider.custom.formats.type

stringRequired

No description for this field.

Validation

Enumcompletions, messages, responses, embeddings, anthropicTokenCount, realtime

llm.models.provider.custom.formats.path

string

No description for this field.

llm.models.defaults

object

defaults allows setting default values for the request. If these are not present in the request body, they will be set.  
To override even when set, use `overrides`.

llm.models.overrides

object

overrides allows setting values for the request, overriding any existing values

llm.models.transformation

object

transformation allows setting values from CEL expressions for the request, overriding any existing values.

llm.models.requestHeaders

object

requestHeaders modifies headers in requests to the LLM provider.

Validation

Defaultnull

llm.models.requestHeaders.add

object

No description for this field.

llm.models.requestHeaders.set

object

No description for this field.

llm.models.requestHeaders.remove

string[]

No description for this field.

llm.models.responseHeaders

object

responseHeaders modifies headers in responses from the LLM provider.

Validation

Defaultnull

llm.models.responseHeaders.add

object

No description for this field.

llm.models.responseHeaders.set

object

No description for this field.

llm.models.responseHeaders.remove

string[]

No description for this field.

llm.models.tls

object

tls configures TLS when connecting to the LLM provider.

llm.models.tls.cert

string

No description for this field.

llm.models.tls.key

string

No description for this field.

llm.models.tls.root

string

No description for this field.

llm.models.tls.hostname

string

No description for this field.

llm.models.tls.insecure

boolean

No description for this field.

Validation

Defaultfalse

llm.models.tls.insecureHost

boolean

No description for this field.

Validation

Defaultfalse

llm.models.tls.alpn

string[]

No description for this field.

Validation

Defaultnull

llm.models.tls.subjectAltNames

string[]

No description for this field.

Validation

Defaultnull

llm.models.tls.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

Validation

Defaultnull

llm.models.auth

object

auth configures authentication when connecting to the LLM provider.

Validation

Defaultnull

llm.models.auth.passthrough

objectRequired

No description for this field.

llm.models.auth.passthrough.location

object

No description for this field.

llm.models.auth.passthrough.location.header

objectRequired

No description for this field.

llm.models.auth.passthrough.location.header.name

stringRequired

No description for this field.

llm.models.auth.passthrough.location.header.prefix

string

No description for this field.

llm.models.health

object

health configures outlier detection for this model backend.

llm.models.health.unhealthyExpression

string

CEL expression; `true` means unhealthy (evict). E.g. `response.code >= 500`.  
When unset, any 5xx or connection failure is treated as unhealthy.

llm.models.health.eviction

object

Local/config eviction sub-policy with duration as string; mirrors `Eviction`.

llm.models.health.eviction.duration

string

No description for this field.

llm.models.health.eviction.restoreHealth

number

No description for this field.

Validation

Formatdouble

llm.models.health.eviction.consecutiveFailures

integer

No description for this field.

Validation

Formatint32

llm.models.health.eviction.healthThreshold

number

No description for this field.

Validation

Formatdouble

llm.models.backendTunnel

object

backendTunnel configures tunneling when connecting to the LLM provider.

Validation

Defaultnull

llm.models.backendTunnel.proxy

objectRequired

Reference to the proxy address

llm.models.backendTunnel.proxy.service

objectRequired

No description for this field.

llm.models.backendTunnel.proxy.service.name

objectRequired

No description for this field.

llm.models.backendTunnel.proxy.service.name.namespace

stringRequired

No description for this field.

llm.models.backendTunnel.proxy.service.name.hostname

stringRequired

No description for this field.

llm.models.backendTunnel.proxy.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

llm.models.guardrails

object

guardrails to apply to the request or response

llm.models.guardrails.request

object[]

No description for this field.

llm.models.guardrails.request.regex

objectRequired

No description for this field.

llm.models.guardrails.request.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

llm.models.guardrails.request.regex.rules

object[]Required

No description for this field.

llm.models.guardrails.request.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

llm.models.guardrails.response

object[]

No description for this field.

llm.models.guardrails.response.regex

objectRequired

No description for this field.

llm.models.guardrails.response.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

llm.models.guardrails.response.regex.rules

object[]Required

No description for this field.

llm.models.guardrails.response.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

llm.models.matches

object[]

matches specifies the conditions under which this model should be used in addition to matching the model name.

llm.models.matches.headers

object[]

No description for this field.

llm.models.matches.headers.name

stringRequired

No description for this field.

llm.models.matches.headers.value

objectRequired

No description for this field.

llm.models.matches.headers.value.exact

stringRequired

No description for this field.

llm.policies

object

policies defines policies for handling incoming requests, before a model is selected

llm.policies.oidc

object

Authenticate incoming browser requests with OIDC authorization code flow.

llm.policies.oidc.issuer

stringRequired

Issuer used for discovery and ID token validation.

llm.policies.oidc.discovery

object

Optional discovery document override. If omitted, discovery uses  
`${issuer}/.well-known/openid-configuration`.

llm.policies.oidc.discovery.file

stringRequired

No description for this field.

llm.policies.oidc.authorizationEndpoint

string

Authorization endpoint used to start the browser login flow.

Validation

Defaultnull

llm.policies.oidc.tokenEndpoint

string

Token endpoint used to exchange the authorization code.

Validation

Defaultnull

llm.policies.oidc.tokenEndpointAuth

string

Token endpoint client authentication method for explicit provider configuration.

Discovery mode derives this from provider metadata. Explicit mode defaults to  
`clientSecretBasic` when omitted.

Validation

EnumclientSecretBasic, clientSecretPost

Defaultnull

llm.policies.oidc.jwks

object

JWKS source used to validate returned ID tokens.

llm.policies.oidc.jwks.file

stringRequired

No description for this field.

llm.policies.oidc.clientId

stringRequired

OAuth2 client identifier used for authorization and token exchange.

llm.policies.oidc.clientSecret

stringRequired

OAuth2 client secret used for token exchange.

llm.policies.oidc.redirectURI

stringRequired

Absolute callback URI handled by the gateway.  
This policy always redirects unauthenticated non-callback requests back through this login  
flow.

llm.policies.oidc.scopes

string[]

Additional OAuth2 scopes to request. `openid` is always included.

Validation

Default[]

llm.policies.jwtAuth

object

Authenticate incoming JWT requests.

llm.policies.jwtAuth.mode

string

A valid token, issued by a configured issuer, must be present.

Validation

Conststrict

Defaultoptional

llm.policies.jwtAuth.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

llm.policies.jwtAuth.location.header

objectRequired

No description for this field.

llm.policies.jwtAuth.location.header.name

stringRequired

No description for this field.

llm.policies.jwtAuth.location.header.prefix

string

No description for this field.

llm.policies.jwtAuth.providers

object[]Required

No description for this field.

llm.policies.jwtAuth.providers.issuer

stringRequired

No description for this field.

llm.policies.jwtAuth.providers.audiences

string[]

No description for this field.

llm.policies.jwtAuth.providers.jwks

objectRequired

No description for this field.

llm.policies.jwtAuth.providers.jwks.file

stringRequired

No description for this field.

llm.policies.jwtAuth.providers.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

llm.policies.jwtAuth.providers.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

llm.policies.extAuthz

object

Authenticate incoming requests by calling an external authorization server.

llm.policies.extAuthz.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

llm.policies.extAuthz.conditional.service

objectRequired

No description for this field.

llm.policies.extAuthz.conditional.service.name

objectRequired

No description for this field.

llm.policies.extAuthz.conditional.service.name.namespace

stringRequired

No description for this field.

llm.policies.extAuthz.conditional.service.name.hostname

stringRequired

No description for this field.

llm.policies.extAuthz.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

llm.policies.extProc

object

Extend agentgateway with an external processor

llm.policies.extProc.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

llm.policies.extProc.conditional.service

objectRequired

No description for this field.

llm.policies.extProc.conditional.service.name

objectRequired

No description for this field.

llm.policies.extProc.conditional.service.name.namespace

stringRequired

No description for this field.

llm.policies.extProc.conditional.service.name.hostname

stringRequired

No description for this field.

llm.policies.extProc.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

llm.policies.transformations

object

Modify requests and responses

llm.policies.transformations.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

llm.policies.transformations.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

llm.policies.transformations.conditional.request

object

No description for this field.

llm.policies.transformations.conditional.request.add

object

No description for this field.

Validation

Default{}

llm.policies.transformations.conditional.request.set

object

No description for this field.

Validation

Default{}

llm.policies.transformations.conditional.request.remove

string[]

No description for this field.

Validation

Default[]

llm.policies.transformations.conditional.request.body

string

No description for this field.

Validation

Defaultnull

llm.policies.transformations.conditional.request.metadata

object

No description for this field.

Validation

Default{}

llm.policies.transformations.conditional.response

object

No description for this field.

llm.policies.transformations.conditional.response.add

object

No description for this field.

Validation

Default{}

llm.policies.transformations.conditional.response.set

object

No description for this field.

Validation

Default{}

llm.policies.transformations.conditional.response.remove

string[]

No description for this field.

Validation

Default[]

llm.policies.transformations.conditional.response.body

string

No description for this field.

Validation

Defaultnull

llm.policies.transformations.conditional.response.metadata

object

No description for this field.

Validation

Default{}

llm.policies.basicAuth

object

Authenticate incoming requests using Basic Authentication with htpasswd.

llm.policies.basicAuth.htpasswd

objectRequired

.htpasswd file contents/reference

llm.policies.basicAuth.htpasswd.file

stringRequired

No description for this field.

llm.policies.basicAuth.realm

string

Realm name for the WWW-Authenticate header

Validation

Defaultnull

llm.policies.basicAuth.mode

string

Validation mode for basic authentication

Validation

Conststrict

Defaultoptional

llm.policies.basicAuth.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Basic "}}

llm.policies.basicAuth.authorizationLocation.header

objectRequired

No description for this field.

llm.policies.basicAuth.authorizationLocation.header.name

stringRequired

No description for this field.

llm.policies.basicAuth.authorizationLocation.header.prefix

string

No description for this field.

llm.policies.apiKey

object

Authenticate incoming requests using API Keys

llm.policies.apiKey.keys

object[]Required

List of API keys

llm.policies.apiKey.keys.key

stringRequired

No description for this field.

llm.policies.apiKey.keys.metadata

No description for this field.

llm.policies.apiKey.mode

string

Validation mode for API keys

Validation

Conststrict

Defaultoptional

llm.policies.apiKey.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

llm.policies.apiKey.location.header

objectRequired

No description for this field.

llm.policies.apiKey.location.header.name

stringRequired

No description for this field.

llm.policies.apiKey.location.header.prefix

string

No description for this field.

llm.policies.authorization

object

Authorization policies for HTTP access.

Validation

Defaultnull

llm.policies.authorization.rules

string[]Required

No description for this field.

llm.policies.localRateLimit

object[]

Rate limit incoming requests. State is kept local.

Validation

Default[]

llm.policies.localRateLimit.maxTokens

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

llm.policies.localRateLimit.tokensPerFill

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

llm.policies.localRateLimit.fillInterval

stringRequired

No description for this field.

llm.policies.localRateLimit.type

string

No description for this field.

Validation

Enumrequests, tokens

Defaultrequests

llm.policies.remoteRateLimit

object

Rate limit incoming requests. State is managed by a remote server.

Validation

Defaultnull

llm.policies.remoteRateLimit.service

objectRequired

No description for this field.

llm.policies.remoteRateLimit.service.name

objectRequired

No description for this field.

llm.policies.remoteRateLimit.service.name.namespace

stringRequired

No description for this field.

llm.policies.remoteRateLimit.service.name.hostname

stringRequired

No description for this field.

llm.policies.remoteRateLimit.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp

object

No description for this field.

mcp.port

integer

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.targets

object[]Required

No description for this field.

mcp.targets.sse

objectRequired

No description for this field.

mcp.targets.sse.host

string

No description for this field.

mcp.targets.sse.port

integer

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.targets.sse.path

string

No description for this field.

mcp.targets.sse.backend

string

No description for this field.

mcp.statefulMode

string

No description for this field.

Validation

Enumstateless, stateful

mcp.prefixMode

string

No description for this field.

Validation

Enumalways, conditional

mcp.failureMode

string

Behavior when one or more MCP targets fail to initialize or fail during fanout.  
Defaults to `failClosed`.

Validation

ConstfailClosed

mcp.policies

object

No description for this field.

mcp.policies.requestHeaderModifier

object

Headers to be modified in the request.

Validation

Defaultnull

mcp.policies.requestHeaderModifier.add

object

No description for this field.

mcp.policies.requestHeaderModifier.set

object

No description for this field.

mcp.policies.requestHeaderModifier.remove

string[]

No description for this field.

mcp.policies.responseHeaderModifier

object

Headers to be modified in the response.

Validation

Defaultnull

mcp.policies.responseHeaderModifier.add

object

No description for this field.

mcp.policies.responseHeaderModifier.set

object

No description for this field.

mcp.policies.responseHeaderModifier.remove

string[]

No description for this field.

mcp.policies.requestRedirect

object

Directly respond to the request with a redirect.

Validation

Defaultnull

mcp.policies.requestRedirect.scheme

string

No description for this field.

mcp.policies.requestRedirect.authority

object

No description for this field.

mcp.policies.requestRedirect.authority.full

stringRequired

No description for this field.

mcp.policies.requestRedirect.path

object

No description for this field.

mcp.policies.requestRedirect.path.full

stringRequired

No description for this field.

mcp.policies.requestRedirect.status

integer

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

mcp.policies.urlRewrite

object

Modify the URL path or authority.

Validation

Defaultnull

mcp.policies.urlRewrite.authority

object

No description for this field.

mcp.policies.urlRewrite.authority.full

stringRequired

No description for this field.

mcp.policies.urlRewrite.path

object

No description for this field.

mcp.policies.urlRewrite.path.full

stringRequired

No description for this field.

mcp.policies.requestMirror

object

Mirror incoming requests to another destination.

Validation

Defaultnull

mcp.policies.requestMirror.backend

objectRequired

Service reference. Service must be defined in the top level services list.

mcp.policies.requestMirror.backend.service

objectRequired

No description for this field.

mcp.policies.requestMirror.backend.service.name

objectRequired

No description for this field.

mcp.policies.requestMirror.backend.service.name.namespace

stringRequired

No description for this field.

mcp.policies.requestMirror.backend.service.name.hostname

stringRequired

No description for this field.

mcp.policies.requestMirror.backend.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.policies.requestMirror.percentage

numberRequired

No description for this field.

Validation

Formatdouble

mcp.policies.directResponse

object

Directly respond to the request with a static response.

mcp.policies.directResponse.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

mcp.policies.directResponse.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

mcp.policies.directResponse.conditional.body

array|string

No description for this field.

mcp.policies.directResponse.conditional.bodyExpression

string

No description for this field.

mcp.policies.directResponse.conditional.headers

object

No description for this field.

mcp.policies.directResponse.conditional.status

integerRequired

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

mcp.policies.cors

object

Handle CORS preflight requests and append configured CORS headers to applicable requests.

Validation

Defaultnull

mcp.policies.cors.allowCredentials

boolean

No description for this field.

Validation

Defaultfalse

mcp.policies.cors.allowHeaders

string[]

No description for this field.

Validation

Default[]

mcp.policies.cors.allowMethods

string[]

No description for this field.

Validation

Default[]

mcp.policies.cors.allowOrigins

string[]

No description for this field.

Validation

Default[]

mcp.policies.cors.exposeHeaders

string[]

No description for this field.

Validation

Default[]

mcp.policies.cors.maxAge

string

No description for this field.

Validation

Defaultnull

mcp.policies.mcpAuthorization

object

Authorization policies for MCP access.

Validation

Defaultnull

mcp.policies.mcpAuthorization.rules

string[]Required

No description for this field.

mcp.policies.authorization

object

Authorization policies for HTTP access.

Validation

Defaultnull

mcp.policies.authorization.rules

string[]Required

No description for this field.

mcp.policies.mcpAuthentication

object

Authentication for MCP clients.

mcp.policies.mcpAuthentication.issuer

stringRequired

No description for this field.

mcp.policies.mcpAuthentication.audiences

string[]Required

No description for this field.

mcp.policies.mcpAuthentication.provider

object

No description for this field.

mcp.policies.mcpAuthentication.provider.auth0

objectRequired

No description for this field.

mcp.policies.mcpAuthentication.resourceMetadata

objectRequired

No description for this field.

mcp.policies.mcpAuthentication.jwks

objectRequired

No description for this field.

mcp.policies.mcpAuthentication.jwks.file

stringRequired

No description for this field.

mcp.policies.mcpAuthentication.mode

string

A valid token, issued by a configured issuer, must be present.  
This is the default option.

Validation

Conststrict

Defaultstrict

mcp.policies.mcpAuthentication.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

mcp.policies.mcpAuthentication.authorizationLocation.header

objectRequired

No description for this field.

mcp.policies.mcpAuthentication.authorizationLocation.header.name

stringRequired

No description for this field.

mcp.policies.mcpAuthentication.authorizationLocation.header.prefix

string

No description for this field.

mcp.policies.mcpAuthentication.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

mcp.policies.mcpAuthentication.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

mcp.policies.mcpAuthentication.clientId

string

No description for this field.

mcp.policies.a2a

object

Mark this traffic as A2A to enable A2A processing and telemetry.

Validation

Defaultnull

mcp.policies.ai

object

Mark this as LLM traffic to enable LLM processing.

Validation

Defaultnull

mcp.policies.ai.promptGuard

object

No description for this field.

mcp.policies.ai.promptGuard.request

object[]

No description for this field.

mcp.policies.ai.promptGuard.request.regex

objectRequired

No description for this field.

mcp.policies.ai.promptGuard.request.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

mcp.policies.ai.promptGuard.request.regex.rules

object[]Required

No description for this field.

mcp.policies.ai.promptGuard.request.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

mcp.policies.ai.promptGuard.response

object[]

No description for this field.

mcp.policies.ai.promptGuard.response.regex

objectRequired

No description for this field.

mcp.policies.ai.promptGuard.response.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

mcp.policies.ai.promptGuard.response.regex.rules

object[]Required

No description for this field.

mcp.policies.ai.promptGuard.response.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

mcp.policies.ai.defaults

object

No description for this field.

mcp.policies.ai.overrides

object

No description for this field.

mcp.policies.ai.transformations

object

No description for this field.

mcp.policies.ai.prompts

object

No description for this field.

Validation

Min properties1

mcp.policies.ai.prompts.append

object[]

No description for this field.

mcp.policies.ai.prompts.append.role

stringRequired

No description for this field.

mcp.policies.ai.prompts.append.content

stringRequired

No description for this field.

mcp.policies.ai.prompts.prepend

object[]

No description for this field.

mcp.policies.ai.prompts.prepend.role

stringRequired

No description for this field.

mcp.policies.ai.prompts.prepend.content

stringRequired

No description for this field.

mcp.policies.ai.modelAliases

object

No description for this field.

mcp.policies.ai.promptCaching

object

No description for this field.

mcp.policies.ai.promptCaching.cacheSystem

boolean

No description for this field.

Validation

Defaulttrue

mcp.policies.ai.promptCaching.cacheMessages

boolean

No description for this field.

Validation

Defaulttrue

mcp.policies.ai.promptCaching.cacheTools

boolean

No description for this field.

Validation

Defaultfalse

mcp.policies.ai.promptCaching.minTokens

integer

No description for this field.

Validation

Default1024

Formatuint

Minimum0

mcp.policies.ai.promptCaching.cacheMessageOffset

integer

No description for this field.

Validation

Default0

Formatuint

Minimum0

mcp.policies.ai.routes

object

No description for this field.

mcp.policies.backendTLS

object

Send TLS to the backend.

mcp.policies.backendTLS.cert

string

No description for this field.

mcp.policies.backendTLS.key

string

No description for this field.

mcp.policies.backendTLS.root

string

No description for this field.

mcp.policies.backendTLS.hostname

string

No description for this field.

mcp.policies.backendTLS.insecure

boolean

No description for this field.

Validation

Defaultfalse

mcp.policies.backendTLS.insecureHost

boolean

No description for this field.

Validation

Defaultfalse

mcp.policies.backendTLS.alpn

string[]

No description for this field.

Validation

Defaultnull

mcp.policies.backendTLS.subjectAltNames

string[]

No description for this field.

Validation

Defaultnull

mcp.policies.backendTLS.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

Validation

Defaultnull

mcp.policies.backendTunnel

object

Tunnel to the backend.

Validation

Defaultnull

mcp.policies.backendTunnel.proxy

objectRequired

Reference to the proxy address

mcp.policies.backendTunnel.proxy.service

objectRequired

No description for this field.

mcp.policies.backendTunnel.proxy.service.name

objectRequired

No description for this field.

mcp.policies.backendTunnel.proxy.service.name.namespace

stringRequired

No description for this field.

mcp.policies.backendTunnel.proxy.service.name.hostname

stringRequired

No description for this field.

mcp.policies.backendTunnel.proxy.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.policies.backendAuth

object

Authenticate to the backend.

Validation

Defaultnull

mcp.policies.backendAuth.passthrough

objectRequired

No description for this field.

mcp.policies.backendAuth.passthrough.location

object

No description for this field.

mcp.policies.backendAuth.passthrough.location.header

objectRequired

No description for this field.

mcp.policies.backendAuth.passthrough.location.header.name

stringRequired

No description for this field.

mcp.policies.backendAuth.passthrough.location.header.prefix

string

No description for this field.

mcp.policies.localRateLimit

object

Rate limit incoming requests. State is kept local.

mcp.policies.localRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

mcp.policies.localRateLimit.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

mcp.policies.localRateLimit.conditional.maxTokens

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

mcp.policies.localRateLimit.conditional.tokensPerFill

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

mcp.policies.localRateLimit.conditional.fillInterval

stringRequired

No description for this field.

mcp.policies.localRateLimit.conditional.type

string

No description for this field.

Validation

Enumrequests, tokens

Defaultrequests

mcp.policies.remoteRateLimit

object

Rate limit incoming requests. State is managed by a remote server.

mcp.policies.remoteRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

mcp.policies.remoteRateLimit.conditional.service

objectRequired

No description for this field.

mcp.policies.remoteRateLimit.conditional.service.name

objectRequired

No description for this field.

mcp.policies.remoteRateLimit.conditional.service.name.namespace

stringRequired

No description for this field.

mcp.policies.remoteRateLimit.conditional.service.name.hostname

stringRequired

No description for this field.

mcp.policies.remoteRateLimit.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.policies.jwtAuth

object

Authenticate incoming JWT requests.

mcp.policies.jwtAuth.mode

string

A valid token, issued by a configured issuer, must be present.

Validation

Conststrict

Defaultoptional

mcp.policies.jwtAuth.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

mcp.policies.jwtAuth.location.header

objectRequired

No description for this field.

mcp.policies.jwtAuth.location.header.name

stringRequired

No description for this field.

mcp.policies.jwtAuth.location.header.prefix

string

No description for this field.

mcp.policies.jwtAuth.providers

object[]Required

No description for this field.

mcp.policies.jwtAuth.providers.issuer

stringRequired

No description for this field.

mcp.policies.jwtAuth.providers.audiences

string[]

No description for this field.

mcp.policies.jwtAuth.providers.jwks

objectRequired

No description for this field.

mcp.policies.jwtAuth.providers.jwks.file

stringRequired

No description for this field.

mcp.policies.jwtAuth.providers.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

mcp.policies.jwtAuth.providers.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

mcp.policies.oidc

object

Authenticate incoming browser requests with OIDC authorization code flow.

mcp.policies.oidc.issuer

stringRequired

Issuer used for discovery and ID token validation.

mcp.policies.oidc.discovery

object

Optional discovery document override. If omitted, discovery uses  
`${issuer}/.well-known/openid-configuration`.

mcp.policies.oidc.discovery.file

stringRequired

No description for this field.

mcp.policies.oidc.authorizationEndpoint

string

Authorization endpoint used to start the browser login flow.

Validation

Defaultnull

mcp.policies.oidc.tokenEndpoint

string

Token endpoint used to exchange the authorization code.

Validation

Defaultnull

mcp.policies.oidc.tokenEndpointAuth

string

Token endpoint client authentication method for explicit provider configuration.

Discovery mode derives this from provider metadata. Explicit mode defaults to  
`clientSecretBasic` when omitted.

Validation

EnumclientSecretBasic, clientSecretPost

Defaultnull

mcp.policies.oidc.jwks

object

JWKS source used to validate returned ID tokens.

mcp.policies.oidc.jwks.file

stringRequired

No description for this field.

mcp.policies.oidc.clientId

stringRequired

OAuth2 client identifier used for authorization and token exchange.

mcp.policies.oidc.clientSecret

stringRequired

OAuth2 client secret used for token exchange.

mcp.policies.oidc.redirectURI

stringRequired

Absolute callback URI handled by the gateway.  
This policy always redirects unauthenticated non-callback requests back through this login  
flow.

mcp.policies.oidc.scopes

string[]

Additional OAuth2 scopes to request. `openid` is always included.

Validation

Default[]

mcp.policies.basicAuth

object

Authenticate incoming requests using Basic Authentication with htpasswd.

mcp.policies.basicAuth.htpasswd

objectRequired

.htpasswd file contents/reference

mcp.policies.basicAuth.htpasswd.file

stringRequired

No description for this field.

mcp.policies.basicAuth.realm

string

Realm name for the WWW-Authenticate header

Validation

Defaultnull

mcp.policies.basicAuth.mode

string

Validation mode for basic authentication

Validation

Conststrict

Defaultoptional

mcp.policies.basicAuth.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Basic "}}

mcp.policies.basicAuth.authorizationLocation.header

objectRequired

No description for this field.

mcp.policies.basicAuth.authorizationLocation.header.name

stringRequired

No description for this field.

mcp.policies.basicAuth.authorizationLocation.header.prefix

string

No description for this field.

mcp.policies.apiKey

object

Authenticate incoming requests using API Keys

mcp.policies.apiKey.keys

object[]Required

List of API keys

mcp.policies.apiKey.keys.key

stringRequired

No description for this field.

mcp.policies.apiKey.keys.metadata

No description for this field.

mcp.policies.apiKey.mode

string

Validation mode for API keys

Validation

Conststrict

Defaultoptional

mcp.policies.apiKey.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

mcp.policies.apiKey.location.header

objectRequired

No description for this field.

mcp.policies.apiKey.location.header.name

stringRequired

No description for this field.

mcp.policies.apiKey.location.header.prefix

string

No description for this field.

mcp.policies.extAuthz

object

Authenticate incoming requests by calling an external authorization server.

mcp.policies.extAuthz.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

mcp.policies.extAuthz.conditional.service

objectRequired

No description for this field.

mcp.policies.extAuthz.conditional.service.name

objectRequired

No description for this field.

mcp.policies.extAuthz.conditional.service.name.namespace

stringRequired

No description for this field.

mcp.policies.extAuthz.conditional.service.name.hostname

stringRequired

No description for this field.

mcp.policies.extAuthz.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.policies.extProc

object

Extend agentgateway with an external processor

mcp.policies.extProc.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

mcp.policies.extProc.conditional.service

objectRequired

No description for this field.

mcp.policies.extProc.conditional.service.name

objectRequired

No description for this field.

mcp.policies.extProc.conditional.service.name.namespace

stringRequired

No description for this field.

mcp.policies.extProc.conditional.service.name.hostname

stringRequired

No description for this field.

mcp.policies.extProc.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

mcp.policies.transformations

object

Modify requests and responses

mcp.policies.transformations.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

mcp.policies.transformations.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

mcp.policies.transformations.conditional.request

object

No description for this field.

mcp.policies.transformations.conditional.request.add

object

No description for this field.

Validation

Default{}

mcp.policies.transformations.conditional.request.set

object

No description for this field.

Validation

Default{}

mcp.policies.transformations.conditional.request.remove

string[]

No description for this field.

Validation

Default[]

mcp.policies.transformations.conditional.request.body

string

No description for this field.

Validation

Defaultnull

mcp.policies.transformations.conditional.request.metadata

object

No description for this field.

Validation

Default{}

mcp.policies.transformations.conditional.response

object

No description for this field.

mcp.policies.transformations.conditional.response.add

object

No description for this field.

Validation

Default{}

mcp.policies.transformations.conditional.response.set

object

No description for this field.

Validation

Default{}

mcp.policies.transformations.conditional.response.remove

string[]

No description for this field.

Validation

Default[]

mcp.policies.transformations.conditional.response.body

string

No description for this field.

Validation

Defaultnull

mcp.policies.transformations.conditional.response.metadata

object

No description for this field.

Validation

Default{}

mcp.policies.csrf

object

Handle CSRF protection by validating request origins against configured allowed origins.

Validation

Defaultnull

mcp.policies.csrf.additionalOrigins

string[]

No description for this field.

Validation

Default[]

Unique itemstrue

mcp.policies.timeout

object

Timeout requests that exceed the configured duration.

Validation

Defaultnull

mcp.policies.timeout.requestTimeout

string

No description for this field.

mcp.policies.timeout.backendRequestTimeout

string

No description for this field.

mcp.policies.retry

object

Retry matching requests.

Validation

Defaultnull

mcp.policies.retry.attempts

integer

No description for this field.

Validation

Default1

Formatuint8

Minimum1

Maximum255

mcp.policies.retry.backoff

string

No description for this field.

mcp.policies.retry.codes

integer[]Required

No description for this field.

policies

object[]

policies defines additional policies that can be attached to various other configurations.  
This is an advanced feature; users should typically use the inline `policies` field under route/gateway.

policies.name

objectRequired

No description for this field.

policies.name.name

stringRequired

No description for this field.

policies.name.namespace

stringRequired

No description for this field.

policies.target

objectRequired

No description for this field.

policies.target.gateway

objectRequired

No description for this field.

policies.target.gateway.gatewayName

stringRequired

No description for this field.

policies.target.gateway.gatewayNamespace

stringRequired

No description for this field.

policies.target.gateway.listenerName

string

No description for this field.

policies.target.gateway.port

integer

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

policies.phase

string

phase defines at what level the policy runs at. Gateway policies run pre-routing, while  
Route policies apply post-routing.  
Only a subset of policies are eligible as Gateway policies.  
In general, normal (route level) policies should be used, except you need the policy to influence  
routing.

Validation

Enumroute, gateway

Defaultroute

policies.policy

objectRequired

No description for this field.

policies.policy.requestHeaderModifier

object

Headers to be modified in the request.

Validation

Defaultnull

policies.policy.requestHeaderModifier.add

object

No description for this field.

policies.policy.requestHeaderModifier.set

object

No description for this field.

policies.policy.requestHeaderModifier.remove

string[]

No description for this field.

policies.policy.responseHeaderModifier

object

Headers to be modified in the response.

Validation

Defaultnull

policies.policy.responseHeaderModifier.add

object

No description for this field.

policies.policy.responseHeaderModifier.set

object

No description for this field.

policies.policy.responseHeaderModifier.remove

string[]

No description for this field.

policies.policy.requestRedirect

object

Directly respond to the request with a redirect.

Validation

Defaultnull

policies.policy.requestRedirect.scheme

string

No description for this field.

policies.policy.requestRedirect.authority

object

No description for this field.

policies.policy.requestRedirect.authority.full

stringRequired

No description for this field.

policies.policy.requestRedirect.path

object

No description for this field.

policies.policy.requestRedirect.path.full

stringRequired

No description for this field.

policies.policy.requestRedirect.status

integer

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

policies.policy.urlRewrite

object

Modify the URL path or authority.

Validation

Defaultnull

policies.policy.urlRewrite.authority

object

No description for this field.

policies.policy.urlRewrite.authority.full

stringRequired

No description for this field.

policies.policy.urlRewrite.path

object

No description for this field.

policies.policy.urlRewrite.path.full

stringRequired

No description for this field.

policies.policy.requestMirror

object

Mirror incoming requests to another destination.

Validation

Defaultnull

policies.policy.requestMirror.backend

objectRequired

Service reference. Service must be defined in the top level services list.

policies.policy.requestMirror.backend.service

objectRequired

No description for this field.

policies.policy.requestMirror.backend.service.name

objectRequired

No description for this field.

policies.policy.requestMirror.backend.service.name.namespace

stringRequired

No description for this field.

policies.policy.requestMirror.backend.service.name.hostname

stringRequired

No description for this field.

policies.policy.requestMirror.backend.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

policies.policy.requestMirror.percentage

numberRequired

No description for this field.

Validation

Formatdouble

policies.policy.directResponse

object

Directly respond to the request with a static response.

policies.policy.directResponse.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

policies.policy.directResponse.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

policies.policy.directResponse.conditional.body

array|string

No description for this field.

policies.policy.directResponse.conditional.bodyExpression

string

No description for this field.

policies.policy.directResponse.conditional.headers

object

No description for this field.

policies.policy.directResponse.conditional.status

integerRequired

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

policies.policy.cors

object

Handle CORS preflight requests and append configured CORS headers to applicable requests.

Validation

Defaultnull

policies.policy.cors.allowCredentials

boolean

No description for this field.

Validation

Defaultfalse

policies.policy.cors.allowHeaders

string[]

No description for this field.

Validation

Default[]

policies.policy.cors.allowMethods

string[]

No description for this field.

Validation

Default[]

policies.policy.cors.allowOrigins

string[]

No description for this field.

Validation

Default[]

policies.policy.cors.exposeHeaders

string[]

No description for this field.

Validation

Default[]

policies.policy.cors.maxAge

string

No description for this field.

Validation

Defaultnull

policies.policy.mcpAuthorization

object

Authorization policies for MCP access.

Validation

Defaultnull

policies.policy.mcpAuthorization.rules

string[]Required

No description for this field.

policies.policy.authorization

object

Authorization policies for HTTP access.

Validation

Defaultnull

policies.policy.authorization.rules

string[]Required

No description for this field.

policies.policy.mcpAuthentication

object

Authentication for MCP clients.

policies.policy.mcpAuthentication.issuer

stringRequired

No description for this field.

policies.policy.mcpAuthentication.audiences

string[]Required

No description for this field.

policies.policy.mcpAuthentication.provider

object

No description for this field.

policies.policy.mcpAuthentication.provider.auth0

objectRequired

No description for this field.

policies.policy.mcpAuthentication.resourceMetadata

objectRequired

No description for this field.

policies.policy.mcpAuthentication.jwks

objectRequired

No description for this field.

policies.policy.mcpAuthentication.jwks.file

stringRequired

No description for this field.

policies.policy.mcpAuthentication.mode

string

A valid token, issued by a configured issuer, must be present.  
This is the default option.

Validation

Conststrict

Defaultstrict

policies.policy.mcpAuthentication.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

policies.policy.mcpAuthentication.authorizationLocation.header

objectRequired

No description for this field.

policies.policy.mcpAuthentication.authorizationLocation.header.name

stringRequired

No description for this field.

policies.policy.mcpAuthentication.authorizationLocation.header.prefix

string

No description for this field.

policies.policy.mcpAuthentication.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

policies.policy.mcpAuthentication.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

policies.policy.mcpAuthentication.clientId

string

No description for this field.

policies.policy.a2a

object

Mark this traffic as A2A to enable A2A processing and telemetry.

Validation

Defaultnull

policies.policy.ai

object

Mark this as LLM traffic to enable LLM processing.

Validation

Defaultnull

policies.policy.ai.promptGuard

object

No description for this field.

policies.policy.ai.promptGuard.request

object[]

No description for this field.

policies.policy.ai.promptGuard.request.regex

objectRequired

No description for this field.

policies.policy.ai.promptGuard.request.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

policies.policy.ai.promptGuard.request.regex.rules

object[]Required

No description for this field.

policies.policy.ai.promptGuard.request.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

policies.policy.ai.promptGuard.response

object[]

No description for this field.

policies.policy.ai.promptGuard.response.regex

objectRequired

No description for this field.

policies.policy.ai.promptGuard.response.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

policies.policy.ai.promptGuard.response.regex.rules

object[]Required

No description for this field.

policies.policy.ai.promptGuard.response.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

policies.policy.ai.defaults

object

No description for this field.

policies.policy.ai.overrides

object

No description for this field.

policies.policy.ai.transformations

object

No description for this field.

policies.policy.ai.prompts

object

No description for this field.

Validation

Min properties1

policies.policy.ai.prompts.append

object[]

No description for this field.

policies.policy.ai.prompts.append.role

stringRequired

No description for this field.

policies.policy.ai.prompts.append.content

stringRequired

No description for this field.

policies.policy.ai.prompts.prepend

object[]

No description for this field.

policies.policy.ai.prompts.prepend.role

stringRequired

No description for this field.

policies.policy.ai.prompts.prepend.content

stringRequired

No description for this field.

policies.policy.ai.modelAliases

object

No description for this field.

policies.policy.ai.promptCaching

object

No description for this field.

policies.policy.ai.promptCaching.cacheSystem

boolean

No description for this field.

Validation

Defaulttrue

policies.policy.ai.promptCaching.cacheMessages

boolean

No description for this field.

Validation

Defaulttrue

policies.policy.ai.promptCaching.cacheTools

boolean

No description for this field.

Validation

Defaultfalse

policies.policy.ai.promptCaching.minTokens

integer

No description for this field.

Validation

Default1024

Formatuint

Minimum0

policies.policy.ai.promptCaching.cacheMessageOffset

integer

No description for this field.

Validation

Default0

Formatuint

Minimum0

policies.policy.ai.routes

object

No description for this field.

policies.policy.backendTLS

object

Send TLS to the backend.

policies.policy.backendTLS.cert

string

No description for this field.

policies.policy.backendTLS.key

string

No description for this field.

policies.policy.backendTLS.root

string

No description for this field.

policies.policy.backendTLS.hostname

string

No description for this field.

policies.policy.backendTLS.insecure

boolean

No description for this field.

Validation

Defaultfalse

policies.policy.backendTLS.insecureHost

boolean

No description for this field.

Validation

Defaultfalse

policies.policy.backendTLS.alpn

string[]

No description for this field.

Validation

Defaultnull

policies.policy.backendTLS.subjectAltNames

string[]

No description for this field.

Validation

Defaultnull

policies.policy.backendTLS.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

Validation

Defaultnull

policies.policy.backendTunnel

object

Tunnel to the backend.

Validation

Defaultnull

policies.policy.backendTunnel.proxy

objectRequired

Reference to the proxy address

policies.policy.backendTunnel.proxy.service

objectRequired

No description for this field.

policies.policy.backendTunnel.proxy.service.name

objectRequired

No description for this field.

policies.policy.backendTunnel.proxy.service.name.namespace

stringRequired

No description for this field.

policies.policy.backendTunnel.proxy.service.name.hostname

stringRequired

No description for this field.

policies.policy.backendTunnel.proxy.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

policies.policy.backendAuth

object

Authenticate to the backend.

Validation

Defaultnull

policies.policy.backendAuth.passthrough

objectRequired

No description for this field.

policies.policy.backendAuth.passthrough.location

object

No description for this field.

policies.policy.backendAuth.passthrough.location.header

objectRequired

No description for this field.

policies.policy.backendAuth.passthrough.location.header.name

stringRequired

No description for this field.

policies.policy.backendAuth.passthrough.location.header.prefix

string

No description for this field.

policies.policy.localRateLimit

object

Rate limit incoming requests. State is kept local.

policies.policy.localRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

policies.policy.localRateLimit.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

policies.policy.localRateLimit.conditional.maxTokens

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

policies.policy.localRateLimit.conditional.tokensPerFill

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

policies.policy.localRateLimit.conditional.fillInterval

stringRequired

No description for this field.

policies.policy.localRateLimit.conditional.type

string

No description for this field.

Validation

Enumrequests, tokens

Defaultrequests

policies.policy.remoteRateLimit

object

Rate limit incoming requests. State is managed by a remote server.

policies.policy.remoteRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

policies.policy.remoteRateLimit.conditional.service

objectRequired

No description for this field.

policies.policy.remoteRateLimit.conditional.service.name

objectRequired

No description for this field.

policies.policy.remoteRateLimit.conditional.service.name.namespace

stringRequired

No description for this field.

policies.policy.remoteRateLimit.conditional.service.name.hostname

stringRequired

No description for this field.

policies.policy.remoteRateLimit.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

policies.policy.jwtAuth

object

Authenticate incoming JWT requests.

policies.policy.jwtAuth.mode

string

A valid token, issued by a configured issuer, must be present.

Validation

Conststrict

Defaultoptional

policies.policy.jwtAuth.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

policies.policy.jwtAuth.location.header

objectRequired

No description for this field.

policies.policy.jwtAuth.location.header.name

stringRequired

No description for this field.

policies.policy.jwtAuth.location.header.prefix

string

No description for this field.

policies.policy.jwtAuth.providers

object[]Required

No description for this field.

policies.policy.jwtAuth.providers.issuer

stringRequired

No description for this field.

policies.policy.jwtAuth.providers.audiences

string[]

No description for this field.

policies.policy.jwtAuth.providers.jwks

objectRequired

No description for this field.

policies.policy.jwtAuth.providers.jwks.file

stringRequired

No description for this field.

policies.policy.jwtAuth.providers.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

policies.policy.jwtAuth.providers.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

policies.policy.oidc

object

Authenticate incoming browser requests with OIDC authorization code flow.

policies.policy.oidc.issuer

stringRequired

Issuer used for discovery and ID token validation.

policies.policy.oidc.discovery

object

Optional discovery document override. If omitted, discovery uses  
`${issuer}/.well-known/openid-configuration`.

policies.policy.oidc.discovery.file

stringRequired

No description for this field.

policies.policy.oidc.authorizationEndpoint

string

Authorization endpoint used to start the browser login flow.

Validation

Defaultnull

policies.policy.oidc.tokenEndpoint

string

Token endpoint used to exchange the authorization code.

Validation

Defaultnull

policies.policy.oidc.tokenEndpointAuth

string

Token endpoint client authentication method for explicit provider configuration.

Discovery mode derives this from provider metadata. Explicit mode defaults to  
`clientSecretBasic` when omitted.

Validation

EnumclientSecretBasic, clientSecretPost

Defaultnull

policies.policy.oidc.jwks

object

JWKS source used to validate returned ID tokens.

policies.policy.oidc.jwks.file

stringRequired

No description for this field.

policies.policy.oidc.clientId

stringRequired

OAuth2 client identifier used for authorization and token exchange.

policies.policy.oidc.clientSecret

stringRequired

OAuth2 client secret used for token exchange.

policies.policy.oidc.redirectURI

stringRequired

Absolute callback URI handled by the gateway.  
This policy always redirects unauthenticated non-callback requests back through this login  
flow.

policies.policy.oidc.scopes

string[]

Additional OAuth2 scopes to request. `openid` is always included.

Validation

Default[]

policies.policy.basicAuth

object

Authenticate incoming requests using Basic Authentication with htpasswd.

policies.policy.basicAuth.htpasswd

objectRequired

.htpasswd file contents/reference

policies.policy.basicAuth.htpasswd.file

stringRequired

No description for this field.

policies.policy.basicAuth.realm

string

Realm name for the WWW-Authenticate header

Validation

Defaultnull

policies.policy.basicAuth.mode

string

Validation mode for basic authentication

Validation

Conststrict

Defaultoptional

policies.policy.basicAuth.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Basic "}}

policies.policy.basicAuth.authorizationLocation.header

objectRequired

No description for this field.

policies.policy.basicAuth.authorizationLocation.header.name

stringRequired

No description for this field.

policies.policy.basicAuth.authorizationLocation.header.prefix

string

No description for this field.

policies.policy.apiKey

object

Authenticate incoming requests using API Keys

policies.policy.apiKey.keys

object[]Required

List of API keys

policies.policy.apiKey.keys.key

stringRequired

No description for this field.

policies.policy.apiKey.keys.metadata

No description for this field.

policies.policy.apiKey.mode

string

Validation mode for API keys

Validation

Conststrict

Defaultoptional

policies.policy.apiKey.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

policies.policy.apiKey.location.header

objectRequired

No description for this field.

policies.policy.apiKey.location.header.name

stringRequired

No description for this field.

policies.policy.apiKey.location.header.prefix

string

No description for this field.

policies.policy.extAuthz

object

Authenticate incoming requests by calling an external authorization server.

policies.policy.extAuthz.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

policies.policy.extAuthz.conditional.service

objectRequired

No description for this field.

policies.policy.extAuthz.conditional.service.name

objectRequired

No description for this field.

policies.policy.extAuthz.conditional.service.name.namespace

stringRequired

No description for this field.

policies.policy.extAuthz.conditional.service.name.hostname

stringRequired

No description for this field.

policies.policy.extAuthz.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

policies.policy.extProc

object

Extend agentgateway with an external processor

policies.policy.extProc.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

policies.policy.extProc.conditional.service

objectRequired

No description for this field.

policies.policy.extProc.conditional.service.name

objectRequired

No description for this field.

policies.policy.extProc.conditional.service.name.namespace

stringRequired

No description for this field.

policies.policy.extProc.conditional.service.name.hostname

stringRequired

No description for this field.

policies.policy.extProc.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

policies.policy.transformations

object

Modify requests and responses

policies.policy.transformations.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

policies.policy.transformations.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

policies.policy.transformations.conditional.request

object

No description for this field.

policies.policy.transformations.conditional.request.add

object

No description for this field.

Validation

Default{}

policies.policy.transformations.conditional.request.set

object

No description for this field.

Validation

Default{}

policies.policy.transformations.conditional.request.remove

string[]

No description for this field.

Validation

Default[]

policies.policy.transformations.conditional.request.body

string

No description for this field.

Validation

Defaultnull

policies.policy.transformations.conditional.request.metadata

object

No description for this field.

Validation

Default{}

policies.policy.transformations.conditional.response

object

No description for this field.

policies.policy.transformations.conditional.response.add

object

No description for this field.

Validation

Default{}

policies.policy.transformations.conditional.response.set

object

No description for this field.

Validation

Default{}

policies.policy.transformations.conditional.response.remove

string[]

No description for this field.

Validation

Default[]

policies.policy.transformations.conditional.response.body

string

No description for this field.

Validation

Defaultnull

policies.policy.transformations.conditional.response.metadata

object

No description for this field.

Validation

Default{}

policies.policy.csrf

object

Handle CSRF protection by validating request origins against configured allowed origins.

Validation

Defaultnull

policies.policy.csrf.additionalOrigins

string[]

No description for this field.

Validation

Default[]

Unique itemstrue

policies.policy.timeout

object

Timeout requests that exceed the configured duration.

Validation

Defaultnull

policies.policy.timeout.requestTimeout

string

No description for this field.

policies.policy.timeout.backendRequestTimeout

string

No description for this field.

policies.policy.retry

object

Retry matching requests.

Validation

Defaultnull

policies.policy.retry.attempts

integer

No description for this field.

Validation

Default1

Formatuint8

Minimum1

Maximum255

policies.policy.retry.backoff

string

No description for this field.

policies.policy.retry.codes

integer[]Required

No description for this field.

workloads

No description for this field.

Validation

Default[]

services

No description for this field.

Validation

Default[]

backends

object[]

No description for this field.

backends.host

stringRequired

No description for this field.

routeGroups

object[]

No description for this field.

routeGroups.name

stringRequired

No description for this field.

routeGroups.routes

object[]Required

No description for this field.

routeGroups.routes.name

string

No description for this field.

Validation

Defaultnull

routeGroups.routes.namespace

string

No description for this field.

Validation

Defaultnull

routeGroups.routes.ruleName

string

No description for this field.

Validation

Defaultnull

routeGroups.routes.hostnames

string[]

Can be a wildcard

routeGroups.routes.matches

object[]

No description for this field.

Validation

Default[{"path": {"pathPrefix": "/"}}]

routeGroups.routes.matches.headers

object[]

No description for this field.

routeGroups.routes.matches.headers.name

stringRequired

No description for this field.

routeGroups.routes.matches.headers.value

objectRequired

No description for this field.

routeGroups.routes.matches.headers.value.exact

stringRequired

No description for this field.

routeGroups.routes.matches.path

object

No description for this field.

Validation

Default{"pathPrefix": "/"}

routeGroups.routes.matches.path.exact

stringRequired

No description for this field.

routeGroups.routes.matches.method

string

No description for this field.

routeGroups.routes.matches.query

object[]

No description for this field.

routeGroups.routes.matches.query.name

stringRequired

No description for this field.

routeGroups.routes.matches.query.value

objectRequired

No description for this field.

routeGroups.routes.matches.query.value.exact

stringRequired

No description for this field.

routeGroups.routes.policies

object

No description for this field.

routeGroups.routes.policies.requestHeaderModifier

object

Headers to be modified in the request.

Validation

Defaultnull

routeGroups.routes.policies.requestHeaderModifier.add

object

No description for this field.

routeGroups.routes.policies.requestHeaderModifier.set

object

No description for this field.

routeGroups.routes.policies.requestHeaderModifier.remove

string[]

No description for this field.

routeGroups.routes.policies.responseHeaderModifier

object

Headers to be modified in the response.

Validation

Defaultnull

routeGroups.routes.policies.responseHeaderModifier.add

object

No description for this field.

routeGroups.routes.policies.responseHeaderModifier.set

object

No description for this field.

routeGroups.routes.policies.responseHeaderModifier.remove

string[]

No description for this field.

routeGroups.routes.policies.requestRedirect

object

Directly respond to the request with a redirect.

Validation

Defaultnull

routeGroups.routes.policies.requestRedirect.scheme

string

No description for this field.

routeGroups.routes.policies.requestRedirect.authority

object

No description for this field.

routeGroups.routes.policies.requestRedirect.authority.full

stringRequired

No description for this field.

routeGroups.routes.policies.requestRedirect.path

object

No description for this field.

routeGroups.routes.policies.requestRedirect.path.full

stringRequired

No description for this field.

routeGroups.routes.policies.requestRedirect.status

integer

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

routeGroups.routes.policies.urlRewrite

object

Modify the URL path or authority.

Validation

Defaultnull

routeGroups.routes.policies.urlRewrite.authority

object

No description for this field.

routeGroups.routes.policies.urlRewrite.authority.full

stringRequired

No description for this field.

routeGroups.routes.policies.urlRewrite.path

object

No description for this field.

routeGroups.routes.policies.urlRewrite.path.full

stringRequired

No description for this field.

routeGroups.routes.policies.requestMirror

object

Mirror incoming requests to another destination.

Validation

Defaultnull

routeGroups.routes.policies.requestMirror.backend

objectRequired

Service reference. Service must be defined in the top level services list.

routeGroups.routes.policies.requestMirror.backend.service

objectRequired

No description for this field.

routeGroups.routes.policies.requestMirror.backend.service.name

objectRequired

No description for this field.

routeGroups.routes.policies.requestMirror.backend.service.name.namespace

stringRequired

No description for this field.

routeGroups.routes.policies.requestMirror.backend.service.name.hostname

stringRequired

No description for this field.

routeGroups.routes.policies.requestMirror.backend.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

routeGroups.routes.policies.requestMirror.percentage

numberRequired

No description for this field.

Validation

Formatdouble

routeGroups.routes.policies.directResponse

object

Directly respond to the request with a static response.

routeGroups.routes.policies.directResponse.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

routeGroups.routes.policies.directResponse.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

routeGroups.routes.policies.directResponse.conditional.body

array|string

No description for this field.

routeGroups.routes.policies.directResponse.conditional.bodyExpression

string

No description for this field.

routeGroups.routes.policies.directResponse.conditional.headers

object

No description for this field.

routeGroups.routes.policies.directResponse.conditional.status

integerRequired

No description for this field.

Validation

Formatuint16

Minimum1

Maximum65535

routeGroups.routes.policies.cors

object

Handle CORS preflight requests and append configured CORS headers to applicable requests.

Validation

Defaultnull

routeGroups.routes.policies.cors.allowCredentials

boolean

No description for this field.

Validation

Defaultfalse

routeGroups.routes.policies.cors.allowHeaders

string[]

No description for this field.

Validation

Default[]

routeGroups.routes.policies.cors.allowMethods

string[]

No description for this field.

Validation

Default[]

routeGroups.routes.policies.cors.allowOrigins

string[]

No description for this field.

Validation

Default[]

routeGroups.routes.policies.cors.exposeHeaders

string[]

No description for this field.

Validation

Default[]

routeGroups.routes.policies.cors.maxAge

string

No description for this field.

Validation

Defaultnull

routeGroups.routes.policies.mcpAuthorization

object

Authorization policies for MCP access.

Validation

Defaultnull

routeGroups.routes.policies.mcpAuthorization.rules

string[]Required

No description for this field.

routeGroups.routes.policies.authorization

object

Authorization policies for HTTP access.

Validation

Defaultnull

routeGroups.routes.policies.authorization.rules

string[]Required

No description for this field.

routeGroups.routes.policies.mcpAuthentication

object

Authentication for MCP clients.

routeGroups.routes.policies.mcpAuthentication.issuer

stringRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.audiences

string[]Required

No description for this field.

routeGroups.routes.policies.mcpAuthentication.provider

object

No description for this field.

routeGroups.routes.policies.mcpAuthentication.provider.auth0

objectRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.resourceMetadata

objectRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.jwks

objectRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.jwks.file

stringRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.mode

string

A valid token, issued by a configured issuer, must be present.  
This is the default option.

Validation

Conststrict

Defaultstrict

routeGroups.routes.policies.mcpAuthentication.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

routeGroups.routes.policies.mcpAuthentication.authorizationLocation.header

objectRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.authorizationLocation.header.name

stringRequired

No description for this field.

routeGroups.routes.policies.mcpAuthentication.authorizationLocation.header.prefix

string

No description for this field.

routeGroups.routes.policies.mcpAuthentication.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

routeGroups.routes.policies.mcpAuthentication.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

routeGroups.routes.policies.mcpAuthentication.clientId

string

No description for this field.

routeGroups.routes.policies.a2a

object

Mark this traffic as A2A to enable A2A processing and telemetry.

Validation

Defaultnull

routeGroups.routes.policies.ai

object

Mark this as LLM traffic to enable LLM processing.

Validation

Defaultnull

routeGroups.routes.policies.ai.promptGuard

object

No description for this field.

routeGroups.routes.policies.ai.promptGuard.request

object[]

No description for this field.

routeGroups.routes.policies.ai.promptGuard.request.regex

objectRequired

No description for this field.

routeGroups.routes.policies.ai.promptGuard.request.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

routeGroups.routes.policies.ai.promptGuard.request.regex.rules

object[]Required

No description for this field.

routeGroups.routes.policies.ai.promptGuard.request.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

routeGroups.routes.policies.ai.promptGuard.response

object[]

No description for this field.

routeGroups.routes.policies.ai.promptGuard.response.regex

objectRequired

No description for this field.

routeGroups.routes.policies.ai.promptGuard.response.regex.action

string

No description for this field.

Validation

Enummask, reject

Defaultmask

routeGroups.routes.policies.ai.promptGuard.response.regex.rules

object[]Required

No description for this field.

routeGroups.routes.policies.ai.promptGuard.response.regex.rules.builtin

stringRequired

No description for this field.

Validation

Enumssn, creditCard, phoneNumber, email, caSin

routeGroups.routes.policies.ai.defaults

object

No description for this field.

routeGroups.routes.policies.ai.overrides

object

No description for this field.

routeGroups.routes.policies.ai.transformations

object

No description for this field.

routeGroups.routes.policies.ai.prompts

object

No description for this field.

Validation

Min properties1

routeGroups.routes.policies.ai.prompts.append

object[]

No description for this field.

routeGroups.routes.policies.ai.prompts.append.role

stringRequired

No description for this field.

routeGroups.routes.policies.ai.prompts.append.content

stringRequired

No description for this field.

routeGroups.routes.policies.ai.prompts.prepend

object[]

No description for this field.

routeGroups.routes.policies.ai.prompts.prepend.role

stringRequired

No description for this field.

routeGroups.routes.policies.ai.prompts.prepend.content

stringRequired

No description for this field.

routeGroups.routes.policies.ai.modelAliases

object

No description for this field.

routeGroups.routes.policies.ai.promptCaching

object

No description for this field.

routeGroups.routes.policies.ai.promptCaching.cacheSystem

boolean

No description for this field.

Validation

Defaulttrue

routeGroups.routes.policies.ai.promptCaching.cacheMessages

boolean

No description for this field.

Validation

Defaulttrue

routeGroups.routes.policies.ai.promptCaching.cacheTools

boolean

No description for this field.

Validation

Defaultfalse

routeGroups.routes.policies.ai.promptCaching.minTokens

integer

No description for this field.

Validation

Default1024

Formatuint

Minimum0

routeGroups.routes.policies.ai.promptCaching.cacheMessageOffset

integer

No description for this field.

Validation

Default0

Formatuint

Minimum0

routeGroups.routes.policies.ai.routes

object

No description for this field.

routeGroups.routes.policies.backendTLS

object

Send TLS to the backend.

routeGroups.routes.policies.backendTLS.cert

string

No description for this field.

routeGroups.routes.policies.backendTLS.key

string

No description for this field.

routeGroups.routes.policies.backendTLS.root

string

No description for this field.

routeGroups.routes.policies.backendTLS.hostname

string

No description for this field.

routeGroups.routes.policies.backendTLS.insecure

boolean

No description for this field.

Validation

Defaultfalse

routeGroups.routes.policies.backendTLS.insecureHost

boolean

No description for this field.

Validation

Defaultfalse

routeGroups.routes.policies.backendTLS.alpn

string[]

No description for this field.

Validation

Defaultnull

routeGroups.routes.policies.backendTLS.subjectAltNames

string[]

No description for this field.

Validation

Defaultnull

routeGroups.routes.policies.backendTLS.keyExchangeGroups

string[]

Key exchange groups allowed for negotiating TLS.

Validation

Defaultnull

routeGroups.routes.policies.backendTunnel

object

Tunnel to the backend.

Validation

Defaultnull

routeGroups.routes.policies.backendTunnel.proxy

objectRequired

Reference to the proxy address

routeGroups.routes.policies.backendTunnel.proxy.service

objectRequired

No description for this field.

routeGroups.routes.policies.backendTunnel.proxy.service.name

objectRequired

No description for this field.

routeGroups.routes.policies.backendTunnel.proxy.service.name.namespace

stringRequired

No description for this field.

routeGroups.routes.policies.backendTunnel.proxy.service.name.hostname

stringRequired

No description for this field.

routeGroups.routes.policies.backendTunnel.proxy.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

routeGroups.routes.policies.backendAuth

object

Authenticate to the backend.

Validation

Defaultnull

routeGroups.routes.policies.backendAuth.passthrough

objectRequired

No description for this field.

routeGroups.routes.policies.backendAuth.passthrough.location

object

No description for this field.

routeGroups.routes.policies.backendAuth.passthrough.location.header

objectRequired

No description for this field.

routeGroups.routes.policies.backendAuth.passthrough.location.header.name

stringRequired

No description for this field.

routeGroups.routes.policies.backendAuth.passthrough.location.header.prefix

string

No description for this field.

routeGroups.routes.policies.localRateLimit

object

Rate limit incoming requests. State is kept local.

routeGroups.routes.policies.localRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

routeGroups.routes.policies.localRateLimit.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

routeGroups.routes.policies.localRateLimit.conditional.maxTokens

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

routeGroups.routes.policies.localRateLimit.conditional.tokensPerFill

integer

No description for this field.

Validation

Default0

Formatuint64

Minimum0

routeGroups.routes.policies.localRateLimit.conditional.fillInterval

stringRequired

No description for this field.

routeGroups.routes.policies.localRateLimit.conditional.type

string

No description for this field.

Validation

Enumrequests, tokens

Defaultrequests

routeGroups.routes.policies.remoteRateLimit

object

Rate limit incoming requests. State is managed by a remote server.

routeGroups.routes.policies.remoteRateLimit.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

routeGroups.routes.policies.remoteRateLimit.conditional.service

objectRequired

No description for this field.

routeGroups.routes.policies.remoteRateLimit.conditional.service.name

objectRequired

No description for this field.

routeGroups.routes.policies.remoteRateLimit.conditional.service.name.namespace

stringRequired

No description for this field.

routeGroups.routes.policies.remoteRateLimit.conditional.service.name.hostname

stringRequired

No description for this field.

routeGroups.routes.policies.remoteRateLimit.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

routeGroups.routes.policies.jwtAuth

object

Authenticate incoming JWT requests.

routeGroups.routes.policies.jwtAuth.mode

string

A valid token, issued by a configured issuer, must be present.

Validation

Conststrict

Defaultoptional

routeGroups.routes.policies.jwtAuth.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

routeGroups.routes.policies.jwtAuth.location.header

objectRequired

No description for this field.

routeGroups.routes.policies.jwtAuth.location.header.name

stringRequired

No description for this field.

routeGroups.routes.policies.jwtAuth.location.header.prefix

string

No description for this field.

routeGroups.routes.policies.jwtAuth.providers

object[]Required

No description for this field.

routeGroups.routes.policies.jwtAuth.providers.issuer

stringRequired

No description for this field.

routeGroups.routes.policies.jwtAuth.providers.audiences

string[]

No description for this field.

routeGroups.routes.policies.jwtAuth.providers.jwks

objectRequired

No description for this field.

routeGroups.routes.policies.jwtAuth.providers.jwks.file

stringRequired

No description for this field.

routeGroups.routes.policies.jwtAuth.providers.jwtValidationOptions

object

JWT validation options controlling which claims must be present in a token.

The `required_claims` set specifies which RFC 7519 registered claims must  
exist in the token payload before validation proceeds. Only the following  
values are recognized: `exp`, `nbf`, `aud`, `iss`, `sub`. Other registered  
claims such as `iat` and `jti` are **not** enforced by the underlying  
`jsonwebtoken` library and will be silently ignored.

This only enforces **presence**. Standard claims like `exp` and `nbf`  
have their values validated independently (e.g., expiry is always checked  
when the `exp` claim is present, regardless of this setting).

Defaults to `["exp"]`.

routeGroups.routes.policies.jwtAuth.providers.jwtValidationOptions.requiredClaims

string[]

Claims that must be present in the token before validation.  
Only "exp", "nbf", "aud", "iss", "sub" are enforced; others  
(including "iat" and "jti") are ignored.  
Defaults to ["exp"]. Use an empty list to require no claims.

Validation

Default["exp"]

Unique itemstrue

routeGroups.routes.policies.oidc

object

Authenticate incoming browser requests with OIDC authorization code flow.

routeGroups.routes.policies.oidc.issuer

stringRequired

Issuer used for discovery and ID token validation.

routeGroups.routes.policies.oidc.discovery

object

Optional discovery document override. If omitted, discovery uses  
`${issuer}/.well-known/openid-configuration`.

routeGroups.routes.policies.oidc.discovery.file

stringRequired

No description for this field.

routeGroups.routes.policies.oidc.authorizationEndpoint

string

Authorization endpoint used to start the browser login flow.

Validation

Defaultnull

routeGroups.routes.policies.oidc.tokenEndpoint

string

Token endpoint used to exchange the authorization code.

Validation

Defaultnull

routeGroups.routes.policies.oidc.tokenEndpointAuth

string

Token endpoint client authentication method for explicit provider configuration.

Discovery mode derives this from provider metadata. Explicit mode defaults to  
`clientSecretBasic` when omitted.

Validation

EnumclientSecretBasic, clientSecretPost

Defaultnull

routeGroups.routes.policies.oidc.jwks

object

JWKS source used to validate returned ID tokens.

routeGroups.routes.policies.oidc.jwks.file

stringRequired

No description for this field.

routeGroups.routes.policies.oidc.clientId

stringRequired

OAuth2 client identifier used for authorization and token exchange.

routeGroups.routes.policies.oidc.clientSecret

stringRequired

OAuth2 client secret used for token exchange.

routeGroups.routes.policies.oidc.redirectURI

stringRequired

Absolute callback URI handled by the gateway.  
This policy always redirects unauthenticated non-callback requests back through this login  
flow.

routeGroups.routes.policies.oidc.scopes

string[]

Additional OAuth2 scopes to request. `openid` is always included.

Validation

Default[]

routeGroups.routes.policies.basicAuth

object

Authenticate incoming requests using Basic Authentication with htpasswd.

routeGroups.routes.policies.basicAuth.htpasswd

objectRequired

.htpasswd file contents/reference

routeGroups.routes.policies.basicAuth.htpasswd.file

stringRequired

No description for this field.

routeGroups.routes.policies.basicAuth.realm

string

Realm name for the WWW-Authenticate header

Validation

Defaultnull

routeGroups.routes.policies.basicAuth.mode

string

Validation mode for basic authentication

Validation

Conststrict

Defaultoptional

routeGroups.routes.policies.basicAuth.authorizationLocation

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Basic "}}

routeGroups.routes.policies.basicAuth.authorizationLocation.header

objectRequired

No description for this field.

routeGroups.routes.policies.basicAuth.authorizationLocation.header.name

stringRequired

No description for this field.

routeGroups.routes.policies.basicAuth.authorizationLocation.header.prefix

string

No description for this field.

routeGroups.routes.policies.apiKey

object

Authenticate incoming requests using API Keys

routeGroups.routes.policies.apiKey.keys

object[]Required

List of API keys

routeGroups.routes.policies.apiKey.keys.key

stringRequired

No description for this field.

routeGroups.routes.policies.apiKey.keys.metadata

No description for this field.

routeGroups.routes.policies.apiKey.mode

string

Validation mode for API keys

Validation

Conststrict

Defaultoptional

routeGroups.routes.policies.apiKey.location

object

No description for this field.

Validation

Default{"header": {"name": "authorization", "prefix": "Bearer "}}

routeGroups.routes.policies.apiKey.location.header

objectRequired

No description for this field.

routeGroups.routes.policies.apiKey.location.header.name

stringRequired

No description for this field.

routeGroups.routes.policies.apiKey.location.header.prefix

string

No description for this field.

routeGroups.routes.policies.extAuthz

object

Authenticate incoming requests by calling an external authorization server.

routeGroups.routes.policies.extAuthz.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

routeGroups.routes.policies.extAuthz.conditional.service

objectRequired

No description for this field.

routeGroups.routes.policies.extAuthz.conditional.service.name

objectRequired

No description for this field.

routeGroups.routes.policies.extAuthz.conditional.service.name.namespace

stringRequired

No description for this field.

routeGroups.routes.policies.extAuthz.conditional.service.name.hostname

stringRequired

No description for this field.

routeGroups.routes.policies.extAuthz.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

routeGroups.routes.policies.extProc

object

Extend agentgateway with an external processor

routeGroups.routes.policies.extProc.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

routeGroups.routes.policies.extProc.conditional.service

objectRequired

No description for this field.

routeGroups.routes.policies.extProc.conditional.service.name

objectRequired

No description for this field.

routeGroups.routes.policies.extProc.conditional.service.name.namespace

stringRequired

No description for this field.

routeGroups.routes.policies.extProc.conditional.service.name.hostname

stringRequired

No description for this field.

routeGroups.routes.policies.extProc.conditional.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

routeGroups.routes.policies.transformations

object

Modify requests and responses

routeGroups.routes.policies.transformations.conditional

object[]Required

conditional policy entries. An entry without a condition must be the final fallback.

routeGroups.routes.policies.transformations.conditional.condition

string

condition must evaluate to true for this policy to execute. If unset, the policy is the fallback.

Validation

Defaultnull

routeGroups.routes.policies.transformations.conditional.request

object

No description for this field.

routeGroups.routes.policies.transformations.conditional.request.add

object

No description for this field.

Validation

Default{}

routeGroups.routes.policies.transformations.conditional.request.set

object

No description for this field.

Validation

Default{}

routeGroups.routes.policies.transformations.conditional.request.remove

string[]

No description for this field.

Validation

Default[]

routeGroups.routes.policies.transformations.conditional.request.body

string

No description for this field.

Validation

Defaultnull

routeGroups.routes.policies.transformations.conditional.request.metadata

object

No description for this field.

Validation

Default{}

routeGroups.routes.policies.transformations.conditional.response

object

No description for this field.

routeGroups.routes.policies.transformations.conditional.response.add

object

No description for this field.

Validation

Default{}

routeGroups.routes.policies.transformations.conditional.response.set

object

No description for this field.

Validation

Default{}

routeGroups.routes.policies.transformations.conditional.response.remove

string[]

No description for this field.

Validation

Default[]

routeGroups.routes.policies.transformations.conditional.response.body

string

No description for this field.

Validation

Defaultnull

routeGroups.routes.policies.transformations.conditional.response.metadata

object

No description for this field.

Validation

Default{}

routeGroups.routes.policies.csrf

object

Handle CSRF protection by validating request origins against configured allowed origins.

Validation

Defaultnull

routeGroups.routes.policies.csrf.additionalOrigins

string[]

No description for this field.

Validation

Default[]

Unique itemstrue

routeGroups.routes.policies.timeout

object

Timeout requests that exceed the configured duration.

Validation

Defaultnull

routeGroups.routes.policies.timeout.requestTimeout

string

No description for this field.

routeGroups.routes.policies.timeout.backendRequestTimeout

string

No description for this field.

routeGroups.routes.policies.retry

object

Retry matching requests.

Validation

Defaultnull

routeGroups.routes.policies.retry.attempts

integer

No description for this field.

Validation

Default1

Formatuint8

Minimum1

Maximum255

routeGroups.routes.policies.retry.backoff

string

No description for this field.

routeGroups.routes.policies.retry.codes

integer[]Required

No description for this field.

routeGroups.routes.backends

object[]

No description for this field.

routeGroups.routes.backends.service

objectRequired

No description for this field.

routeGroups.routes.backends.service.name

objectRequired

No description for this field.

routeGroups.routes.backends.service.name.namespace

stringRequired

No description for this field.

routeGroups.routes.backends.service.name.hostname

stringRequired

No description for this field.

routeGroups.routes.backends.service.port

integerRequired

No description for this field.

Validation

Formatuint16

Minimum0

Maximum65535

[Schema validation](/docs/standalone/latest/reference/configuration/validation/ 'Schema validation')

Was this page helpful?
