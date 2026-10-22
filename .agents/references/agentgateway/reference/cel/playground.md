# CEL playground

Try out CEL expressions interactively in the agentgateway admin UI.

You can try out CEL expressions directly in the built-in CEL playground in the agentgateway admin
UI. The playground uses agentgateway’s actual CEL runtime, so custom functions and variables
specific to agentgateway are available for testing.

To open the playground:

1. Run agentgateway.

   ```
   agentgateway -f config.yaml
   ```

2. Open the [CEL playground](http://localhost:15000/ui/cel/).
3. In the **Expression** box, enter the CEL expression that you want to test.
4. In the **Request Context YAML** box, edit the sample request context that the CEL expression is
   evaluated against.
5. To test your CEL expression, click **Evaluate**. The **Result** card shows the value returned by the
   CEL evaluation.

![](/img/cel-playground.png)

![](/img/cel-playground-dark.png)

[CEL in YAML and example expressions](/docs/standalone/latest/reference/cel/yaml-and-examples/ 'CEL in YAML and example expressions')

Was this page helpful?
