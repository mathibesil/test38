var Vector2 = require('./Vector2.js');

module.exports = class Attack{
    constructor(){
        this.attacker = '';
        this.target = '';
        this.attackPosition = new Vector2();
        this.attackTargetActualPosition = new Vector2();
    }
};