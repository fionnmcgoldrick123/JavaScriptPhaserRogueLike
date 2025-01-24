export default class Boss extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, radius, color, maxHealth) {
    if (!scene) {
      throw new Error("Scene is required to create a Boss instance.");
    }

    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true); // Prevent boss from leaving the screen
    this.body.setImmovable(false);
    this.scene = scene; // Store the scene for later use
    this.health = maxHealth; // Initialize health
    this.maxHealth = maxHealth; // Store max health for reference
    this.isDefeated = false; // Boss is not defeated initially

    // Add boss HP text inside the circle
    this.hpText = this.scene.add
      .text( {
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5); 
  }

  update(player) {
    if (!this.active || this.isDefeated) return;

    // Follow player
    const directionX = player.x - this.x;
    const directionY = player.y - this.y;
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
    const speed = 80; // Slightly slower than regular enemies for balance

    // Move the boss towards the player
    this.body.setVelocity(
      (directionX / distance) * speed,
      (directionY / distance) * speed
    );

    // Update HP text position
    this.hpText.setPosition(this.x, this.y);
  }

  takeDamage(amount = 1) {
    this.health -= amount; // Reduce boss health

    // Update HP text
    this.hpText.setText(`${this.health}`);

    // Check if the boss is defeated
    if (this.health <= 0) {
      this.defeat();
    }
  }

  defeat() {
    this.isDefeated = true;

    // Add explosion effect or animation if desired
    this.explode();

    // Destroy the boss and HP text
    this.hpText.destroy();
    this.destroy();
  }

  explode() {
    const orbCount = 30; // Number of orbs to spawn

    for (let i = 0; i < orbCount; i++) {

      if (this.scene.orbGroup.countActive(true) >= this.scene.orbGroup.maxSize) {
        return; // Skip spawning more orbs
      }

        let orb = this.scene.orbGroup.getFirstDead(); // Retrieve an inactive orb

        if (!orb) {
            // Create a new orb if none are available
            orb = this.scene.add.circle(this.x, this.y, 3, 0x00ffff);
            this.scene.orbGroup.add(orb); // Add to orb group
            this.scene.physics.add.existing(orb); // Add physics body
            orb.body.setCollideWorldBounds(true);
            orb.body.setBounce(1);

            // Initialize custom properties
            orb.lock = false;
            orb.canBeCollected = false;
        } else {
            // Reuse the existing inactive orb
            orb.setPosition(this.x, this.y);
        }

        // Reactivate and reset state
        orb.setActive(true);
        orb.setVisible(true);
        orb.lock = false; // Reset lock state
        orb.canBeCollected = false; // Reset collectibility

        // Ensure delayed collectibility
        this.scene.time.delayedCall(1000, () => {
            orb.canBeCollected = true;
        });

        // Reset physics and set random velocity
        orb.body.reset(this.x, this.y); // Reset physics body position
        orb.body.setVelocity(
            Phaser.Math.Between(-100, 100), // Random horizontal velocity
            Phaser.Math.Between(-100, 100) // Random vertical velocity
        );
    }
}


  spawnBoss(currentHp) {
    const { width, height } = this.scene.scale;

    // Randomly determine spawn location in one of the corners
    const corner = Phaser.Math.Between(1, 4);
    let x, y;

    switch (corner) {
      case 1: // Top-left corner
        x = -100;
        y = -100;
        break;
      case 2: // Top-right corner
        x = width + 100;
        y = -100;
        break;
      case 3: // Bottom-left corner
        x = -100;
        y = height + 100;
        break;
      case 4: // Bottom-right corner
        x = width + 100;
        y = height + 100;
        break;
    }

    const boss = new Boss(this.scene, x, y, 60, 0xff0000, currentHp); // Adjust radius and health as needed
    this.scene.bossArray.push(boss);
  }
}