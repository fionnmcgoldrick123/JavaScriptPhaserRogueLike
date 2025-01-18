import Difficulty from "./difficulty.js";

export default class TimeHandler {

  constructor(scene) {
    this.scene = scene; // Store the scene reference
    this.startTime = this.scene.time.now; // Initialize start time

    //instance of difficulty class
    this.difficulty = new Difficulty(this.scene);
    this.difficulty.create();

    // Add timer text at the top center of the screen
    this.timerText = this.scene.add
      .text(
        this.scene.scale.width / 2, // Center horizontally
        10, // Position near the top
        "Time: 0", // Initial text
        {
          fontSize: "32px",
          color: "#ffffff",
        }
      )
      .setDepth(1) // Ensure the text is above everything else
      .setOrigin(0.5, 0); // Center the text horizontally
      
  }

  update() {
    // Calculate the elapsed time in seconds
     this.elapsedSeconds = Math.floor(
      (this.scene.time.now - this.startTime) / 1000
    );

    // Update the timer text
    this.timerText.setText(`Time: ${this.elapsedSeconds}`);

    this.handleDifficulty();
  }

  reset() {
    console.log("Resetting timer...");
    this.startTime = this.scene.time.now; // Reset start time
    this.timerText.setText("Time: 0"); // Reset the displayed timer
    
  }

  handleDifficulty() {
    // Difficulty control
    if (this.elapsedSeconds == 30 && !this.crisisI) {
        console.log("30 seconds have passed!");
        this.difficulty.update("crisisI");
        this.crisisI = true;
    } else if (this.elapsedSeconds == 60 && !this.crisisII) {
        console.log("60 seconds have passed!");
        this.difficulty.update("crisisII");
        this.crisisI = false;
        this.crisisII = true;
    } else if (this.elapsedSeconds == 90 && !this.crisisIII) {
        console.log("90 seconds have passed!");
        this.difficulty.update("crisisIII");
        this.crisisII = false;
        this.crisisIII = true;
    } else if (this.elapsedSeconds == 120 && !this.crisisIV) {
        console.log("120 seconds have passed!");
        this.difficulty.update("crisisIV");
        this.crisisIII = false;
        this.crisisIV = true;
    } else if (this.elapsedSeconds == 150 && !this.crisisV) {
        console.log("150 seconds have passed!");
        this.difficulty.update("crisisV");
        this.crisisIV = false;
        this.crisisV = true;
    } else if (this.elapsedSeconds == 180 && !this.crisisVI) {
        console.log("180 seconds have passed!");
        this.difficulty.update("crisisVI");
        this.crisisV = false;
        this.crisisVI = true;
    } else if (this.elapsedSeconds == 210 && !this.crisisVII) {
        console.log("210 seconds have passed!");
        this.difficulty.update("crisisVII");
        this.crisisVI = false;
        this.crisisVII = true;
    } else if (this.elapsedSeconds == 240 && !this.crisisVIII) {
        console.log("240 seconds have passed!");
        this.difficulty.update("crisisVIII");
        this.crisisVII = false;
        this.crisisVIII = true;
    } else if (this.elapsedSeconds == 270 && !this.crisisIX) {
        console.log("270 seconds have passed!");
        this.difficulty.update("crisisIX");
        this.crisisVIII = false;
        this.crisisIX = true;
    } else if (this.elapsedSeconds == 300 && !this.crisisX) {
        console.log("300 seconds have passed!");
        this.difficulty.update("crisisX");
        this.crisisIX = false;
        this.crisisX = true;
    }
}

}
