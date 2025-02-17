import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";


const fortniteId = "432980957394370572";
const brotherId = "302890346365583361";
let isFortnite = (activity) => activity.applicationId == fortniteId;
let fortniteActivity = undefined;
let lastSeenEpoch = undefined
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
  ],
});

// Exported getters
export const isPlayingFortnite = () => Boolean(fortniteActivity) && fortniteActivity.details;
export function getLobbyDetails() {
  if (!isPlayingFortnite() || !fortniteActivity.details) {
    return undefined;
  }
  return fortniteActivity.details.split(" - ")[1];
}

export function getLobbyState() {
  if (!isPlayingFortnite() || !fortniteActivity.state) {
    return undefined;
  }
  return fortniteActivity.state;
}

export function isCustomGame() {
  return !getLobbyState() && getLobbyDetails() && getLobbyDetails().endsWith("Remaining");
}

export function getTimeSinceLastSeen() {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - lastSeenEpoch) / 1000);
  const units = [
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 }
  ];

  for (const unit of units) {
      const value = Math.floor(diffInSeconds / unit.seconds);
      if (value >= 1) {
          return `${value} ${unit.label}${value > 1 ? "s" : ""}`;
      }
  }
  return `${diffInSeconds} seconds`;
}

// Discord events
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (newPresence.userId != brotherId) {
    return;
  }
  fortniteActivity = newPresence.activities.find(isFortnite);
  console.log("FORTNITE:", fortniteActivity);
  if (fortniteActivity && getLobbyDetails()) {
    lastSeenEpoch = fortniteActivity.createdTimestamp;
  }
});

client.login(process.env.DISCORD_TOKEN);
