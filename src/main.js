import Enemies from "./enemies.js";
import Player from "./player.js"; 
import Lasers from "./lasers.js";

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

  //array to store enemies
  this.enemyArray = [];
  this.lasers = this.physics.add.group(); // Create a group for the lasers

  //adding collision between enemies in the array
  this.physics.add.collider(this.enemyArray, this.enemies);

  this.physics.add.collider(this.player, this.enemyArray, () => {
    // Restart the game if player collides with an enemy
    this.scene.restart();
  });

  this.physics.add.collider(this.lasers, this.enemyArray, (laser, enemy) => {
    // Destroy the laser and the enemy if they collide
    laser.destroy();
    enemy.destroy();
  });


  // Spawn enemies periodically
  this.time.addEvent({
    delay: 2000, // Spawn every 2 seconds
    callback: () => Enemies.spawnEnemy(this, this.enemyArray),
    loop: true,
  });

   // Automatically fire lasers every 0.2 seconds
   this.time.addEvent({
    delay: 600, // Fire every 0.2 seconds
    callback: () => {
      const laser = new Lasers(this, this.player.x, this.player.y, 5, 5, 0xffffff);
      this.lasers.add(laser);

      // Fire the laser toward the mouse pointer
      laser.fire(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
    },
    loop: true,
  });
}

function update() {
  // Call the player's update method with the active pointer (mouse position)
  this.player.update(this.input.activePointer);
  
  // Call the update method for each enemy
  this.enemyArray.forEach((enemy) => {
    enemy.update(this.player);
  });
}
