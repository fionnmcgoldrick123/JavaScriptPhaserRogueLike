import Enemies from "./enemies.js";
import Player from "./player.js";
import Lasers from "./lasers.js";
import TimeHandler from "./time.js";
import PauseMenu from "./pause.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" }); // Main game scene key
  }

  preload() {}

  create() {
    this.player = new Player(this, 100, 100, 20, 0xffffff); // Create player object
    this.timer = new TimeHandler(this);

    // Arrays to store enemies and lasers
    this.enemyArray = [];
    this.laserArray = [];

    // Escape key for pausing
    this.escapeKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.isPaused = false;

    // Physics group for orbs
    this.orbGroup = this.physics.add.group({
      classType: Phaser.GameObjects.Arc,
      runChildUpdate: true,
      maxSize: 1000, // Limit to 1000 orbs
    });

    // Handle collisions
    this.collisionHandler();

    // Spawn enemies periodically
    this.enemySpawn = this.time.addEvent({
      delay: 2000,
      callback: () => Enemies.spawnEnemy(this, this.enemyArray),
      loop: true,
    });

    // Spawn lasers periodically
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

  collisionHandler() {
    this.physics.add.collider(this.enemyArray, this.enemies);

    this.physics.add.collider(this.player, this.enemyArray, () => {
      this.timer.reset();
      this.scene.restart(); // Restart the game scene
    });

    this.physics.world.on("worldbounds", (body) => {
      if (body.gameObject instanceof Lasers) {
        body.gameObject.destroy();
      }
    });

    this.physics.add.collider(
      this.laserArray,
      this.enemyArray,
      (laser, enemy) => {
        laser.destroy();
        enemy.explode();
        enemy.destroy();
      }
    );
  }

  update() {
    this.player.update(this.input.activePointer);

    this.enemyArray.forEach((enemy) => {
      enemy.update(this.player);
    });

    this.timer.update();
    Enemies.orbCollection(this, this.player, this.orbGroup);

    if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      if (!this.isPaused) {
        this.scene.pause();
        this.scene.launch("PauseMenu");
        this.isPaused = true;
      }
    }
  }
}

// Phaser configuration
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  backgroundColor: "#000000",
  scene: [GameScene, PauseMenu],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

new Phaser.Game(config);
