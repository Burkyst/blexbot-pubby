const { PubbyModule, PlaybackModule, CommandsModule } = require("@pubby/sdk");

/**
 * Módulo para ver o histórico de músicas
 * @extends {PubbyModule<{message: string }>}
 */
class HistoryModule extends PubbyModule {
 constructor(pubby, options) {
    super(pubby, options);

    // Este módulo depende de playback e commands
    pubby.use(PlaybackModule);
    pubby.require(CommandsModule);
  }
  
  init() {
    // Cria uma lista
    var historico = [];
    this.pubby.playback.on('media-update', (media) => {
      historico = [media].concat(historico.slice(0, 4))
    });
    // Mandar a lista no chat
    this.pubby.commands.add("h", 
    (message) => {
     const texto = historico.map((media, index) => `${index + 1}. ${media.title}`).join('\n')
     message.reply(`**Histórico de músicas:**\n${texto}`);
    })
  }    
}

module.exports = HistoryModule;