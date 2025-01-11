export default class Enemies extends Phaser.GameObjects.Ellipse {

  constructor(scene, x, y, radius, color) {
    super(scene, x, y, radius, radius, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);

  }

  update(player){

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


  }