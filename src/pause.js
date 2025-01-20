export default class PauseMenu extends Phaser.Scene {
  constructor() {
    super({ key: "PauseMenu" });
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, "Game Paused", {
      fontSize: "48px",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 100, "Press ESC to Resume", {
      fontSize: "24px",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-ESC", () => {
      const gameScene = this.scene.get("GameScene");
      gameScene.isPaused = false; // Mark the game as unpaused
      gameScene.timer.resume(); // Resume the timer
      this.scene.stop(); // Stop the pause menu
      this.scene.resume("GameScene"); // Resume the main game scene
    });
  
  }
}
