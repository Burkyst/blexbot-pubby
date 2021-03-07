const { Pubby, AuthModule, RoomModule, CommandsModule } = require("@pubby/sdk");
const { auth, room, commands, disconnect } = require("./config.json");
const HinoModule = require('./modules/hino');
const HistoryModule = require('./modules/history');
const TimeoutModule = require('./modules/timeout');
const DiscordModule = require('./modules/discord');
const WelcomeModule = require('./modules/welcome');
const AutowootModule = require('./modules/autowoot');

new Pubby()
  .use(AuthModule, auth)
  .use(RoomModule)
  .use(CommandsModule, commands)
  .use(HinoModule)
  .use(HistoryModule)
  .use(DiscordModule)
  .use(AutowootModule)
  .use(TimeoutModule, {
    max: 7 * 60, // Tempo máximo em segundos 10 * 60 = 10 minutos,
    message: "{user}, o tempo máximo é de 7 minutos, após esse tempo irei pular.",
    messageSkip: "{user}, limite de 7 minutos excedido. Pulando...",
  })
  .use(WelcomeModule)
  .init()
  .then((bot) => bot.room.join('blex'))
