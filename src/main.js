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

function preload() {}

function create() {
  this.player = new Player(this, 100, 100, 20, 0xffffff); // Create player object
  this.timer = new TimeHandler(this);

  //array to store enemies
  this.enemyArray = [];
  this.laserArray = [];

  // Create a physics group for orbs
  this.orbGroup = this.physics.add.group({
    classType: Phaser.GameObjects.Arc, // Dynamic circles for orbs
    runChildUpdate: true,
    maxSize: 1000, // Limit to 1000 orbs
  });

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
      const laser = new Lasers(
        this,
        this.player.x,
        this.player.y,
        5,
        5,
        0xffffff
      );
      this.laserArray.push(laser);
      // Fire the laser toward the mouse pointer
      laser.fire(
        this.player.x,
        this.player.y,
        this.input.activePointer.x,
        this.input.activePointer.y
      );
    },
    loop: true,
  });
}

function collisionHandler(scene) {
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

  scene.physics.add.collider(
    scene.laserArray,
    scene.enemyArray,
    (laser, enemy) => {
      // Destroy the laser and the enemy if they collide
      laser.destroy();
      enemy.explode();
      enemy.destroy();
    }
  );
}

function update() {
  // Call the player's update method with the active pointer (mouse position)
  this.player.update(this.input.activePointer);

  // Call the update method for each enemy
  this.enemyArray.forEach((enemy) => {
    enemy.update(this.player);
  });

  this.timer.update();

  orbCollection.call(this);
}

function orbCollection() {
  const followThreshold = 100; // Distance threshold for orbs to follow the player
  const collectThreshold = 10; // Distance threshold for orb collection

  this.orbGroup.getChildren().forEach((orb) => {
    if (!orb.active) return; // Skip inactive orbs

    const distance = Phaser.Math.Distance.Between(
      orb.x,
      orb.y,
      this.player.x,
      this.player.y
    );

    if (distance < followThreshold) {
      const directionX = this.player.x - orb.x;
      const directionY = this.player.y - orb.y;

      const speed = 100; // Orb follow speed
      const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

      orb.body.setVelocity(
        (directionX / magnitude) * speed,
        (directionY / magnitude) * speed
      );
    }

    if (distance < collectThreshold) {
      orb.destroy(); // Destroy the orb upon collection
      console.log("Orb collected!");
      this.playerScore = (this.playerScore || 0) + 10; // Example score logic
      console.log(`Score: ${this.playerScore}`);
    }
  });
}
