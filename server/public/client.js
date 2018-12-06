let socket = io();

let vm = new Vue({
  el: "#game",
  /////////////////////////////////////////////////////////////////////////////////////////////
  data: {
    userName: null,
    raids: [],
    raidTitle: "",
    raidSize: 2,
    joinedRaid: null
  },
  /////////////////////////////////////////////////////////////////////////////////////////////
  methods: {
    addRaid: function() {
      socket.emit("addRaid", {
        title: this.raidTitle,
        size: +this.raidSize,
        status: "waiting",
        creator: this.userName,
        players: [this.userName]
      });
      this.raidTitle = "";
      this.raidSize = 2;
    },
    joinRaid: function(index) {
      if (this.joinedRaid != null) this.leaveRaid(this.joinedRaid);
      this.joinedRaid = index;
      socket.emit("joinedRaid", { raidIndex: index, player: this.userName });
    },
    leaveRaid: function(index) {
      this.joinedRaid = null;
      socket.emit("leftRaid", { raidIndex: index, player: this.userName });
    },
    removeRaid: function(index) {
      socket.emit("removeRaid", { raidIndex: index });
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////////
  created: function() {
    this.userName = `User #${Date.now()}`;
    socket.emit("getRaids");
    socket.on("raidsChanged", raids => {
      this.raids = raids;
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////
});
