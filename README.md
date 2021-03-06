## Container Manager Discord Bot

### What

This is a discord bot that dynamically starts or stops a container based on discord commands.

### How?

```shell
git clone --depth 1 https://github.com/the1337guy/container-mgr-discord.git
yarn install
DISCORD_BOT_TOKEN='BOT_TOKEN' DOCKER_CONTAINER_ID='DOCKER_CONTAINER_ID' node index.js
```

```discord
<User> mc start
<Container Manager Discord> @User, Container started.
<User> mc stop
<Container Manager Discord> @User, Container stopped.
```

#### The default prefix is `mc` , it can be changed using the `DISCORD_CMD_PREFIX` env.

[There is an example supervisor program configuration here](docs/example_supervisor.ini)
