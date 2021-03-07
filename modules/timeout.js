const { PubbyModule } = require("@pubby/sdk")

/**
 * Módulo para limitar o tempo da música
 * @extends {PubbyModule<{message: string; messageSkip: string; max: number;}>}
 */
class TimeoutModule extends PubbyModule {
  constructor(pubby, options) {
    super(pubby, options)
    this.pubby.timeout = this;
  }

  sendTemplate(msg) {
    return this.pubby.chat.send(
      msg.replace(/\{user\}/gim, `@${this.pubby.playback.dj.username}`)
    );
  }

  init() {
    this.pubby.playback.on("media-update", ({ media }) => {
      clearInterval(this.timer);

      if (media.duration && media.duration <= this.options.max) {
        return;
      }

      this.sendTemplate(this.options.message);

      this.timer = setTimeout(() => {
        this.sendTemplate(this.options.messageSkip);
        this.pubby.playback.skip();
      }, this.options.max * 1000);
    });
  }
}

module.exports = TimeoutModule