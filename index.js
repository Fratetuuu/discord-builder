const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionsBitField
} = require("discord.js");

const express = require("express");

// ================= CONFIG =================
const TOKEN = "MTQ5MzEyMjM1MjU0MjkxMjYxMg.G0SIbp.hBln5OMRbZNVJ9mDwo25NASQBbF9N5ATeppv7M";
const CLIENT_ID = "1493122352542912612";

// ================= BOT =================
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================= KEEP ALIVE (RENDER) =================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot online");
});

app.listen(3000, () => {
  console.log("🌐 Keep alive attivo");
});

// ================= SLASH COMMANDS =================
const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Crea server Minecraft community completo"),

  new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Cancella tutti i canali del server")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

// ================= READY =================
client.once("ready", async () => {
  console.log(`Online come ${client.user.tag}`);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log("Slash commands registrati");
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.inGuild()) return;

  const guild = interaction.guild;

  // ================= RESET =================
  if (interaction.commandName === "reset") {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "❌ Non hai permessi", ephemeral: true });
    }

    await interaction.reply("💣 Eliminazione canali...");

    const channels = await guild.channels.fetch();

    for (const channel of channels.values()) {
      try {
        await channel.delete();
      } catch (e) {}
    }

    return interaction.followUp("✅ Server pulito!");
  }

  // ================= SETUP =================
  if (interaction.commandName === "setup") {

    await interaction.reply("🚀 Creazione server...");

    // ===== RUOLI =====
    await guild.roles.create({ name: "👑 Owner", permissions: [PermissionsBitField.Flags.Administrator] });
    await guild.roles.create({ name: "🛡️ Staff" });
    await guild.roles.create({ name: "📣 Media" });

    await guild.roles.create({ name: "⚔️ Ninja" });
    await guild.roles.create({ name: "🏇 Cavaliere" });
    await guild.roles.create({ name: "🗡️ Assassino" });
    await guild.roles.create({ name: "🏹 Arcere" });

    await guild.roles.create({ name: "💎 VIP" });
    await guild.roles.create({ name: "👤 Cittadino" });
    await guild.roles.create({ name: "🤖 Bot" });

    // ===== INFO =====
    const info = await guild.channels.create({ name: "📌・INFO", type: 4 });

    await guild.channels.create({ name: "📜・regole", type: 0, parent: info.id });
    await guild.channels.create({ name: "📢・annunci", type: 0, parent: info.id });
    await guild.channels.create({ name: "📌・info-server", type: 0, parent: info.id });
    await guild.channels.create({ name: "🔗・link-utili", type: 0, parent: info.id });
    await guild.channels.create({ name: "🎯・come-entrare", type: 0, parent: info.id });

    // ===== COMMUNITY =====
    const comm = await guild.channels.create({ name: "💬・COMMUNITY", type: 4 });

    await guild.channels.create({ name: "💬・chat-generale", type: 0, parent: comm.id });
    await guild.channels.create({ name: "😂・memes", type: 0, parent: comm.id });
    await guild.channels.create({ name: "🎮・gaming", type: 0, parent: comm.id });
    await guild.channels.create({ name: "📸・media", type: 0, parent: comm.id });

    // ===== MINECRAFT =====
    const mc = await guild.channels.create({ name: "⛏️・MINECRAFT", type: 4 });

    await guild.channels.create({ name: "🌍・ip-server", type: 0, parent: mc.id });
    await guild.channels.create({ name: "📊・status-server", type: 0, parent: mc.id });
    await guild.channels.create({ name: "💰・economia", type: 0, parent: mc.id });
    await guild.channels.create({ name: "🏆・leaderboard", type: 0, parent: mc.id });

    // ===== RANK AREA =====
    const ranks = await guild.channels.create({ name: "⚔️・RANK AREA", type: 4 });

    await guild.channels.create({ name: "🏹・arciere-chat", type: 0, parent: ranks.id });
    await guild.channels.create({ name: "🗡️・assassino-chat", type: 0, parent: ranks.id });
    await guild.channels.create({ name: "🏇・cavaliere-chat", type: 0, parent: ranks.id });
    await guild.channels.create({ name: "⚔️・ninja-chat", type: 0, parent: ranks.id });
    await guild.channels.create({ name: "💎・vip-lounge", type: 0, parent: ranks.id });

    // ===== STORE =====
    const store = await guild.channels.create({ name: "🛒・STORE", type: 4 });

    await guild.channels.create({ name: "🛍️・shop-info", type: 0, parent: store.id });
    await guild.channels.create({ name: "💳・come-comprare", type: 0, parent: store.id });
    await guild.channels.create({ name: "🎁・offerte", type: 0, parent: store.id });

    // ===== SUPPORTO =====
    const sup = await guild.channels.create({ name: "🎫・SUPPORTO", type: 4 });

    await guild.channels.create({ name: "🎫・apri-ticket", type: 0, parent: sup.id });
    await guild.channels.create({ name: "📩・supporto-info", type: 0, parent: sup.id });

    // ===== STAFF =====
    const staff = await guild.channels.create({ name: "🔒・STAFF AREA", type: 4 });

    await guild.channels.create({ name: "🛡️・staff-chat", type: 0, parent: staff.id });
    await guild.channels.create({ name: "📋・log", type: 0, parent: staff.id });
    await guild.channels.create({ name: "🔍・segnalazioni", type: 0, parent: staff.id });

    await interaction.followUp("✅ Server creato!");
  }
});

client.login(TOKEN);
