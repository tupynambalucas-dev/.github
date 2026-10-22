# Deploy with Docker

Overview of how to deploy agentgateway with Docker.

To run agentgateway as a Docker container, agentgateway publishes official Docker images at
`cr.agentgateway.dev/agentgateway`.

## Docker

To run agentgateway with Docker, you may either mount your [configuration
file](../configuration/index.md) directly, or mount a directory and create the
configuration in the UI:

```
mkdir agentgateway-config
docker run \
  --user "$(id -u):$(id -g)" \
  -v "$PWD/agentgateway-config:/config" \
  -p 4000:4000 \
  cr.agentgateway.dev/agentgateway:v1.4.1
```

When run in this mode, a configuration file will automatically be created, setting up logging and
exposing the admin UI. The `user` is customized to run as the current user to ensure the container
can read and write the configuration.

If you want to provide an explicit file, you can also do so:

```
docker run \
  --user "$(id -u):$(id -g)" \
  -v "$PWD/config.yaml:/config.yaml" \
  -p 4000:4000 \
  cr.agentgateway.dev/agentgateway:v1.4.1 \
  -f /config.yaml
```

Open <http://localhost:4000/ui> to get started!

## Docker Compose

To run agentgateway in Docker Compose, follow the same approach as above. Create a directory for the
configuration and start the service.

```
mkdir agentgateway-config
docker compose up
```

```
services:
  agentgateway:
    container_name: agentgateway
    restart: unless-stopped
    image: cr.agentgateway.dev/agentgateway:v1.4.1
    # Replace with your user and group IDs, such as the output of: id -u && id -g
    user: "1000:1000"
    ports:
      - "4000:4000"
    volumes:
      - ./agentgateway-config:/config
```

Open <http://localhost:4000/ui> to get started!

[Deploy the binary](/docs/standalone/latest/deployment/binary/ 'Deploy the binary')[Deploy with Helm](/docs/standalone/latest/deployment/helm/ 'Deploy with Helm')

Was this page helpful?
