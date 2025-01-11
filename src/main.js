import Player from "./player.js"; // Import Player class from player.js

const config = {
  type: Phaser.AUTO, // Automatically choose WebGL or Canvas
  width: 1920,
  height: 1080,
  backgroundColor: "#000000",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // No gravity in this game
      debug: false, // Set to true to view physics boxes
    },
  },
};

const game = new Phaser.Game(config); // Create Phaser game instance

function preload() {
  
}

function create() {
  this.player = new Player(this, 100, 100, 20, 0xffffff); // Create player object
}

function update() {
  // Call the player's update method with the active pointer (mouse position)
  this.player.update(this.input.activePointer);
}
