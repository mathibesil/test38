module.exports = class Cell{
    constructor(X=0, Y=0){
        this.x = X;
        this.y = Y;
        this.open = true;
        this.holder = null;
    }

    IsAvailable(){
        return this.open;
    }

    SetOpen(open){
        this.open = open;
    }

    SetHolder(holder){
        this.holder = holder;
    }
}