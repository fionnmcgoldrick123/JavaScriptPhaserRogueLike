import Difficulty from "./difficulty.js";

export default class TimeHandler {
  constructor(scene) {
    this.scene = scene; // Store the scene reference
    this.startTime = this.scene.time.now; // Initialize start time
    this.elapsedSeconds = 0; // Track elapsed time
    this.timerPaused = false; // Timer starts unpaused
    this.pausedAt = 0; // Track when the timer was paused
    this.totalPausedDuration = 0; // Total time spent in paused state

    // Instance of difficulty class
    this.difficulty = new Difficulty(this.scene);
    this.difficulty.create();

    // Add timer text at the top center of the screen
    this.timerText = this.scene.add
      .text(this.scene.scale.width / 2, 10, "Time: 0", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setDepth(1)
      .setOrigin(0.5, 0);
  }

  update() {
    if (this.timerPaused) return; // Stop updating if paused

    // Calculate the elapsed time in seconds, excluding paused duration
    const currentTime = this.scene.time.now;
    this.elapsedSeconds = Math.floor(
      (currentTime - this.startTime - this.totalPausedDuration) / 1000
    );

    // Update the timer text
    this.timerText.setText(`Time: ${this.elapsedSeconds}`);

    this.handleDifficulty();
  }

  pause() {
    if (!this.timerPaused) {
      this.timerPaused = true; // Set paused state
      this.pausedAt = this.scene.time.now; // Record when the timer was paused
      console.log(`Timer paused at: ${this.pausedAt}`);
    }
  }

  resume() {
    if (this.timerPaused) {
      const resumeTime = this.scene.time.now; // Record when the timer resumes
      const pausedDuration = resumeTime - this.pausedAt; // Calculate pause duration
      this.totalPausedDuration += pausedDuration; // Accumulate total paused time
      this.timerPaused = false; // Unpause
      console.log(
        `Timer resumed at: ${resumeTime}, Total Paused Duration: ${this.totalPausedDuration}`
      );
    }
  }

  reset() {
    console.log("Resetting timer...");
    this.startTime = this.scene.time.now; // Reset start time
    this.elapsedSeconds = 0; // Reset elapsed time
    this.totalPausedDuration = 0; // Reset paused duration
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
