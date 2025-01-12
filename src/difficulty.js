export default class Difficulty {

  //three boolean variables to track difficulty
  crisisI = false;
  crisisII = false;
  crisisIII = false;

  //constructor to initialize the scene
  constructor(scene){
    this.scene = scene;
  }

  //function to update the difficulty
  update(difficulty){
   
    switch(difficulty){
      case "crisisI":
        console.log("Crisis I");
        this.scene.enemySpawn.delay = 1800;
        this.crisisI = true;
        this.crisisII = false;
        this.crisisIII = false;
        break;
      case "crisisII":
        console.log("Crisis II");
        this.scene.enemySpawn.delay = 1200;
        this.crisisI = false;
        this.crisisII = true;
        this.crisisIII = false;
        break;
      case "crisisIII":
        console.log("Crisis III");
        this.scene.enemySpawn.delay = 600;
        this.crisisI = false;
        this.crisisII = false;
        this.crisisIII = true;
        break;
    }

  } 




}