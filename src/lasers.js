export default class Lasers extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color) {
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(false); // Ensure the laser stays within bounds
    this.body.onWorldBounds = true; // Detect when it goes out of bounds
    this.body.setAllowGravity(false); // Lasers should not be affected by gravity
    this.speed = 400; // Default speed of the laser
  }

  fire(playerX, playerY, pointerX, pointerY) {
    // Position the laser at the player's position
    this.setPosition(playerX, playerY);

    // Calculate direction vector from player to pointer
    const directionX = pointerX - playerX;
    const directionY = pointerY - playerY;

    // Normalize the direction vector
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
    const normalizedX = (directionX / distance) * this.speed;
    const normalizedY = (directionY / distance) * this.speed;

    // Set velocity of the laser
    this.body.setVelocity(normalizedX, normalizedY);
  }

  update() {

    // Check if the laser is still active
    if (!this.active) {
      return;
    }

    // Destroy the laser if it moves off-screen
    if (
      this.x < 0 ||
      this.x > this.scene.scale.width ||
      this.y < 0 ||
      this.y > this.scene.scale.height
    ) {
      this.destroy();
    }
  }
}
