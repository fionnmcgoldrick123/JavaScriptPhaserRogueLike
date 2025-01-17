export default class Boss extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, radius, color, maxHealth = 10) {
    if (!scene) {
      throw new Error("Scene is required to create a Boss instance.");
    }

    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true); // Prevent boss from leaving the screen
    this.scene = scene; // Store the scene for later use
    this.health = maxHealth; // Initialize health
    this.maxHealth = maxHealth; // Store max health for reference
    this.isDefeated = false; // Boss is not defeated initially

    // Store initial width for consistent scaling
    this.initialHealthBarWidth = radius * 2; // Match boss's diameter

    // Health bar setup
    this.healthBar = scene.add
      .rectangle(
        this.x, // Center horizontally
        this.y - radius - 20, // Position directly above the boss
        this.initialHealthBarWidth, // Initial width of the health bar
        10, // Fixed height
        0xff0000 // Initial color (red)
      )
      .setOrigin(0.5, 0.5); // Center the bar on its origin
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

    // Update health bar position to remain above the boss
    this.healthBar.setPosition(this.x, this.y - this.displayHeight / 2 - 20);
  }

  takeDamage(amount = 1) {
    this.health -= amount; // Reduce boss health
    console.log(`Boss Health: ${this.health}`);

    // Calculate health percentage
    const healthPercentage = Math.max(0, this.health / this.maxHealth);

    // Smoothly scale the health bar's width
    this.healthBar.width = this.initialHealthBarWidth * healthPercentage;

    // Update health bar color
    this.healthBar.fillColor = healthPercentage > 0.5 ? 0x00ff00 : 0xffa500; // Green if > 50%, orange otherwise

    // Check if the boss is defeated
    if (this.health <= 0) {
      this.defeat();
    }
  }

  defeat() {
    this.isDefeated = true;
    console.log("Boss defeated!");

    // Add explosion effect or animation if desired
    this.explode();

    // Destroy the boss and health bar
    this.healthBar.destroy();
    this.destroy();
  }

  explode() {
    const orbCount = 15; // Number of orbs to spawn
    for (let i = 0; i < orbCount; i++) {
      const orb = this.scene.orbGroup.get();
      if (!orb) continue; // Skip if no orb is available

      orb.setPosition(this.x, this.y);
      orb.setFillStyle(0x00ffff, 1); // Cyan color
      orb.setRadius(3);
      orb.setActive(true);
      orb.setVisible(true);

      // Set random velocity
      if (!orb.body) this.scene.physics.add.existing(orb);
      orb.body.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      );
      orb.body.setBounce(1);
      orb.body.setCollideWorldBounds(true);
    }
  }

  spawnBoss() {
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

    const boss = new Boss(this.scene, x, y, 60, 0xff0000, 20); // Adjust radius and health as needed
    this.scene.bossArray.push(boss);
  }
}
