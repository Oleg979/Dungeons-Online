const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(__dirname + "/public"));

/////////////////////////////////////////////////////////////////////////////////////////////

let raids = [];

let users = [];

/////////////////////////////////////////////////////////////////////////////////////////////

const addRaid = raid => raids.push(raid);
const removeRaid = index => raids.splice(index, 1);
const notifyRaidsChanged = () => io.emit("raidsChanged", raids);

/////////////////////////////////////////////////////////////////////////////////////////////
io.on("connection", user => {
  console.log("User connected");

  user.on("addRaid", data => {
    addRaid(data);
    notifyRaidsChanged();
  });

  user.on("getRaids", () => {
    user.emit("raidsChanged", raids);
  });

  user.on("removeRaid", data => {
    removeRaid(data.raidIndex);
    notifyRaidsChanged();
  });

  user.on("joinedRaid", data => {
    raids[data.raidIndex].players.push(data.player);
    notifyRaidsChanged();
  });

  user.on("leftRaid", data => {
    raids[data.raidIndex].players = raids[data.raidIndex].players.filter(
      player => player != data.player
    );
    notifyRaidsChanged();
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server started on port ${port}`));
