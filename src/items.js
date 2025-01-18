export default class Items extends Phaser.Scene {
  constructor() {
    super({ key: "Items" });
  }

  init(data) {
    this.mainScene = data.mainScene;
    this.lvl = data.lvl;
  }

  create() {
    const { width, height } = this.scale;

    // Create a semi-transparent rectangle
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    this.add
      .text(width / 2, height / 6, `Level ${this.lvl} Reached!`, {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const items = this.generateRandomItems();

    // Display the items
    items.forEach((item, index) => {
      const x = (this.scale.width / 4) * (index + 1); // Responsive horizontal positioning
      const y = this.scale.height / 2; // Center vertically

      // Create the responsive rectangle
      const border = this.add
        .rectangle(
          x,
          y,
          this.scale.width * 0.2,
          this.scale.height * 0.3,
          0x000000
        )
        .setStrokeStyle(2, 0xffffff)
        .setOrigin(0.5)
        .setInteractive();

      border.on("pointerover", () => {
        //scale border size
        border.setScale(1.1);
      });

      border.on("pointerout", () => {
        //scale border size
        border.setScale(1);
      });

      border.on("pointerdown", () => this.selectItem(item));

      // Add the item name
      const itemButton = this.add
        .text(x, y - border.height / 4, item.name, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.03}px`, // Scaled font size
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectItem(item));

      // Add the item description
      const itemDescription = this.add
        .text(x, y + border.height / 4, item.description, {
          fontSize: `${
            Math.min(this.scale.width, this.scale.height) * 0.025
          }px`, // Scaled font size for description
          color: "#ffffff",
          wordWrap: { width: border.width * 0.9 }, // Ensure the text wraps within the rectangle
          align: "center",
        })
        .setOrigin(0.5);
    });
  }

  generateRandomItems() {

    const allItems = [
      {
        name: "Increase Speed",
        effect: () => (this.mainScene.playerSpeed += 500),
        description: "Boosts player speed by +50",
      },
      {
        name: "Fire Rate",
        effect: () => {
          this.mainScene.fireRate = Math.max(50, this.mainScene.fireRate - 500);
          this.mainScene.restartLaserTimer(); // Restart timer with new fireRate
        },
        description: "Reduce the time between shots by 100ms",
        
      },
      {
        name: "Magnet",
        effect: () => (this.mainScene.followThreshold += 1000),
        description: "Increases player pickup range by +10",
      },
      {
        name: "Laser Speed",
        effect: () => (this.mainScene.laserSpeed += 1000),
        description: "Increases laser speed by +100",
      },
      {
        name: "Enemy Speed",
        effect: () => (this.mainScene.enemySpeed -= 50),
        description: "Decreases enemy speed by -15",
      },

      {
        name: "Saving Grace",
        effect: () => (this.mainScene.playerHealth += 1),
        description: "Increases player health by +1",
      },
      {
        name: "Laser-Splosion",
        effect: () => (this.mainScene.explodeIntoLasers = true),
        description: "Enemies explode into more lasers!"
      }
    ];

    // Shuffle and pick 3 random items
    return Phaser.Utils.Array.Shuffle(allItems).slice(0, 3);
  }

  selectItem(item) {
    console.log("Item selected!");
    console.log(`Selected: ${item.name}`);

    // Apply the selected item's effect
    item.effect(); // Use the effect on mainScene

    // Resume the main game
    this.scene.stop(); // Stop the Items menu
    this.scene.resume("GameScene"); // Resume the main game
  }
}
