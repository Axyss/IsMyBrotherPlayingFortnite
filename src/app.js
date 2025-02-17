import * as discord from "./discord-observer.js";
import { fileURLToPath } from 'url';
import path from 'path';
import exphbs from "express-handlebars";
import express from "express";


// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 7000;
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "..", "views"));

// Static resources
app.use("/particles.js", express.static(path.join(__dirname, "..", "node_modules/particles.js/particles.js"), {
  //maxAge: "1w"
}));
app.use("/public", express.static(path.join(__dirname, "..", "public"), {
  //maxAge: "1w"
}));

// Endpoints
app.get("/", (_, res) => {
  console.log(discord.isCustomGame());
  res.render('home', {
    layout: false, 
    skinNumber: parseInt(Math.random() * (5 - 1) + 1), 
    isPlayingFortnite: discord.isPlayingFortnite(),
    isCustomMode: discord.isCustomGame(),
    lobbyState: discord.getLobbyState(),
    lobbyDetails: discord.getLobbyDetails(),
    timeSinceLastSeen: discord.getTimeSinceLastSeen()
  });
})

// Listeners
app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

