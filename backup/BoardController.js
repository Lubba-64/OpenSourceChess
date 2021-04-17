const startingfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
let currentValidPositions = [];
let currentPieceOriginalPos = undefined;
let Game = {
    Start: function(){
        DrawBoardHTML();
        ParseAndDisplayFen(startingfen);
        Board.ClearRestrictions();
    },
    turn: true,
    CompleteTurn: function(positions){
        if (Board.RESTRICTION_TYPE == "CLOSED"){
            Board.ClearRestrictions();
        }
        positions.forEach(pos => {
            Board.ResetBoardSquareColor(pos.x,pos.y);
        });
        this.turn = !this.turn;
        UpdateCheckStatus();
    },
    capturedPieces:[],
    previousMove: {
        PIECE: undefined,
        POSITION: undefined,
        PREVPOSITION: undefined,
        INITIALIZED: false,
        SetValues: function(piece,position,prevposition){
            this.PIECE =  piece;
            this.POSITION = position;
            this.PREVPOSITION = prevposition;
            this.INITIALIZED = true;
        }
    },
    GameOver: function(){
        console.log("gameover");
    }
}
let Board = {
    // x, y
    boardRestrictions: [[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[]]],
    board: [[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],
    [None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None],
    [None,None,None,None,None,None,None,None],[None,None,None,None,None,None,None,None]],
    RESTRICTION_TYPE: "FREE",
    AddRestriction: function(torestrict,position){
        console.log("a");
        this.RESTRICTION_TYPE = "CLOSED";
        if (this.VecIsInBounds(vec)){
            this.boardRestrictions[torestrict.x][torestrict.y].push(position);
        }
    },
    GetRestriction: function(vec){
        if (this.VecIsInBounds(vec)){
            return this.boardRestrictions[vec.x][vec.y];
        }
        return undefined;
    },
    ClearRestrictions: function(){
        this.RESTRICTION_TYPE = "FREE";
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.boardRestrictions[x][y] = [];
            }
        }
    },
    Get: function(x,y){
        return this.board[x][y];
    },
    Set: function(x,y,piece){
        this.board[x][y] = piece;
        document.getElementById(`Pieceimg:(${x},${y})`).setAttribute('src',piece.PATH);
    },
    VGet: function(vec){
        return this.board[vec.x][vec.y];
    },
    VSet: function(vec,piece){
        this.board[vec.x][vec.y] = piece;
        document.getElementById(`Pieceimg:(${vec.x},${vec.y})`).setAttribute('src',piece.PATH);
    },
    held: None,
    GetHeld: function(){
        return this.held;
    },
    SetHeld: function(piece){
        this.held = piece;
        document.getElementById(`HeldPieceIMG`).setAttribute('src',piece.PATH);
    },
    IsInBounds: function(x,y){
        return (((x > -1) && (x < 8))&& ((y > -1) && (y < 8)));
    },
    VecIsInBounds: function(vec){
        return (((vec.x > -1) && (vec.x < 8))&& ((vec.y > -1) && (vec.y < 8)));
    },
    SetBoardSquareColor: function(x,y,cssclass){
        document.getElementById(`GridCell:(${x},${y})`).setAttribute('class',cssclass);
    },
    ResetBoardSquareColor: function(x,y){
        z = (x % 2) + 1;
        if (y % 2 == 0){
            z = z == 2 ? 1 : 2;   
        }
        document.getElementById(`GridCell:(${x},${y})`).setAttribute('class',`button cell${z}`);
    },
    ResetBoardSquareColorAll: function(){
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.ResetBoardSquareColor(x,y);
            }
        }
    }
}
function GetPieceFromFen(fen){
    let Piece = undefined;
    pieces.forEach(piece => {
        if(piece.FEN == fen){
            Piece = piece;
        }
    });
    return Piece;
}
function GetPieceFromPath(path){
    let Piece = ""
    pieces.forEach(piece => {
        if(piece.PATH == path){
            Piece = piece;
        }
    });
    return Piece;
}
function ParseAndDisplayFen(fen){
    fen = fen.replace(/\//g,"")
    let skip = 0;
    let fenI = 0;
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (skip > 0){
                skip--;
                continue;
            }
            let fennum = parseInt(fen[fenI]);
            if (isNaN(fennum)){
                Board.Set(x,y,GetPieceFromFen(fen[fenI]));
                fenI++;
            }
            else{
                skip = fennum;
                skip--;
                fenI++;
                continue;
            }

        }
    }
}
function TransferPiece(x,y){
    vec = {x:x,y:y};
    if (currentPieceOriginalPos != undefined){
        if (Vector.Equal(vec,currentPieceOriginalPos)){
            Board.Set(x,y,Board.GetHeld());
            Board.SetHeld(None);
            currentValidPositions.forEach(pos => {
                Board.ResetBoardSquareColor(pos.x,pos.y);
            });
            currentPieceOriginalPos = undefined;
            return;
        }
    }
    if (Board.GetHeld() != None){
        let held = Board.GetHeld();
        let isValidPos = false;
        let ValidPos;
        currentValidPositions.forEach(pos => {
            if (Vector.Equal(pos,vec)){
                isValidPos = true;
                ValidPos = pos;
            }
        });
        if (!isValidPos){
            return;
        }
        if (Board.held.TYPE == "PAWN"){
            if (ValidPos.enpassant == true){
                Game.previousMove.SetValues(held,vec,currentPieceOriginalPos);
                Board.Set(x,y + (turn ? 1 : -1),None);
                Board.VSet(vec,held);
                Board.SetHeld(None);
                Game.CompleteTurn(currentValidPositions);
                currentPieceOriginalPos = undefined;
            }
        }
        let potentialCapturedPiece = Board.VGet(vec);
        if (potentialCapturedPiece.FEN !== undefined){
            if (!potentialCapturedPiece.IS_CURRENTLY_MOVING()){
                Game.previousMove.SetValues(held,vec,currentPieceOriginalPos);
                Board.VSet(vec,held);
                Board.SetHeld(None);
                Game.capturedPieces.push(potentialCapturedPiece);
                Game.CompleteTurn(currentValidPositions);
                currentPieceOriginalPos = undefined;
                return;
            }
        }
        else{
            Game.previousMove.SetValues(held,vec,currentPieceOriginalPos);
            Board.VSet(vec,held);
            Board.SetHeld(None);
            Game.CompleteTurn(currentValidPositions);
            currentPieceOriginalPos = undefined;
        }
    }
    else{
        let potentialPickedPiece = Board.VGet(vec);
        if (Board.RESTRICTION_TYPE != "CLOSED"){
            if (potentialPickedPiece.FEN !== undefined){
                if (Board.boardRestrictions[x][y] != "TOTALPIN"){
                    if (potentialPickedPiece.IS_CURRENTLY_MOVING()){
                        Board.ResetBoardSquareColorAll();
                        Board.VSet(vec,None);
                        Board.SetHeld(potentialPickedPiece);
                        currentPieceOriginalPos = vec;
                        currentValidPositions = potentialPickedPiece.GetPositions(x,y).filter(pos => Board.VecIsInBounds(pos));
                        currentValidPositions.forEach(pos => {
                            Board.SetBoardSquareColor(pos.x,pos.y,"button cellMove");
                        });
                        return;
                    }
                }
            }
        }
        else if (Board.GetRestriction(vec).length > 0){
            Board.ResetBoardSquareColorAll();
            Board.VSet(vec,None);
            Board.SetHeld(potentialPickedPiece);
            currentPieceOriginalPos = vec;
            currentValidPositions = Board.GetRestriction(vec);
            currentValidPositions.forEach(pos => {
                Board.SetBoardSquareColor(pos.x,pos.y,"button cellMove");
            });
            return;
        }

    }
}
function UpdateCheckStatus(){
    let attacked = GetAttackedPositions(!Game.turn);
    let isInCheck = false;
    let checkMate = false;
    let CheckedPos = undefined;
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 8; y++){
            if (CheckedPos != undefined){
                break;
            }
            let piece = Board.board[x][y];
            if (piece.TYPE == "KING" && piece.IS_WHITE == Game.turn){
                CheckedPos = {x:x,y:y};
                attacked.forEach(pos => {
                    if (pos.x == CheckedPos.x && pos.y == CheckedPos.y){
                        isInCheck = true;
                    }
                });
            }
        }
    }
    console.log(isInCheck);
    if (!isInCheck){
        return;
    }
    else{
        let kingposes = Board.VGet(CheckedPos).GetPositions(CheckedPos.x,CheckedPos.y);
        kingposes.push(CheckedPos);
        let attacked2 = GetAttackedPositionsIndividual(!Game.turn);
        let blocked = GetAttackedPositionsIndividual(Game.turn);
        let trimmedattacks = [];
        for (let x = 0; x < 8; x++){
            attacked2[x].forEach(piece => {
                kingposes.forEach(kpos => {
                    piece.POSES.forEach(pos => {
                        if (Vector.Equal(pos,kpos)){
                            trimmedattacks.push(piece);
                        }
                    });
                });
            });
        }
        let toremove = [];
        for (let i = 0; i < trimmedattacks.length; i++){
            for (let x = 0; x < 8; x++){
                blocked[x].forEach(piece => {
                    piece.POSES.forEach(pos => {
                        if (Vector.Equal(pos,trimmedattacks[i].POS)){
                            Board.AddRestriction(piece.POS,pos);
                            toremove.push(i);
                        }
                    });
                });
            }
            if (trimmedattacks[i].P.BLOCK_TYPE != "CAPTURE"){
                let direction = PositionsSelective(trimmedattacks[i].POS,Vector.Normalize(Vector.Subtract(CheckedPos,trimmedattacks[i].POS)));
                for (let x = 0; x < 8; x++){
                    blocked[x].forEach(piece => {
                        if (piece.P.TYPE != "KING"){
                            piece.POSES.forEach(pos => {
                                direction.forEach(apos =>{
                                    if (Vector.Equal(pos,apos)){
                                        Board.AddRestriction(piece.POS,pos);
                                        toremove.push(i);
                                    }
                                })
                            });
                        }
                    });
                }
            }
        }
        toremove.forEach(int => {
            trimmedattacks.splice(int,1);
        });
        checkMate = trimmedattacks.length > 0;
        if (checkMate){
            Game.GameOver();
            return;
        }
    }
}
function GetAttackedPositionsIndividual(color){
    let AttackedArray = [];
    for (let x = 0; x < 8; x++){
        AttackedArray.push([]);
        for (let y = 0; y < 8; y++){
            let piece = Board.Get(x,y);
            if (piece.IS_WHITE == color){
                AttackedArray[x].push({P:piece,POSES:piece.GetPositions(x,y),POS:{x:x,y:y}});
            }
        }
    }
    return AttackedArray;
}
function GetAttackedPositions(color){
    let AttackedArray = [];
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 8; y++){
            let piece = Board.Get(x,y);
            if (piece.IS_WHITE == color){
                let positions;
                if (piece.TYPE == "PAWN"){
                    positions = piece.GetAttackPositions(x,y);
                }
                else{
                    if (piece.TYPE != "KING"){
                        positions = piece.GetPositions(x,y);
                    }
                    else{
                        positions = piece.GetPositions(x,y,false,false);
                    }
                }
                positions.forEach(pos => {
                    if (AttackedArray.length > 0){
                        if (!Vector.Contains(AttackedArray,pos)){
                            AttackedArray.push({x:pos.x,y:pos.y});
                        }
                    }
                    else{
                        AttackedArray.push({x:pos.x,y:pos.y});
                    }
                });
            }
        }
    }
    return AttackedArray;
}
function DrawBoardHTML(){
    for (let y = 0; y < 8; y++){
        let element = document.getElementById(`BoardRow:${y}`);
        for (let x = 0; x < 8; x++){
            let strpos = `(${x},${y})`;
            let buttonid = `GridCell:${strpos}`;
            let z = (x % 2) + 1;
            if (y % 2 == 0){
                z = z == 2 ? 1 : 2;
            }
            let buttonclass = `"button cell${z}"`;
            let onclick = `TransferPiece${strpos}`;
            let imgid = `Pieceimg:${strpos}`;
            element.innerHTML += `<button class= ${buttonclass} onclick=${onclick} id = ${buttonid}></button>`
            document.getElementById(buttonid).innerHTML += `<img src="img/none.png" alt="!" id=${imgid} class="pieceIMG"></img>`
        }
    }
}


Game.Start();