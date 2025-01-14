export default class Exp {

  constructor(scene){
    this.scene = scene;
    this.lvl = 1;
    this.exp = 0;
  }

   handleExp(){
    
    this.exp += 10;
    this.expToLvl = this.lvl * 100;

    console.log("Exp: " + this.exp);  

    if(this.exp >= this.expToLvl){
      this.lvl += 1;
      this.exp = 0;
      this.expToLvl = this.lvl * 100;
      console.log("Level Up: " + this.lvl + "!");
    }

  }
}