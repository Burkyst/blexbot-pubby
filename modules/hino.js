const { PubbyModule, PlaybackModule, ChatModule } = require('@pubby/sdk')

const MESSAGES = [
  '@{user} disse: Essa música é tão boa que eu to no chão! para @{dj}.',
  '@{user} disse: Essa música é um arraso, para @{dj}.',
  '@{user} disse: Arrastei a raba no chão ouvindo essa música, para @{dj}.',
  '@{user} disse: Um tiro doeria menos, para @{dj}.',
  '@{user} disse: Que tiro de música, bb para @{dj}.',
  '@{user} disse: Se prepara, vou dançar, preste atenção ham ham :twerk: para @{dj}.',
  '@{user} disse: Arrasou more :sparkling_heart: para @{dj}.',
  '@{user} disse: Essa música é igual a td pra mim! https://imgur.com/Mo34Jh4.gif para @{dj}.',
  '@{user} disse: Anotei essa musica aqui, amore 📝 para @{dj}.',
  '@{user} disse: O problema dessa música é que ela acaba, para @{dj}.',
  '@{user} disse: Hmmm essa música é de dar água na boca 👄 para @{dj}.'
]

class HinoModule extends PubbyModule {
  constructor(pubby, options) {
    super(pubby, options)

    // Este módulo depende de playback e chat
    pubby.use(PlaybackModule)
    pubby.use(ChatModule)
  }

  init() {
    this.pubby.commands.add('hino', (message) => this.hino(message))
  }

  getRandomMessage(username) {
    const dj = this.pubby.playback.dj

    if (!dj) return

    const index = Math.floor(Math.random() * MESSAGES.length)

    return MESSAGES[index]
      .replace(/\{user\}/, username)
      .replace(/\{dj\}/, dj.username)
  }

  hino(message) {
    const msg = this.getRandomMessage(message.user.username)
    this.pubby.chat.send(msg)
  }
}

module.exports = HinoModule
