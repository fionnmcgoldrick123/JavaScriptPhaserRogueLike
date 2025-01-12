export default class TimeHandler {
  // Three boolean variables to track difficulty
  easy = false;
  medium = false;
  hard = false;

  constructor(scene) {
    this.scene = scene; // Store the scene reference
    this.startTime = this.scene.time.now; // Initialize start time

    // Add timer text at the top center of the screen
    this.timerText = this.scene.add.text(
      this.scene.scale.width / 2, // Center horizontally
      10, // Position near the top
      "Time: 0", // Initial text
      {
        fontSize: "32px",
        color: "#ffffff",
      }
    ).setOrigin(0.5, 0); // Center the text horizontally
  }

  update() {
    // Calculate the elapsed time in seconds
    const elapsedSeconds = Math.floor((this.scene.time.now - this.startTime) / 1000);

    // Update the timer text
    this.timerText.setText(`Time: ${elapsedSeconds}`);

    // Difficulty control
    if (elapsedSeconds > 30 && !this.easy) {
      console.log("30 seconds have passed!");
      this.easy = true; // Lock it
    }
  }

  reset() {
    console.log("Resetting timer...");
    this.startTime = this.scene.time.now; // Reset start time
    this.timerText.setText("Time: 0"); // Reset the displayed timer
    this.easy = this.medium = this.hard = false; // Reset difficulty flags
  }
}
