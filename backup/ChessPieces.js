const BlackBishop = {
    PATH: "img/BB.png",
    FEN:"b",
    GetPositions: function(x,y,overlap = false){
        return BishopPositions(x,y,false,overlap);
    },
    IS_WHITE: false,
    TYPE:"BISHOP",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "LINE",
    IS_CURRENTLY_MOVING: function(){
        return !Game.turn;
    },
}
const WhiteBishop = {
    PATH: "img/WB.png",
    FEN:"B",
    GetPositions: function(x,y,overlap = false){
        return BishopPositions(x,y,true,overlap);
    },
    IS_WHITE: true,
    TYPE:"BISHOP",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "LINE",
    IS_CURRENTLY_MOVING: function(){
        return Game.turn;
    },
}
const BlackKnight = {
    PATH: "img/BKN.png",
    FEN:"n",
    GetPositions: function(x,y,overlap = false){
        return KnightPositions(x,y,false,overlap);
    },
    IS_WHITE: false,
    TYPE:"KNIGHT",
    CAN_BE_BLOCKED: false,
    BLOCK_TYPE: "CAPTURE",
    IS_CURRENTLY_MOVING: function(){
        return !Game.turn;
    },
}
const WhiteKnight = {
    PATH: "img/WKN.png",
    FEN:"N",
    GetPositions: function(x,y,overlap = false){
        return KnightPositions(x,y,true,overlap);
    },
    IS_WHITE: true,
    TYPE:"KNIGHT",
    CAN_BE_BLOCKED: false,
    BLOCK_TYPE: "CAPTURE",
    IS_CURRENTLY_MOVING: function(){
        return Game.turn;
    },
}
const BlackRook = {
    PATH: "img/BR.png",
    FEN:"r",
    GetPositions: function(x,y,overlap = false){
        return RookPositions(x,y,false,overlap);
    },
    IS_WHITE: false,
    TYPE:"ROOK",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "LINE",
    IS_CURRENTLY_MOVING: function(){
        return !Game.turn;
    },
}
const WhiteRook = {
    PATH: "img/WR.png",
    FEN:"R",
    GetPositions: function(x,y,overlap = false){
        return RookPositions(x,y,true,overlap);
    },
    IS_WHITE: true,
    TYPE:"ROOK",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "LINE",
    IS_CURRENTLY_MOVING: function(){
        return Game.turn;
    },
}
const BlackPawn = {
    PATH: "img/BP.png",
    FEN:"p",
    GetPositions: function(x,y,overlap = false){
        return PawnPositions(x,y,false,overlap);
    },
    GetAttackPositions: function(x,y,overlap = false){
        return PawnAttacks(x,y,false,overlap);
    },
    IS_WHITE: false,
    TYPE:"PAWN",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "CAPTURE",
    IS_CURRENTLY_MOVING: function(){
        return !Game.turn;
    },
}
const WhitePawn = {
    PATH: "img/WP.png",
    FEN:"P",
    GetPositions: function(x,y,overlap = false){
        return PawnPositions(x,y,true,overlap);
    },
    GetAttackPositions: function(x,y,overlap = false){
        return PawnAttacks(x,y,true,overlap);
    },
    IS_WHITE: true,
    TYPE:"PAWN",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "CAPTURE",
    IS_CURRENTLY_MOVING: function(){
        return Game.turn;
    },
}
const BlackQueen = {
    PATH: "img/BQ.png",
    FEN:"q",
    GetPositions: function(x,y,overlap = false){
        return QueenPositions(x,y,false,overlap);
    },
    IS_WHITE: false,
    TYPE:"QUEEN",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "LINE",
    IS_CURRENTLY_MOVING: function(){
        return !Game.turn;
    },
}
const WhiteQueen = {
    PATH: "img/WQ.png",
    FEN:"Q",
    GetPositions: function(x,y,overlap = false){
        return QueenPositions(x,y,true,overlap);
    },
    IS_WHITE: true,
    TYPE:"QUEEN",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "LINE",
    IS_CURRENTLY_MOVING: function(){
        return Game.turn;
    },
}
const BlackKing = {
    PATH: "img/BK.png",
    FEN:"k",
    GetPositions: function(x,y,overlap = false,supports = true){
        return KingPositions(x,y,false,overlap,supports);
    },
    IS_WHITE: false,
    TYPE:"KING",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "NULL",
    IS_CURRENTLY_MOVING: function(){
        return !Game.turn;
    },
}
const WhiteKing = {
    PATH: "img/WK.png",
    FEN:"K",
    GetPositions: function(x,y,overlap = false,supports = true){
        return KingPositions(x,y,true,overlap,supports);
    },
    IS_WHITE: true,
    TYPE:"KING",
    CAN_BE_BLOCKED: true,
    BLOCK_TYPE: "NULL",
    IS_CURRENTLY_MOVING: function(){
        return Game.turn;
    },
}
const None = {
    PATH: "img/none.png",
    FEN: undefined,
    GetPositions: function(x,y,overlap){
        return undefined;
    },
    IS_WHITE: undefined,
    TYPE: undefined,
    CAN_BE_BLOCKED: undefined,
    BLOCK_TYPE: undefined,
    IS_CURRENTLY_MOVING: function(){
        return undefined;
    },
}
const pieces = [BlackBishop,WhiteBishop,BlackKing,WhiteKing,BlackKnight,WhiteKnight,BlackPawn,WhitePawn,BlackQueen,WhiteQueen,BlackRook,WhiteRook,None];
function BishopPositions(x,y,color,overlap){
    let positions = [];
    for (let xdir = 1; xdir > -2; xdir -= 2){
        for (let ydir = 1; ydir > -2; ydir -= 2){
            let xn = x + xdir;
            let yn = y + ydir;
            let finished = false;
            while (!finished){
                if (Board.IsInBounds(xn,yn)){
                    let piece = Board.Get(xn,yn);
                    if (piece.PATH == None.PATH){
                        positions.push({x:xn,y:yn});
                        xn += xdir;
                        yn += ydir;
                    }
                    else if (!overlap ? piece.IS_WHITE != color : piece.PATH != None.PATH){
                        positions.push({x:xn,y:yn});
                        xn += xdir;
                        yn += ydir;
                        finished = true;
                    }
                    else{
                        finished = true;
                    }
                }
                else{
                    finished = true;
                }
            }
        }
    }
    return positions;
}
function KnightPositions(x,y,color,overlap){
    let positions = [{x:2,y:1},{x:2,y:-1},{x:-2,y:1},{x:-2,y:-1},{x:1,y:2},{x:1,y:-2},{x:-1,y:2},{x:-1,y:-2}];
    for (let i = 0; i < positions.length; i++){
        positions[i] = {x:(positions[i].x+x),y:(positions[i].y+y)}
    }
    prunedPositions = []
    for (let i = 0; i < positions.length; i++){
        if (Board.VecIsInBounds(positions[i])){
            if (!overlap ? Board.VGet(positions[i]).IS_WHITE != color : true){
                prunedPositions.push(positions[i]);
            }
        }
    }
    return prunedPositions;
}
function RookPositions(x,y,color,overlap){
    let positions = [];
    for (let z = 0; z < 2; z++){
        for (let zdir = 1; zdir > -2; zdir -= 2){
            let zn = (z == 0 ? y : x) + zdir;
            let finished = false;
            while (!finished){
                let vec = z == 0 ? {x:x,y:zn} : {x:zn,y:y};
                if (Board.VecIsInBounds(vec)){
                    let piece = Board.VGet(vec);
                    if (piece.PATH == None.PATH){
                        positions.push(vec);
                        zn += zdir;
                    }
                    else if (!overlap ? piece.IS_WHITE != color : piece.PATH != None.PATH){
                        positions.push(vec);
                        zn += zdir;
                        finished = true;
                    }
                    else{
                        finished = true;
                    }
                }
                else{
                    finished = true;
                }
            }
        }
    }
    return positions;
}
function PawnPositions(x,y,color,overlap){
    let positions = [];
    let ydir = 0;
    if (color){
        ydir = -1;
    }
    else{
        ydir = 1;
    }
    if (Board.IsInBounds(x,y+ydir)){
        // move forward
        if (Board.Get(x,y+ydir).PATH == None.PATH){
            positions.push({x:x,y:(y+ydir),enpassant:false});
        }
        // special start move forward
        if (y == (color ? 6 : 1 )){
            if (Board.Get(x,y+ydir) == None && Board.Get(x,y+ydir*2) == None){
                positions.push({x:x,y:y+ydir*2,enpassant:false});
            }
        }
        // reg captures
        for (let i = 1; i > -2; i -= 2){
            vec = {x:x+i,y:y+ydir};
            if (Board.VecIsInBounds(vec)){
                if (Board.VGet(vec) != None){
                    if (!overlap ? !Board.VGet(vec).IS_CURRENTLY_MOVING() : true){
                        positions.push({x:(x+i),y:(y+ydir),enpassant:false});
                    }
                }
            }
        }
        // en-passants
        if (Game.previousMove.INITIALIZED){
            for (let i = 1; i > -2; i -= 2){
                let vec = {x:x+i,y:y};
                if (Board.VecIsInBounds(vec)){
                    if (Board.VGet(vec).TYPE == "PAWN"){
                        if (Game.previousMove.PIECE.TYPE == "PAWN"){
                            if (Game.previousMove.PREVPOSITION.y == color ? 1 : 6){
                                if (Game.previousMove.POSITION.y == color ? 3 : 4){
                                    if (Game.previousMove.POSITION.y == y && Game.previousMove.POSITION.x == x + i){
                                        positions.push({x:(x+i),y:(y+ydir),enpassant:true});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    return positions;
}
function QueenPositions(x,y,color,overlap){
    let positions = [];
    for (let xdir = 1; xdir > -2; xdir--){
        for (let ydir = 1; ydir > -2; ydir--){
            let xn = x + xdir;
            let yn = y + ydir;
            let finished = false;
            while (!finished){
                if (!(xdir == 0 && ydir == 0)){
                    let vec = {x:xn,y:yn};
                    if (Board.VecIsInBounds(vec)){
                        let piece = Board.VGet(vec);
                        if (piece.PATH == None.PATH){
                            positions.push(vec);
                            xn += xdir;
                            yn += ydir;
                        }
                        else if (!overlap ? piece.IS_WHITE != color : piece.PATH != None.PATH){
                            positions.push(vec);
                            xn += xdir;
                            yn += ydir;
                            finished = true;
                        }
                        else{
                            finished = true;
                        }
                    }
                    else{
                        finished = true;
                    }
                }
                else{
                    finished = true;
                }
            }
        }
    }
    return positions;
}
function KingPositions(x,y,color,overlap,prune){
    let positions = [{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1},{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}];
    for (let i = 0; i < positions.length; i++){
        positions[i] = {x:(positions[i].x+x),y:(positions[i].y+y)}
    }
    let prunedPositions = [];
    for (let i = 0; i < positions.length; i++){
        if (Board.VecIsInBounds(positions[i])){
            let piece = Board.VGet(positions[i]);
            if (prune){
                let attacked = GetAttackedPositions(!color);
                if (piece.PATH == None.PATH){
                    if (!Vector.Contains(attacked,positions[i])){
                        prunedPositions.push(positions[i]);
                    }
                }
                else if (piece.IS_WHITE != color || overlap){
                    if (!PieceIsSupported({x:positions[i].x,y:positions[i].y})){
                        prunedPositions.push(positions[i]);
                    }
                }
            }
            else{
                if (piece.PATH == None.PATH){
                    prunedPositions.push(positions[i]);
                }
                else if (piece.IS_WHITE != color || overlap){
                    prunedPositions.push(positions[i]);
                }
            }
        }
    }
    return prunedPositions;
}
function PositionsSelective(pos,dir,color){
    let positions = [];
    let xn = pos.x + dir.x;
    let yn = pos.y + dir.y;
    let finished = false;
    while (!finished){
        if (Board.IsInBounds(xn,yn)){
            let piece = Board.Get(xn,yn);
            if (piece.PATH == None.PATH){
                positions.push({x:xn,y:yn});
                xn += dir.x;
                yn += dir.y;
            }
            else if (piece.IS_WHITE != color){
                positions.push({x:xn,y:yn});
                xn += dir.x;
                yn += dir.y;
                finished = true;
            }
            else{
                finished = true;
            }
        }
        else{
            finished = true;
        }
    }
    return positions;
}
function PieceIsSupported(vec){
    let piece = Board.VGet(vec);
    if (piece.PATH != None.PATH){
        let color = piece.IS_WHITE;
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                if (!Vector.Equal(vec,{x:x,y:y})){
                    let piece = Board.Get(x,y);
                    if (piece.PATH != None.PATH){
                        if (piece.IS_WHITE == color){
                            let flag = false;
                            if (piece.TYPE == "PAWN"){
                                flag = Vector.Contains(piece.GetAttackPositions(x,y,true),vec);
                            }
                            else if (piece.TYPE != "KING"){
                                flag = Vector.Contains(piece.GetPositions(x,y,true),vec);
                            }
                            if (flag){
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}
function PawnAttacks(x,y,color,overlap){
    let positions = [];
    let ydir = 0;
    if (color){
        ydir = -1;
    }
    else{
        ydir = 1;
    }
    if (Board.IsInBounds(x,y+ydir)){
        // reg captures
        for (let i = 1; i > -2; i -= 2){
            vec = {x:x+i,y:y+ydir};
            if (Board.VecIsInBounds(vec)){
                if (!overlap ? !Board.VGet(vec).IS_CURRENTLY_MOVING() : true){
                    positions.push({x:(x+i),y:(y+ydir),enpassant:false});
                }
            }
        }
        // en-passants
        if (Game.previousMove.INITIALIZED){
            for (let i = 1; i > -2; i -= 2){
                let vec = {x:x+i,y:y};
                if (Board.VecIsInBounds(vec)){
                    if (Board.VGet(vec).TYPE == "PAWN"){
                        if (Game.previousMove.PIECE.TYPE == "PAWN"){
                            if (Game.previousMove.PREVPOSITION.y == color ? 1 : 6){
                                if (Game.previousMove.POSITION.y == color ? 3 : 4){
                                    if (Game.previousMove.POSITION.y == y && Game.previousMove.POSITION.x == x + i){
                                        positions.push({x:(x+i),y:(y+ydir),enpassant:true});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return positions;
}