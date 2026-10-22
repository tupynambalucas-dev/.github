# CEL expressions

Use CEL (Common Expression Language) to write request-aware policies, transformations, and
observability rules.

Agentgateway uses the CEL**CEL (Common Expression Language)**A simple expression language used
throughout agentgateway to enable flexible configuration. CEL expressions can access request
context, JWT claims, and other variables to make dynamic decisions. expression language throughout
the project to enable flexibility. CEL allows writing simple expressions based on the request
context that evaluate to some result.

This section covers everything you need to write and debug CEL expressions in agentgateway: the
in-product playground, how to embed expressions in YAML, common example patterns, and the variables
that are exposed at each policy phase.

[CEL playground

Try out CEL expressions interactively in the agentgateway admin UI.](playground.md)[CEL in YAML and example expressions

How to embed CEL expressions in YAML configuration, plus worked examples for common use cases.](yaml-and-examples.md)[Variables and functions

How CEL variables are populated per policy phase, and where to find the full context reference and …](variables.md)[CEL reference

The CEL expression context provides the following objects, which you can use in CEL expressions …](cel-context.md)[CEL reference explorer

Explore the CEL expression context interactively, including all available variables and their nested
…](cel-context-interactive.md)

[Configuration reference](/docs/standalone/latest/reference/configuration/ 'Configuration reference')

Was this page helpful?
