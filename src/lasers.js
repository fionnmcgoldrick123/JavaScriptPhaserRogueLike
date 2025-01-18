export default class Lasers extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color) {
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true); // Ensure collision with world bounds
    this.body.onWorldBounds = true; // Enable world bounds event
    this.body.setAllowGravity(false); // Prevent gravity from affecting lasers
  }

  fire(startX, startY, targetX, targetY) {
    // Position the laser at the player's position
    this.setPosition(startX, startY);

    // Calculate the direction to the target
    const directionX = targetX - startX;
    const directionY = targetY - startY;

    // Normalize the direction vector
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
    const normalizedX = (directionX / distance) * this.scene.laserSpeed;
    const normalizedY = (directionY / distance) * this.scene.laserSpeed;

    // Set the laser's velocity
    this.body.setVelocity(normalizedX, normalizedY);
  }
}
