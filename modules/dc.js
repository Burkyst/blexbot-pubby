const { PubbyModule, QueueModule, PlaybackModule } = require("@pubby/sdk");

/**
 * Recupera a posição de um usuário que desconectou
 * @extends {PubbyModule<{ maxTime: number, clearInterval: number }>}
 */
class DisconnectModule extends PubbyModule {
  /**
   * Aqui são armazenados os usuários desconectados.
   * @type {Map<string, {expires: number, position: number}>}
   */
  users = new Map();
  timer = 0;

  constructor(pubby, options) {
    super(pubby, options);

    // Este módulo precisa do módulo queue e playback para funcionar
    this.pubby.use(QueueModule);
    this.pubby.use(PlaybackModule);
  }

  init() {
    this.users.clear();

    this.pubby.room.on("user-leave", () => console.log("USER LEAVE"));
    this.pubby.queue.on("user-leave", () => console.log("QUEUE LEAVE"));

    this.pubby.room.on("user-leave", (user) => this.register(user));
    this.pubby.playback.on("dj-update", () => this.nextDj());
    this.pubby.commands.add("dc", (message) => this.lookup(message));

    this.timer = setInterval(() => this.clear(), this.options.clearInterval);
  }

  /**
   * Registra o usuário desconectado para que ele possa ser colocado na fila
   * @param {import("@pubby/sdk/types/models/user").User} user
   */
  register(user) {
    console.log(this.pubby.queue.users.slice());
    // Se o usuário não está na fila, não faz nada.
    if (!this.pubby.queue.has(user.id)) return;

    // Pega a posição do usuário na fila e registra no mapa de usuários
    this.users.set(user.id, {
      expires: Date.now() + this.options.maxTime * 1000,
      position: 0,
    });
  }

  /**
   * Reposiciona o usuário na fila
   * @param {import("@pubby/sdk/types/modules/chat/message").PubbyMessage} message
   */
  lookup(message) {
    const state = this.users.get(message.user.id);

    if (!state) {
      message.reply("{user} não tem se desconectado durante meu tempo aqui.");
      return;
    }

    if (this.pubby.queue.has(message.user.id)) {
      message.reply("Você deve entrar na fila antes de usar o comando.");
      return;
    }

    this.pubby.queue.move(message.user.id, state.position + 1);
  }

  /**
   * Atualiza o mapa de usuários quando muda o DJ
   */
  nextDj() {
    this.users.forEach((state, id) => {
      state.position = Math.max(0, state.position - 1);
    });
  }

  /**
   * Remove os usuários que excederam o tempo limite de desconexão
   */
  clear() {
    this.users.forEach((state, id) => {
      if (state.expires <= Date.now()) {
        this.users.delete(id);
      }
    });
  }
}

module.exports = DisconnectModule;
