export default class Exp {

  constructor(scene){
    this.scene = scene;
    this.lvl = 1;
    this.exp = 0;
  }

  static HandleExp(instance){
    
    instance.exp += 10;
    instance.expToLvl = instance.lvl * 100;

    console.log("Exp: " + instance.exp);  

    if(instance.exp >= instance.expToLvl){
      instance.lvl += 1;
      instance.exp = 0;
      instance.expToLvl = instance.lvl * 100;
      console.log("Level Up!");
    }

  }
}