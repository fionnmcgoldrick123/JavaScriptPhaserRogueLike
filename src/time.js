import Difficulty from "./difficulty.js";

export default class TimeHandler {
  // Three boolean variables to track difficulty
  crisisI = false;
  crisisII = false;
  crisisIII = false;

  constructor(scene) {
    this.scene = scene; // Store the scene reference
    this.startTime = this.scene.time.now; // Initialize start time

    //instance of difficulty class
    this.difficulty = new Difficulty(this.scene);

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
    this.crisisI = this.crisisII = this.hard = this.crisisIII; // Reset difficulty flags
  }

  handleDifficulty() {
    // Difficulty control
    if (this.elapsedSeconds > 30 && !this.easy) {
      console.log("30 seconds have passed!");
      this.difficulty.update("crisisI");
      this.easy = true;
    } else if (this.elapsedSeconds > 60 && !this.medium) {
      console.log("60 seconds have passed!");
      this.difficulty.update("crisisII");
      this.medium = true;
    } else if (this.elapsedSeconds > 90 && !this.hard) {
      console.log("90 seconds have passed!");
      this.difficulty.update("crisisIII");
      this.hard = true;
    }
  }
}
