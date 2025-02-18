import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";
import "dotenv/config";


const fortniteId = "432980957394370572";
const brotherId = "302890346365583361";
let isFortnite = (activity) => activity.applicationId == fortniteId;
let fortniteActivity = undefined;
let lastSeenEpoch = undefined;
export let fortniteLevel = 1;

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
  if (!lastSeenEpoch) return undefined;
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

async function getFortniteLevel() {
  try {
    const response = await axios.get("https://fortnite-api.com/v2/stats/br/v2/d1b9a96439154b22b1b74c51e59519d8", {
      headers: {
        Authorization: process.env.FORTNITE_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data.battlePass.level;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Discord events
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  fortniteLevel = await getFortniteLevel();
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (newPresence.userId != brotherId) {
    return;
  }
  fortniteActivity = newPresence.activities.find(isFortnite);
  if (fortniteActivity && getLobbyDetails()) {
    console.log(fortniteActivity);
    lastSeenEpoch = fortniteActivity.createdTimestamp;
    fortniteLevel = await getFortniteLevel();
  }
});

client.login(process.env.DISCORD_TOKEN);
