import Boss from "./boss.js";

export default class Difficulty {
  //three boolean variables to track difficulty
  crisisI = false;
  crisisII = false;
  crisisIII = false;
  crisisIV = false;
  crisisV = false;
  crisisVI = false;
  crisisVII = false;
  crisisVIII = false;
  crisisIX = false;
  crisisX = false;

  //constructor to initialize the scene
  constructor(scene) {
    this.scene = scene;
    this.bossInstance = new Boss(this.scene);
  }

  create() {
    //add text to display the difficulty top left corner of the screen
    this.difficultyText = this.scene.add.text(10, 10, "0", {
      fontSize: "52px",
      color: "#ffffff",
    })
    .setDepth(1) // Ensure the text is above everything else
    .setFontStyle("bold");
  }

  update(difficulty) {
    if (!this.difficultyText) {
      return;
    }

    switch (difficulty) {
      case "crisisI":
        this.scene.enemySpawn.delay = 1800;
        this.crisisI = true;
        this.difficultyText.setText("I");
        this.bossInstance.spawnBoss(10);
        break;

      case "crisisII":
        this.scene.enemySpawn.delay = 1200;
        this.crisisI = false;
        this.crisisII = true;
        this.difficultyText.setText("II").updateText();
        this.bossInstance.spawnBoss(20);
        break;

      case "crisisIII":
        this.scene.enemySpawn.delay = 600;
        this.crisisII = false;
        this.crisisIII = true;
        this.difficultyText.setText("III");
        this.bossInstance.spawnBoss(30);
        break;

      case "crisisIV":
        this.scene.enemySpawn.delay = 500;
        this.crisisIII = false;
        this.crisisIV = true;
        this.difficultyText.setText("IV");
        this.bossInstance.spawnBoss(40);
        break;

      case "crisisV":
        this.scene.enemySpawn.delay = 300;
        this.crisisIV = false;
        this.crisisV = true;
        this.difficultyText.setText("V");
        this.bossInstance.spawnBoss(50);
        break;

      case "crisisVI":
        this.scene.enemySpawn.delay = 200;
        this.crisisV = false;
        this.crisisVI = true;
        this.difficultyText.setText("VI");
        this.bossInstance.spawnBoss(60);
        break;

      case "crisisVII":
        this.scene.enemySpawn.delay = 150;
        this.crisisVI = false;
        this.crisisVII = true;
        this.difficultyText.setText("VII");
        this.bossInstance.spawnBoss(70);
        break;

      case "crisisVIII":
        this.scene.enemySpawn.delay = 120;
        this.crisisVII = false;
        this.crisisVIII = true;
        this.difficultyText.setText("VIII");
        this.bossInstance.spawnBoss(80);
        break;

      case "crisisIX":
        this.scene.enemySpawn.delay = 100;
        this.crisisVIII = false;
        this.crisisIX = true;
        this.difficultyText.setText("IX");
        this.bossInstance.spawnBoss(90);
        break;

      case "crisisX":
        this.scene.enemySpawn.delay = 80;
        this.crisisIX = false;
        this.crisisX = true;
        this.difficultyText.setText("X");
        this.bossInstance.spawnBoss(100);
        break;
    }
  }
}
