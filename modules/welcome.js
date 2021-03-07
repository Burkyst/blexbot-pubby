const { PubbyModule } = require("@pubby/sdk");

/**
 * Este módulo exibe uma mensagem de boas vindas
 * @extends {PubbyModule<{ message: string }>}
 */
class WelcomeModule extends PubbyModule {
  init() {
    this.pubby.chat.send(`Olá, everyone!`);
    this.pubby.room.on("user-join", (user) =>
      this.pubby.chat.send(`**♥ Bem-vindo(a),** @${user.username}; 
**Tema:** 1001 Discos p/ ouvir antes morrer;
**Tempo limite:** 7 min.`)
    );
  }
}

module.exports = WelcomeModule;
