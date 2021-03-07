const { PubbyModule } = require("@pubby/sdk");


class AutowootModule extends PubbyModule {
  init() {
    this.pubby.playback.on('media-update', () => this.pubby.playback.like())
    this.pubby.room.on('load', () => {
      this.pubby.playback.like()
    })
  }
}

module.exports = AutowootModule;