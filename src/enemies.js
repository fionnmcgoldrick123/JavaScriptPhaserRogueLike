import Exp from "./exp.js";
import Lasers from "./lasers.js";

export default class Enemies extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, radius, color) {
    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(false);
    this.expInstance = new Exp(this); // Initialize expInstance in the scene
  }

  reactivate(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.body.setVelocity(0);
    this.body.enable = true; // Enable the physics body
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    this.body.setVelocity(0);
    this.body.enable = false; // Disable the physics body
    console.log(`Deactivated enemy at (${this.x}, ${this.y})`);
  }

  update(player) {
    if (!this.active) return;

    const directionX = player.x - this.x;
    const directionY = player.y - this.y;
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    this.body.setVelocity(
      (directionX / distance) * this.scene.enemySpeed,
      (directionY / distance) * this.scene.enemySpeed
    );

    // Pass the scene's expInstance to orbCollection
    Enemies.orbCollection(
      this.scene,
      player,
      this.scene.orbGroup,
      this.scene.expInstance
    );
  }

  static spawnEnemy(scene, enemiesArray) {
    const width = scene.scale.width;
    const height = scene.scale.height;

    // Randomly determine spawn on one of the four screen edges
    const edge = Phaser.Math.Between(1, 4);
    let x, y;

    if (edge === 1) {
      // Top edge
      x = Phaser.Math.Between(0, width);
      y = -10; // Just outside the top edge
    } else if (edge === 2) {
      // Bottom edge
      x = Phaser.Math.Between(0, width);
      y = height + 5; // Just outside the bottom edge
    } else if (edge === 3) {
      // Left edge
      x = -10; // Just outside the left edge
      y = Phaser.Math.Between(0, height);
    } else {
      // Right edge
      x = width + 10; // Just outside the right edge
      y = Phaser.Math.Between(0, height);
    }

    let enemy = enemiesArray.find((e) => !e.active);

    if (enemy) {
      enemy.reactivate(x, y);
      console.log("Reactivated enemy!");
    } else {
      enemy = new Enemies(scene, x, y, 20, 0xff0000);
      enemiesArray.push(enemy);
      console.log("New enemy spawned!");
    }
  }

  explode() {
    const orbCount = 5; // Number of orbs to spawn
  
    for (let i = 0; i < orbCount; i++) {
      if (this.scene.orbGroup.countActive(true) >= this.scene.orbGroup.maxSize) {
        console.log("Orb group at capacity. Adding new orbs to yellow orb.");
        this.scene.consolidateOrbs(); // Add excess orbs to yellow orb
        return; // Stop further orb creation
      }
  
      let orb = this.scene.orbGroup.getFirstDead();
  
      if (!orb) {
        console.log("Creating new orb");
        // Create a new orb if none are available
        orb = this.scene.add.circle(this.x, this.y, 3, 0x00ffff); // Create a new circle
        this.scene.orbGroup.add(orb); // Add to the group
        this.scene.physics.add.existing(orb); // Add physics body
        orb.body.setCollideWorldBounds(true); // Keep orbs within bounds
        orb.body.setBounce(1); // Make the orbs bounce

        orb.lock = false; // Initialize lock state
        orb.canBeCollected = false; // Initialize collectibility
      } else {
        // Reuse the existing inactive orb
        orb.setPosition(this.x, this.y);
        console.log("Reusing orb");
      }

      // Reactivate and reset the orb
      orb.setActive(true);
      orb.setVisible(true);
      orb.lock = false; // Reset lock state
      orb.canBeCollected = false; // Reset collectibility

      // Add a delay before the orb can be collected
      this.scene.time.delayedCall(1000, () => {
        orb.canBeCollected = true;
      });

      // Set random velocity
      orb.body.setVelocity(
        Phaser.Math.Between(-30, 30), // Random horizontal velocity
        Phaser.Math.Between(-30, 30) // Random vertical velocity
      );
    }

    // Handle the "explode into lasers" logic if enabled
    if (this.scene.explodeIntoLasers) {
      const laserCount = 8; // Number of lasers to spawn
      const angleStep = (2 * Math.PI) / laserCount; // Divide the circle into equal angles

      for (let i = 0; i < laserCount; i++) {
        const angle = i * angleStep; // Calculate the angle for this laser

        // Create a new laser at the enemy's position
        const laser = new Lasers(this.scene, this.x, this.y, 5, 5, 0xffffff); // Adjust size/color
        this.scene.laserArray.push(laser);

        // Set laser velocity based on the angle
        laser.body.setVelocity(
          Math.cos(angle) * this.scene.laserSpeed,
          Math.sin(angle) * this.scene.laserSpeed
        );
      }
    }
  }
  

  static orbCollection(scene, player, orbGroup, expInstance) {
    const collectThreshold = 10; // Distance threshold for orb collection

    if (!expInstance) {
      console.error(
        "expInstance is undefined! Ensure it is properly initialized."
      );
      return;
    }

    orbGroup.getChildren().forEach((orb) => {
      if (!orb.active || !orb.body) return;

      orb.setDepth(-1);

      const distance = Phaser.Math.Distance.Between(
        orb.x,
        orb.y,
        player.x,
        player.y
      );

      if (!orb.canBeCollected) return;

      // Lock the orb to the player if within followThreshold
      if (distance < scene.followThreshold) {
        orb.lock = true;
      }

      // Make locked orbs follow the player
      if (orb.lock) {
        const directionX = player.x - orb.x;
        const directionY = player.y - orb.y;

        const speed = 180;
        const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

        orb.body.setVelocity(
          (directionX / magnitude) * speed,
          (directionY / magnitude) * speed
        );
      }

      // Collect the orb if within collectThreshold
      if (distance < collectThreshold) {
        orb.setActive(false);
        orb.setVisible(false);
        orb.body.stop();
        orb.lock = false;
        orb.canBeCollected = false;
        scene.collect.play();
        expInstance.handleExp();
        console.log("Orb collected");
      }
    });
  }

  
}