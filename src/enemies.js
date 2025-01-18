import Exp from "./exp.js";
import Lasers from "./lasers.js";

export default class Enemies extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, radius, color) {
    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.expInstance = new Exp(this); // Initialize expInstance in the scene
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
      y = -20; // Just outside the top edge
    } else if (edge === 2) {
      // Bottom edge
      x = Phaser.Math.Between(0, width);
      y = height + 20; // Just outside the bottom edge
    } else if (edge === 3) {
      // Left edge
      x = -20; // Just outside the left edge
      y = Phaser.Math.Between(0, height);
    } else {
      // Right edge
      x = width + 20; // Just outside the right edge
      y = Phaser.Math.Between(0, height);
    }

    // Create a new enemy and add it to the array
    const enemy = new Enemies(scene, x, y, 20, 0xff0000);
    enemiesArray.push(enemy);
  }

  explode() {
    const orbCount = 5; // Number of orbs to spawn

    for (let i = 0; i < orbCount; i++) {
      // Create an orb at the enemy's position
      const orb = this.scene.orbGroup.get(); // Retrieve an orb from the group

      if (!orb) {
        console.log("No available orbs to retrieve!");
        return; // Skip this iteration if no orb is available
      }

      // Ensure physics is added to the orb
      if (!orb.body) {
        this.scene.physics.add.existing(orb); // Add physics body if missing
      }

      // Initialize the orb as a dynamic circle
      orb.setPosition(this.x, this.y); // Set orb position to enemy's position
      orb.setFillStyle(0x00ffff, 1); // Cyan color
      orb.setRadius(3); // Orb size
      orb.setActive(true);
      orb.setVisible(true);

      // Enable physics and set random velocities
      this.scene.physics.add.existing(orb);
      orb.body.setVelocity(
        Phaser.Math.Between(-30, 30), // Random horizontal velocity
        Phaser.Math.Between(-30, 30) // Random vertical velocity
      );
      orb.body.setBounce(1); // Make the orbs bounce
      orb.body.setCollideWorldBounds(true); // Ensure orbs stay within bounds
    }

    // If the explodeIntoLasers effect is active, spawn lasers
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

      // Initialize properties for the orb if undefined
      if (orb.lock === undefined) {
        orb.lock = false; // Each orb tracks if it's locked to the player
      }

      if (orb.canBeCollected === undefined) {
        orb.canBeCollected = false;
        scene.time.delayedCall(1000, () => {
          orb.canBeCollected = true;
        });
      }

      const distance = Phaser.Math.Distance.Between(
        orb.x,
        orb.y,
        player.x,
        player.y
      );

      // Lock the orb to the player if within followThreshold
      if (distance < scene.followThreshold && orb.canBeCollected) {
        orb.lock = true; // Lock this orb to the player
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
      if (distance < collectThreshold && orb.canBeCollected) {
        orb.destroy();
        orb.lock = false; // Reset lock state
        //play collect sound from main
        scene.collect.play();
        console.log("Orb collected!");
        expInstance.handleExp(); // Call handleExp on the expInstance
      }
    });
  }
}
