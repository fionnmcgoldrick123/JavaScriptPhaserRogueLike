import Enemies from "./enemies.js";
import Player from "./player.js"; 
import Lasers from "./lasers.js";
import TimeHandler from "./time.js";

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
  this.timer = new TimeHandler(this);

  //array to store enemies
  this.enemyArray = [];
  this.laserArray = [];


  //method that handles all collisions
  collisionHandler(this);

  // Spawn enemies periodically
  this.enemySpawn = this.time.addEvent({
    delay: 2000, 
    callback: () => Enemies.spawnEnemy(this, this.enemyArray),
    loop: true,
  });


   this.time.addEvent({
    delay: 600, 
    callback: () => {
      const laser = new Lasers(this, this.player.x, this.player.y, 5, 5, 0xffffff);
      this.laserArray.push(laser);
      // Fire the laser toward the mouse pointer
      laser.fire(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
    },
    loop: true,
  });
}

function collisionHandler(scene){
  //adding collision between enemies in the array
  scene.physics.add.collider(scene.enemyArray, scene.enemies);

  scene.physics.add.collider(scene.player, scene.enemyArray, () => {
    // Restart the game if player collides with an enemy
    scene.timer.reset();
    scene.scene.restart();
  });

  // Add collision between lasers and world edge
  scene.physics.world.on("worldbounds", (body) => {
    if (body.gameObject instanceof Lasers) {
      body.gameObject.destroy();
      console.log("laser fallen"); //debugging
    }
  });

  scene.physics.add.collider(scene.laserArray, scene.enemyArray, (laser, enemy) => {
    // Destroy the laser and the enemy if they collide
    laser.destroy();
    enemy.destroy();
  });
}

function update() {
  // Call the player's update method with the active pointer (mouse position)
  this.player.update(this.input.activePointer);
  
  // Call the update method for each enemy
  this.enemyArray.forEach((enemy) => {
    enemy.update(this.player);
  });

   this.timer.update();
    

}

