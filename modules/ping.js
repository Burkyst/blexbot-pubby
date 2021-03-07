const { PubbyModule } = require("@pubby/sdk");

/**
 * Este módulo adiciona o comando !ping e responde a mensagem com !pong
 */
class PingModule extends PubbyModule {
  init() {
    this.pubby.commands.add("ping", (message) => message.reply("Pong!"));
  }
}

module.exports = PingModule;
