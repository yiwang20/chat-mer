import 'dotenv/config.js'

import {
  WechatyBuilder,
  ScanStatus,
  log,
} from 'wechaty'
import qrcodeTerminal from 'qrcode-terminal'

import { Configuration, OpenAIApi } from "openai";
import { addHistory, generatePromote } from './chatHistory.js';

const configuration = new Configuration({
  apiKey: process.argv[2],
});
const openai = new OpenAIApi(configuration);

function onScan(qrcode, status) {
  console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
}

function onLogin(user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg) {
  log.info('StarterBot', msg.toString())
  if (msg.self()) {
    return;
  }

  const room = await msg.room();
  const mentioned = await msg.mentionSelf();
  let input = msg.text();
  if (room) {
    if (!mentioned) {
      return;
    } else {
      input = input.replace("@Chat-Mer", "")
    }
  }

  const from = msg.talker();
  if(from && from.payload && from.payload.name === "微信团队"){
    return;
  }

  const name = room ? room : from;
  const prompt = generatePromote(name, input);

  // log.info('StarterBot-Prompt', prompt)

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: prompt,
    temperature: 0.9,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.2
  });

  if (response.data.choices) {
    // console.log(response.data.choices[0].message.content);
    const botInput = response.data.choices[0].message.content;
    msg.say(botInput);
    addHistory(name, input, botInput)
  }
}

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-padlocal' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-padlocal`)
   *
   * You can use the following providers:
   *  - wechaty-puppet-wechat (no token required)
   *  - wechaty-puppet-padlocal (token required)
   *  - wechaty-puppet-service (token required, see: <https://wechaty.js.org/docs/puppet-services>)
   *  - etc. see: <https://github.com/wechaty/wechaty-puppet/wiki/Directory>
   */
  // puppet: 'wechaty-puppet-wechat',
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start().then(() => log.info('StarterBot', 'Starter Bot Started.')).catch(e => log.error('StarterBot', e))