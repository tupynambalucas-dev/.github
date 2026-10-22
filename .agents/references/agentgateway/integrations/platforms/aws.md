# AWS

Deploy agentgateway on Amazon Web Services

Run agentgateway on AWS to leverage Amazon Bedrock, ECS/EKS, and other AWS services.

## Deployment options

### Amazon ECS

Run agentgateway as an ECS service with Fargate or EC2.

```
{
  "family": "agentgateway",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "agentgateway",
      "image": "cr.agentgateway.dev/agentgateway:latest",
      "portMappings": [
        {"containerPort": 3000, "protocol": "tcp"}
      ],
      "environment": [
        {"name": "ADMIN_ADDR", "value": "0.0.0.0:15000"}
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:openai-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/agentgateway",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "agentgateway"
        }
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024"
}
```

### Amazon EKS

For EKS deployments, use [Agentgateway on Kubernetes](https://agentgateway.dev/docs/kubernetes/)
which provides native Kubernetes Gateway API support, dynamic configuration, and MCP service
discovery.

[Deploy on EKS](https://agentgateway.dev/docs/kubernetes/)

## AWS integrations

| Integration                                                    | Purpose                                |
| -------------------------------------------------------------- | -------------------------------------- |
| [Amazon Bedrock](../../llm/providers/bedrock.md)               | Access Claude, Llama, and other models |
| [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) | Secure API key storage                 |
| AWS ALB                                                        | Load balancing with SSL termination    |
| CloudWatch                                                     | Logs and metrics                       |
| X-Ray                                                          | Distributed tracing                    |

## IAM permissions

Create an IAM role for agentgateway with these permissions:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*:*:model/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:llm-*"
    }
  ]
}
```

## Learn more

- [Amazon Bedrock Provider](../../llm/providers/bedrock.md)
- [AWS Secrets Manager Integration](https://aws.amazon.com/secrets-manager/)
- [Deployment Guide](../../deployment/index.md)

[Docker](/docs/standalone/latest/integrations/platforms/docker/ 'Docker')[Google Cloud](/docs/standalone/latest/integrations/platforms/gcp/ 'Google Cloud')

Was this page helpful?
