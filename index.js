/*
  Copyright 2021 the1337guy
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
const Discord = require('discord.js')
const Dockerode = require('dockerode')
const { parse } = require('discord-command-parser')
const util = require('util')

const client = new Discord.Client()

const docker = new Dockerode()

const containerId = process.env.DOCKER_CONTAINER_ID
if (!containerId) {
  console.error('No container ID found in environment. Please enter a container ID in process.env.DOCKER_CONTAINER_ID')
  process.exit(11)
}
const container = docker.getContainer(containerId)
const promisifedStart = util.promisify(container.start.bind(container))
const promisifedStop = util.promisify(container.stop.bind(container))

async function handleStart (parsed, msg) {
  try {
    await promisifedStart()
    await msg.reply('Container started.')
  } catch (e) {
    await msg.reply('Errored with message: ```' + e.message + '```')
  }
}

async function handleStop (parsed, msg) {
  try {
    await promisifedStop()
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
  switch (parsed.command) {
    case 'start':
      await handleStart(parsed, msg)
      break
    case 'stop':
      await handleStop(parsed, msg)
      break
    default:
      await msg.reply('Invalid command. Options are: `start`, `stop`.')
      break
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
