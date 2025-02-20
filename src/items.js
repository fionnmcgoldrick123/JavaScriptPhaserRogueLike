export default class Items extends Phaser.Scene {
  constructor() {
    super({ key: "Items" });
  }

  init(data) {
    this.mainScene = data.mainScene;
    this.lvl = data.lvl;

    this.mainScene.scene.pause(); // Pause the main game
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

      // Create the responsive rectangle with dynamic color
      const border = this.add
        .rectangle(
          x,
          y,
          this.scale.width * 0.2,
          this.scale.height * 0.3,
          0x000000
        )
        .setStrokeStyle(2, item.color)
        .setOrigin(0.5)
        .setInteractive();

      border.on("pointerover", () => {
        border.setScale(1.1);
      });

      border.on("pointerout", () => {
        border.setScale(1);
      });

      border.on("pointerdown", () => this.selectItem(item));

      // Add the item name and description (unchanged)
      const itemButton = this.add
        .text(x, y - border.height / 4, item.name, {
          fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.03}px`,
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectItem(item));

      const itemDescription = this.add
        .text(x, y + border.height / 4, item.description, {
          fontSize: `${
            Math.min(this.scale.width, this.scale.height) * 0.025
          }px`,
          color: "#ffffff",
          wordWrap: { width: border.width * 0.9 },
          align: "center",
        })
        .setOrigin(0.5);
    });
  }

  generateRandomItems() {
    const allItems = [
      {
        name: "Increase Speed",
        effect: () => {
          (this.mainScene.playerSpeed += 50),
            (this.mainScene.playerSpeed = Math.min(
              500,
              this.mainScene.playerSpeed
            ));
        },
        description: "Boosts player speed by +50",
        rarity: { min: 0, max: 50 }, //common 50% chance
        color: 0xffffff,
      },
      {
        name: "Fire Rate",
        effect: () => {
          this.mainScene.fireRate -= 100; // Reduce the time between shots by 100ms
          this.mainScene.fireRate = Math.max(50, this.mainScene.fireRate); // Ensure minimum fire rate is 100ms
          this.mainScene.restartLaserTimer(); // Restart timer with new fire rate
        },
        description: "Reduce the time between shots by 100",
        rarity: { min: 51, max: 85 }, //uncommon 34% chance
        color: 0x00ff00,
      },
      {
        name: "Magnet",
        effect: () => {
          (this.mainScene.followThreshold += 50),
            (this.mainScene.followThreshold = Math.min(
              350,
              this.mainScene.followThreshold
            ));
        },
        description: "Increases player pickup range by +50",
        rarity: { min: 51, max: 85 }, //uncommon 34% chance
        color: 0x00ff00,
      },
      {
        name: "Laser Speed",
        effect: () => {
          this.mainScene.laserSpeed += 200;
          this.mainScene.laserSpeed = Math.min(1000, this.mainScene.laserSpeed);
        },
        description: "Increases laser speed by +200",
        rarity: { min: 0, max: 50 }, //common 50% chance
        color: 0xffffff,
      },
      {
        name: "Enemy Speed",
        effect: () => {
          this.mainScene.enemySpeed -= 10; // Decrease enemy speed by 50
          this.mainScene.enemySpeed = Math.max(50, this.mainScene.enemySpeed); // Ensure minimum speed is 50
        },
        description: "Decreases enemy speed by -10",
        rarity: { min: 51, max: 85 }, //uncommon 34% chance
        color: 0x00ff00,
      },

      {
        name: "Saving Grace",
        effect: () => (this.mainScene.playerHealth += 1),
        description: "Increases player health by +1",
        rarity: { min: 86, max: 95 }, //rare 9% chance
        color: 0x800080,
      },
      {
        name: "Laser-Splosion",
        effect: () => (this.mainScene.explodeIntoLasers = true),
        description: "Enemies have a may to explode into more lasers!",
        rarity: { min: 96, max: 100 }, //legendary 4% chance
        color: 0xffff00,
      },
      {
        name: "Multi-Shot",
        effect: () => {
          this.mainScene.multiShot = true; // Ensure this flag is set
          this.mainScene.restartLaserTimer(); // Restart laser timer after activation
        },
        description: "Shoot 3 lasers at once!",
        rarity: { min: 86, max: 95 }, //rare 9% chance
        color: 0x800080,
      },
      {
        name: "Double EXP",
        effect: () => {
          //make exp gained from main scene = 20
          this.mainScene.expGained = 20;
        },
        description: "Doubles the experience gained",
        rarity: { min: 96, max: 100 }, //legendary 4% chance
        color: 0xffff00,
      },
    ];

    const selectedItems = [];
    const usedItems = new Set(); // Track items already selected in this round

    for (let i = 0; i < 3; i++) {
      const rarityRoll = Phaser.Math.Between(1, 100); // Roll a number between 1 and 100

      // Filter items matching the rarity roll and not already selected
      const availableItems = allItems.filter(
        (item) =>
          rarityRoll >= item.rarity.min &&
          rarityRoll <= item.rarity.max &&
          !usedItems.has(item.name)
      );

      if (availableItems.length > 0) {
        // Randomly pick one of the available items
        const selectedItem =
          availableItems[Phaser.Math.Between(0, availableItems.length - 1)];

        selectedItems.push(selectedItem);
        usedItems.add(selectedItem.name); // Mark item as used for this round
      }
    }

    return selectedItems;
  }

  selectItem(item) {

    // Apply the selected item's effect
    item.effect(); // Use the effect on mainScene

    // Resume the main game
    this.scene.stop(); // Stop the Items menu
    this.mainScene.timer.resume(); // Resume the timer
    this.scene.resume("GameScene"); // Resume the main game
  }
}
