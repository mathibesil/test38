var Cell = require('./Cell.js');
var Vector3Int = require('./Vector3Int.js');

const Positions = {
    UP: 'UP',
    DOWN: 'DOWN',
    NONE: 'NONE',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UPLEFT: 'UPLEFT',
    UPRIGHT: 'UPRIGHT',
    DOWNLEFT: 'DOWNLEFT',
    DOWNRIGHT: 'DOWNRIGHT'
}

module.exports = class Grid{
    constructor(world_size_x, world_size_y){
        var x,y;
        this.cells = [Cell];
        for(x=world_size_x ;x>=-world_size_x; x--){
            for(y=world_size_y ;y>=-world_size_y; y--){
                this.cells.push(new Cell(x, y))
            }
        }
    }

    GetNextCellToMove(moveDirection, actualPosition)
    {
        var nextCellPosition;

        var x = moveDirection.x;
        var y = moveDirection.y;
      

        if (x == 1 && y == 0)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.RIGHT);
        }
        else
        if (x == 1 && y == 1)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.UPRIGHT);
        }
        else
        if (x == 0 && y == 1)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.UP);
        }
        else
        if (x == -1 && y == 0)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.LEFT);
        }
        else
        if (x == 0 && y == -1)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.DOWN);
        }
        else
        if (x == -1 && y == -1)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.DOWNLEFT);
        }
        else
        if (x == -1 && y == 1)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.UPLEFT);
        }
        else
        if (x == 1 && y == -1)
        {
            nextCellPosition = this.GetCellDirectionByPosition(Positions.DOWNRIGHT);
        }
        else
            nextCellPosition = Vector3Int.zero;

            actualPosition.x += nextCellPosition.x;
            actualPosition.y += nextCellPosition.y;
        return actualPosition;
    }

GetCellDirectionByPosition(aPosition)
    {
        var vector3Int;

        switch (aPosition)
        {
            case (Positions.RIGHT):
                vector3Int = new Vector3Int(1, -1, 0);
                break;
            case (Positions.UPRIGHT):
                vector3Int = new Vector3Int(1, 0, 0);
                break;
            case (Positions.UP):
                vector3Int = new Vector3Int(1, 1, 0);
                break;
            case (Positions.LEFT):
                vector3Int = new Vector3Int(-1, 1, 0);
                break;
            case (Positions.DOWN):
                vector3Int = new Vector3Int(-1, -1, 0);
                break;
            case (Positions.DOWNLEFT):
                vector3Int = new Vector3Int(-1, 0, 0);
                break;
            case (Positions.UPLEFT):
                vector3Int = new Vector3Int(0, 1, 0);
                break;
            case (Positions.DOWNRIGHT):
                vector3Int = new Vector3Int(0, -1, 0);
                break;
            default:
                vector3Int = Vector3Int.zero;
                break;
        }
        return vector3Int;
    }
}

