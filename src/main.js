import Enemies from "./enemies.js";
import Player from "./player.js";
import Lasers from "./lasers.js";
import TimeHandler from "./time.js";
import PauseMenu from "./pause.js";
import Exp from "./exp.js";
import Items from "./items.js";
import Difficulty from "./difficulty.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" }); // Main game scene key
  }


  preload() {
    this.load.audio("collect", "./resources/collect.mp3");
    this.load.audio("hitmarker", "./resources/hitmarker.mp3");
    this.load.audio("levelup", "./resources/levelUp.mp3");
  }

  create() {

    this.player = new Player(this, 100, 100, 20, 0xffffff); // Create player object
    this.timer = new TimeHandler(this);
    this.expInstance = new Exp(this);

    // Variables for items
    this.followThreshold = 50;
    this.playerSpeed = 200;
    this.fireRate = 600;

    // Arrays to store enemies and lasers
    this.enemyArray = [];
    this.laserArray = [];
    this.bossArray = [];

    //initialize audio
    this.collect = this.sound.add("collect", { volume: 0.5 });
    this.hitmarker = this.sound.add("hitmarker", { volume: 0.9 });
    this.levelUp = this.sound.add("levelup", { volume: 1.0 });

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

    // Start laser firing
    this.restartLaserTimer();
  }

  restartLaserTimer() {
    // Remove existing timer if it exists
    if (this.laserTimer) {
      this.laserTimer.remove();
    }

    // Create a new laser timer with the current fireRate
    this.laserTimer = this.time.addEvent({
      delay: this.fireRate,
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

      //collisions between bosses and enemies
      this.physics.add.collider(this.bossArray, this.enemyArray);

      this.physics.add.collider(this.bossArray, this.player, () => {
        this.timer.reset();
        this.scene.restart();
      });
    });

    this.physics.add.collider(
      this.laserArray,
      this.enemyArray,
      (laser, enemy) => {
        this.hitmarker.play();
        laser.destroy();
        enemy.explode();
        enemy.destroy();
      }
    );

    //boss hit by laser
    this.physics.add.collider(
      this.bossArray,
      this.laserArray,
      (boss, laser) => {
        this.hitmarker.play();
        laser.destroy();
        boss.takeDamage();
      }
    );
  }

  update() {
    this.player.update(this.input.activePointer);

    this.enemyArray.forEach((enemy) => {
      enemy.update(this.player);
    });

    // Update lasers
    if (this.bossArray) {
      this.bossArray.forEach((boss) => boss.update(this.player));
    }

    this.timer.update();

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
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE, // Adjusts the canvas size dynamically
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game canvas
  },
  backgroundColor: "#000000",
  scene: [GameScene, PauseMenu, Items],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

new Phaser.Game(config);
