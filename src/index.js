const { DisTube } = require("distube");
const {
  Collection,
  Client,
  Partials,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const fs = require("fs");
const path = require("path");

const config = require("./config.json");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { createPlaySongEmbed } = require("./utils/song");

client.config = config;
const distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});
client.commandArray = [];
client.commands = new Collection();
client.aliases = new Collection();
client.emotes = config.emoji;
client.distube = distube;
client.buttons = new Map();
client.queue = new Map();

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

function importCommands(dir) {
  const commands = {};
  fs.readdirSync(dir).forEach((file) => {
    if (file.endsWith(".js")) {
      const commandName = path.basename(file, ".js");
      commands[commandName] = require(path.join(dir, file));
    }
  });
  return commands;
}

const commands = importCommands(path.join(__dirname, "components/buttons"));
console.log(commands);

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(
      `${client.emotes.error} | You must be in a voice channel!`
    );
  }
  try {
    cmd.run(client, message, args);
  } catch (e) {
    console.error(e);
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``);
  }
});

const notificationAlert = (queue, embeds = [], components = []) => {
  queue.textChannel.send({ embeds, components });
};

const notificationAlert2 = (queue, embeds = []) => {
  queue.textChannel.send({ embeds });
};

const errorsHandling = (channel, e) => {
  const errorMessage = `${client.emotes.error} | An error encountered: ${e
    .toString()
    .slice(0, 1974)}`;
  if (channel instanceof TextChannel) {
    channel.send(errorMessage);
  } else {
    console.error(e);
  }
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;

  const command = commands[`${customId}`]; // Sesuaikan nama file dengan customId
  if (command && command.execute) {
    try {
      await command.execute(client, interaction); // Pass client and interaction
    } catch (error) {
      console.error(`Error executing ${customId}:`, error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  } else {
    console.error(`No command found for custom ID: ${customId}`);
  }
});

client.distube
  .on("playSong", async (queue, song) => {
    try {
      console.log("Playing song:", song.name);
      const oldMessages = await queue.textChannel.messages.fetch({ limit: 1 });
      const oldMessage = oldMessages.first();
      const { playSongEmbed, row } = createPlaySongEmbed(song, queue, client);
      if (oldMessage) {
        await oldMessage.edit({ embeds: [playSongEmbed], components: [row] });
      } else {
        notificationAlert(queue, [playSongEmbed], [row]);
      }
    } catch (e) {
      errorsHandling(queue, e);
    }
  })
  .on("addSong", (queue, song) => {
    console.log("Added song:", song.name);
    const addSongEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(
        `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
      )
      .setTimestamp();
    notificationAlert2(queue, [addSongEmbed]);
  })
  .on("addList", (queue, playlist) => {
    console.log("Added playlist:", playlist.name);
    const addListEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(
        `${client.emotes.success} | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue`
      )
      .setTimestamp();
    notificationAlert2(queue, [addListEmbed]);
  })
  .on("error", (channel, e) => errorsHandling(channel, e))
  .on("empty", (channel) => {
    console.log("Voice channel is empty");
    const emptyEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription("Voice channel is empty! Leaving the channel...")
      .setTimestamp();
    notificationAlert2(channel, [emptyEmbed]);
  })
  .on("searchNoResult", (message, query) => {
    console.log("No search results for:", query);
    const noResultEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription(
        `${client.emotes.error} | No result found for \`${query}\`!`
      )
      .setTimestamp();
    notificationAlert2(message.channel, [noResultEmbed]);
  })
  .on("finish", (queue) => {
    console.log("Finished queue");
    const finishEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription("Finished!")
      .setTimestamp();
    notificationAlert2(queue, [finishEmbed]);
  });

const functionfolders = fs.readdirSync(`./src/functions`);
for (const folder of functionfolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(config.token);
