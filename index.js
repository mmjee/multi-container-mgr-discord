/*
  Copyright 2021 Maharshi Mukherjee
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const fs = require('fs')

const Discord = require('discord.js')
const Dockerode = require('dockerode')
const { parse } = require('discord-command-parser')
const json5 = require('json5')

const client = new Discord.Client()
const docker = new Dockerode()

const SnowflakeToContainerMap = new Map()

async function handleStart (container, parsed, msg) {
  try {
    await container.start()
    await msg.reply('Container started.')
  } catch (e) {
    await msg.reply('Errored with message: ```' + e.message + '```')
  }
}

async function handleStop (container, parsed, msg) {
  try {
    await container.stop()
    await msg.reply('Container stopped.')
  } catch (e) {
    await msg.reply('Errored with message: ```' + e.message + '```')
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  const parsed = parse(msg, process.env.DISCORD_CMD_PREFIX || 'mc', { allowSpaceBeforeCommand: true })
  if (!parsed.success) return

  if (!msg.channel && !msg.channel.id) {
    await msg.reply("Don't DM the bot.")
    return
  }
  const container = SnowflakeToContainerMap.get(msg.channel.id)
  if (!container) {
    await msg.reply('No assigned container, use this in authorized channels only.')
    return
  }

  switch (parsed.command) {
    case 'start':
      await handleStart(container, parsed, msg)
      break
    case 'stop':
      await handleStop(container, parsed, msg)
      break
    default:
      await msg.reply('Invalid command. Options are: `start`, `stop`.')
      break
  }
})

async function main () {
  const config = json5.parse((await fs.promises.readFile(process.env.MCMD_CONFIG_PATH || 'config.json5')).toString())
  for (const [k, v] of Object.entries(config)) {
    SnowflakeToContainerMap.set(k, docker.getContainer(v))
  }

  await client.login(process.env.DISCORD_BOT_TOKEN)
}
main().catch(e => console.error(e))
