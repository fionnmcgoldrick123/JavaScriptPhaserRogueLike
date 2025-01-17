export default class Player extends Phaser.GameObjects.Ellipse {
  //calling constructor of parent class Ellipse
  constructor(scene, x, y, radius, color) {
    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true); // Don't go out of the screen
  }

  update(pointer) {
    //calculate the distance between the player and the pointer
    const directionX = pointer.x - this.x;
    const directionY = pointer.y - this.y;

    //normalize the direction
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    //if distance is significant
    if (distance > 5) {
      // Only move if the distance is significant
      // Normalize the direction vector and apply speed
      this.body.setVelocity(
        (directionX / distance) * this.scene.playerSpeed,
        (directionY / distance) * this.scene.playerSpeed
      );
    } else {
      // Stop the player if close enough to the pointer
      this.body.setVelocity(0, 0);
    }

    //if click is pressed
    if (pointer.isDown) {

      this.body.setVelocity(0,0);

    }
  }
}
