export default class Enemies extends Phaser.GameObjects.Ellipse {
  constructor(scene, x, y, radius, color) {
    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
  }

  update(player) {
    // Check if the enemy is still active
    if (!this.active) {
      return;
    }

    const directionX = player.x - this.x;
    const directionY = player.y - this.y;

    const speed = 100;

    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    //move constantly towards player
    this.body.setVelocity(
      (directionX / distance) * speed,
      (directionY / distance) * speed
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
    console.log("Enemy exploding into orbs!"); // Debug log

    const orbCount = 5; // Number of orbs to spawn

    for (let i = 0; i < orbCount; i++) {
      // Create an orb at the enemy's position
      const orb = this.scene.orbGroup.get(); // Retrieve an orb from the group

      // Initialize the orb as a dynamic circle
      orb.setPosition(this.x, this.y); // Set orb position to enemy's position
      orb.setFillStyle(0x00ffff, 1); // Cyan color
      orb.setRadius(3); // Orb size
      orb.setActive(true);
      orb.setVisible(true);

      // Enable physics and set random velocities
      this.scene.physics.add.existing(orb);
      orb.body.setVelocity(
        Phaser.Math.Between(-400, 400), // Random horizontal velocity
        Phaser.Math.Between(-400, 400) // Random vertical velocity
      );
      orb.body.setBounce(1); // Make the orbs bounce
      orb.body.setCollideWorldBounds(true); // Ensure orbs stay within bounds

      
    }
  }
}
