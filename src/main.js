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
    this.laserSpeed = 300;
    this.enemySpeed = 100;
    this.playerHealth = 0;
    this.explodeIntoLasers = false;
    this.multiShot = false;
    this.expGained = 10; 

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
      maxSize: 250, 
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
    if (this.laserTimer) {
        this.laserTimer.remove();
    }

    this.laserTimer = this.time.addEvent({
        delay: this.fireRate,
        callback: () => {
            if (this.multiShot) {
                // Fire three lasers at 45-degree angles
                console.log("Multishot activated!");
                this.fireMultiShot();
            } else {
                const laser = new Lasers(this, this.player.x, this.player.y, 5, 5, 0xffffff);
                this.laserArray.push(laser);
                laser.fire(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
            }
        },
        loop: true,
    });
}

fireMultiShot() {
    const centerLaser = new Lasers(this, this.player.x, this.player.y, 5, 5, 0xffffff);
    const leftLaser = new Lasers(this, this.player.x, this.player.y, 5, 5, 0xffffff);
    const rightLaser = new Lasers(this, this.player.x, this.player.y, 5, 5, 0xffffff);

    this.laserArray.push(centerLaser, leftLaser, rightLaser);

    // Fire the center laser towards the pointer
    centerLaser.fire(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);

    // Calculate angle offsets
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
    const leftAngle = angle - Phaser.Math.DegToRad(45);
    const rightAngle = angle + Phaser.Math.DegToRad(45);

    // Fire left and right lasers
    leftLaser.body.setVelocity(
        Math.cos(leftAngle) * this.laserSpeed,
        Math.sin(leftAngle) * this.laserSpeed
    );
    rightLaser.body.setVelocity(
        Math.cos(rightAngle) * this.laserSpeed,
        Math.sin(rightAngle) * this.laserSpeed
    );
}


  collisionHandler() {
    this.physics.add.collider(this.enemyArray, this.enemies);

    this.physics.add.collider(this.bossArray, this.bossArray);

    this.physics.add.collider(this.enemyArray, this.bossArray);

    this.physics.add.collider(this.player, this.enemyArray, () => {
      if (this.canTakeDamage == false) return;

      if (this.playerHealth == 0) {
        this.timer.reset();
        this.scene.restart(); // Restart the game scene
      } else {
        this.playerHealth--;
        console.log("Player Health: " + this.playerHealth);
        //delay before player can take damage again

        this.canTakeDamage = false;
        //change color of circle to gray
        this.player.setFillStyle(0x808080);

        this.time.addEvent({
          delay: 1000,
          callback: () => {
            this.canTakeDamage = true;
            //change color of circle back to white
            this.player.setFillStyle(0xffffff);
          },
        });
      }
    });

    this.physics.world.on("worldbounds", (body) => {
      if (body.gameObject instanceof Lasers) {
        body.gameObject.destroy();
      }
    });

    //collisions between bosses and enemies
    this.physics.add.collider(this.bossArray, this.enemyArray);

    this.physics.add.collider(this.bossArray, this.player, () => {
      if (this.canTakeDamage == false) return;

      if (this.playerHealth == 0) {
        this.timer.reset();
        this.scene.restart();
      } else {
        this.playerHealth--;
        console.log("Player Health: " + this.playerHealth);

        this.canTakeDamage = false;
        //change color of circle to gray
        this.player.setFillStyle(0x808080);

        this.time.addEvent({
          delay: 1000,
          callback: () => {
            this.canTakeDamage = true;
            //change color of circle back to white
            this.player.setFillStyle(0xffffff);
          },
        });
      }
    });

    this.physics.add.overlap(
      this.laserArray,
      this.enemyArray,
      (laser, enemy) => {
        this.hitmarker.play();
        laser.destroy();
        enemy.explode();
        enemy.deactivate();
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
        this.timer.pause(); // Pause the timer
        this.scene.launch("PauseMenu");
        this.isPaused = true;
      } else {
        this.scene.resume();
        this.timer.resume(); // Resume the timer
        this.isPaused = false;
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
      fps: 60,
    },
  },
};

new Phaser.Game(config);
