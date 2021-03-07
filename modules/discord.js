const { PubbyModule, PlaybackModule, CommandsModule, QueueModule } = require("@pubby/sdk");
const dayjs = require('dayjs')

class DisconnectModule extends PubbyModule {
  positions = new Map();

  constructor(pubby, options) {
    super(pubby, options);

    // Este módulo depende de playback, commands e queue
    pubby.require(PlaybackModule);
    pubby.require(CommandsModule);
    pubby.require(QueueModule);
  }

  init() {
    // Save position
    this.pubby.room.on("user-leave", (user) => {
      this.positions.set(user.id, {
        position: this.pubby.queue.usersId.indexOf(user.id),
        timestamp: Date.now(),
      });
    });

    // Update position
    this.pubby.playback.on("dj-update", () => {
      this.positions.forEach((val) => {
        if (val.position > 0) val.position--;
      });
    });

    // Clear interval
    this.interval = setInterval(() => {
      this.positions.forEach((val, key) => {
        if (this.isExpired(val)) {
          this.positions.delete(key);
        }
      });
    }, this.options.clearInterval);

    // Put user back in the queue
    this.pubby.commands.add("dc", async (msg) => {
      const { user } = msg;
   
      // Add user to the queue if needed
      if (!this.pubby.queue.has(user.id)) {
        if (this.pubby.playback.isDj(user.id)) {
          return msg.reply("Ops! Você já está reproduzindo.");
        }
        // msg.reply("Entre na fila para usar o comando **DC**");
        // return;
      }

      const backup = this.positions.get(user.id);
      this.positions.delete(user.id);

      // Expired or not in the list
      if (!backup || this.isExpired(backup)) {
        return msg.reply("{user} não tem se desconectado durante meu tempo aqui.");
      }

      // Add user to the queue
      await this.pubby.queue.join(user.id);

      // Only user in the queue
      if (this.pubby.queue.users.length <= 1) {
        return msg.reply("Há só você na fila.")
      }
      
      // Move user back to position
      await this.pubby.queue.move(user.id, backup.position + 1);
      
      // Update other backup positions
      this.positions.forEach((val, _) => {
        if (val.position >= backup.position) {
          val.position++;
        }
      });

      // Move message
      let totalSeconds = dayjs().diff(backup.timestamp, 'seconds');

      let totalMinutes = Math.floor(totalSeconds/60)
      totalSeconds = totalSeconds - (totalMinutes*60)

      let timeMsg = totalMinutes ? `${totalMinutes} minuto(s)` : '';
      if (totalSeconds) timeMsg += ` ${totalSeconds} segundo(s)`;

      msg.reply(`**${user.username}** desconectou-se há **${timeMsg.trim()}** e merece a **${backup.position+1}ª** posição.`);
    });
  }

  isExpired(dto) {
    if (dto.timestamp + (this.options.maxTime * 1000) <= Date.now()) {
      return true;
    }
    return false;
  }

  dispose() {
    clearInterval(this.interval);
  }
}

module.exports = DisconnectModule;
