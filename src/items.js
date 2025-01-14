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

        this.add.text(width / 2, height / 4, `Level ${this.lvl} Reached!`, {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const items = this.generateRandomItems();

        // Display the items
        items.forEach((item, index) => {
            const x = (width / 4) * (index + 1);
            const y = height / 2;

            // Create a rectangle for the border
            const border = this.add.rectangle(x, y, 200, 50, 0x000000) // Black background
                .setStrokeStyle(2, 0xffffff) // White border
                .setOrigin(0.5);

            const itemButton = this.add.text(x, y, item.name, {
                fontSize: '24px',
                color: '#00ff00',
                backgroundColor: '#000000',
                border: '2px solidrgb(255, 255, 255)',
                padding: { x: 10, y: 10 },
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.selectItem(item));
        });
    }

    generateRandomItems() {
        // Example items with unique effects
        const allItems = [
            { name: 'Increase Speed', effect: (gameScene) => gameScene.player.speed += 50 },
            { name: 'Double Damage', effect: (gameScene) => gameScene.player.damage *= 2 },
            { name: 'Extra Life', effect: (gameScene) => gameScene.lives += 1 },
        ];

        // Shuffle and pick 3 random items
        return Phaser.Utils.Array.Shuffle(allItems).slice(0, 3);
    }

    selectItem(item) {
        console.log(`Selected: ${item.name}`);

        // Apply the selected item's effect
        item.effect(this.gameScene);

        // Resume the main game
        this.scene.stop(); // Stop the LevelUpMenu
        this.scene.resume(this.gameScene); // Resume the main game
    }

}

