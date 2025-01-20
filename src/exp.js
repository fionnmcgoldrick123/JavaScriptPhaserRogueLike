export default class Exp {

  constructor(scene){
    this.scene = scene;
    this.lvl = 1;
    this.exp = 0;
  }

   handleExp(){
    
    this.exp += this.scene.expGained;
    this.expToLvl = this.lvl * 100;

    if(this.exp >= this.expToLvl){
      this.lvl += 1;
      this.exp = 0;
      console.log("Level Up: " + this.lvl + "!");
      this.scene.levelUp.play();
      this.scene.scene.pause();
      this.scene.scene.launch("Items", {mainScene: this.scene, lvl: this.lvl});
    }

  }
}