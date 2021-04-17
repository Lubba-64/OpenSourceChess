const startingfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
let currentValidPositions: Vector2[];
let currentPieceOriginalPos: Vector2;
let promotedpos: Vector2;
enum BoardRestrictionType{
    Free,
    Closed
}
class Board{
    // x, y
    boardSize: number;
    boardRestrictions: Vector2[][][];
    board: Piece[][];
    RestrictionType: BoardRestrictionType;
    Held: Piece;
    constructor(){
        this.boardSize = 8;
        this.boardRestrictions = [];
        for (let x = 0; x < 8; x++){
            this.boardRestrictions.push([])
            for (let y = 0; y < 8; y++){
                this.boardRestrictions[x].push([])
            }
        }
        this.board = [];
        for (let x = 0; x < 8; x++){
            this.board.push([])
            for (let y = 0; y < 8; y++){
                this.board[x].push(None);
            }
        }
        this.RestrictionType = BoardRestrictionType.Free;
        this.Held = None;
    }
    AddRestriction (torestrict: Vector2,position: Vector2): void{
        this.RestrictionType = BoardRestrictionType.Closed;
        if (this.IsInBounds(torestrict)){
            this.boardRestrictions[torestrict.x][torestrict.y].push(position);
        }
    }
    GetRestriction (vec: Vector2): Vector2[]{
        if (this.IsInBounds(vec)){
            return this.boardRestrictions[vec.x][vec.y];
        }
        return [];
    }
    ClearRestrictions (): void{
        this.RestrictionType = BoardRestrictionType.Free;
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.boardRestrictions[x][y] = [];
            }
        }
    }
    Get (vec: Vector2): Piece{
        return this.board[vec.x][vec.y];
    }
    Set (vec: Vector2,piece: Piece): void{
        this.board[vec.x][vec.y] = piece;
        document.getElementById(`Pieceimg:(${vec.x},${vec.y})`)!.setAttribute('src',piece.Path);
    }
    GetHeld (): Piece{
        return this.Held;
    }
    SetHeld (piece: Piece): void{
        this.Held = piece;
        document.getElementById(`HeldPieceIMG`)!.setAttribute('src',piece.Path);
    }
    IsInBounds (vec: Vector2): boolean{
        return (((vec.x > -1) && (vec.x < 8))&& ((vec.y > -1) && (vec.y < 8)));
    }
    SetBoardSquareColor (vec: Vector2,cssclass: string){
        document.getElementById(`GridCell:(${vec.x},${vec.y})`)!.setAttribute('class',cssclass);
    }
    ResetBoardSquareColor (vec: Vector2){
        let z = (vec.x % 2) + 1;
        if (vec.y % 2 == 0){
            z = z == 2 ? 1 : 2;   
        }
        document.getElementById(`GridCell:(${vec.x},${vec.y})`)!.setAttribute('class',`button cell${z}`);
    }
    ResetBoardSquareColorAll (){
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.ResetBoardSquareColor(new Vector2(x,y));
            }
        }
    }
    Clear (){
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.Set(new Vector2(x,y),None);
            }
        }
    }
}
let Game = {
    board: new Board(),
    turn: true,
    IsPaused: false,
    previousMove: {
        PIECE: None,
        POSITION: Vector2.downLeft,
        PREVPOSITION: Vector2.downLeft,
        INITIALIZED: false,
        SetValues: function(piece : Piece,position : Vector2,prevposition : Vector2){
            this.PIECE =  piece;
            this.POSITION = position;
            this.PREVPOSITION = prevposition;
            this.INITIALIZED = true;
        }
    },
    Start: function() : void{
        this.turn = true;
        this.SetPause(false);
        this.board.Clear()
        ParseAndDisplayFen(startingfen);
        this.board.ClearRestrictions();
        DisableOverlayUI();
        ResetCaptures();
    },
    CompleteTurn: function(positions : Vector2[]) : void{
        if (this.board.RestrictionType == BoardRestrictionType.Closed){
            this.board.ClearRestrictions();
        }
        positions.forEach(pos => {
            this.board.ResetBoardSquareColor(pos);
        });
        this.turn = !this.turn;
        let checked = CheckForPiecePromotions();
        if (checked){
            return;
        }
        UpdateCheckStatus();
    },
    GameOver: function(color: boolean){
        Game.SetPause(true);
        EnableCheckmateUI(!color);
    },
    SetPause: function(bool: boolean) {
        this.IsPaused = bool;
    }
}

function GetPieceFromFen(fen : string) : Piece{
    let Piece = None;
    pieces.forEach(piece => {
        if(piece.Fen == fen){
            Piece = piece;
        }
    });
    return Piece;
}
function GetPieceFromPath(path: string) : Piece{
    let Piece = None;
    pieces.forEach(piece => {
        if(piece.Path == path){
            Piece = piece;
        }
    });
    return Piece;
}
function ParseAndDisplayFen(fen : string) : void{
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
                Game.board.Set(new Vector2(x,y),GetPieceFromFen(fen[fenI]));
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
function TransferPiece(x:number,y:number){
    if (!Game.IsPaused){
        let vec = new Vector2(x,y);
        if (currentPieceOriginalPos != undefined){
            if (vec.Equal(currentPieceOriginalPos)){
                Game.board.Set(vec,Game.board.GetHeld());
                Game.board.SetHeld(None);
                currentValidPositions.forEach(pos => {
                    Game.board.ResetBoardSquareColor(pos);
                });
                currentPieceOriginalPos = Vector2.downLeft;
                return;
            }
        }
        if (Game.board.GetHeld() != None){
            let held = Game.board.GetHeld();
            let isValidPos = false;
            let ValidPos = Vector2.zero;
            currentValidPositions.forEach(pos => {
                if (pos.Equal(vec)){
                    isValidPos = true;
                    ValidPos = pos;
                }
            });
            if (!isValidPos){
                return;
            }
            if (Game.board.Held.Type == PieceType.Pawn){
                if (ValidPos.GetArg("enpassant")){
                    Game.previousMove.SetValues(held,vec,currentPieceOriginalPos);
                    let capturepos = new Vector2(x,y + (Game.turn ? 1 : -1));
                    AddCapturedPiece(Game.board.Get(capturepos));
                    Game.board.Set(capturepos,None);
                    Game.board.Set(vec,held);
                    Game.board.SetHeld(None);
                    Game.CompleteTurn(currentValidPositions);
                    currentPieceOriginalPos = Vector2.downLeft;
                }
            }
            let potentialCapturedPiece = Game.board.Get(vec);
            if (potentialCapturedPiece != None){
                if (!potentialCapturedPiece.IsCurrentlyMoving()){
                    Game.previousMove.SetValues(held,vec,currentPieceOriginalPos);
                    Game.board.Set(vec,held);
                    Game.board.SetHeld(None);
                    AddCapturedPiece(potentialCapturedPiece);
                    Game.CompleteTurn(currentValidPositions);
                    currentPieceOriginalPos = Vector2.downLeft;
                    return;
                }
            }
            else{
                Game.previousMove.SetValues(held,vec,currentPieceOriginalPos);
                Game.board.Set(vec,held);
                Game.board.SetHeld(None);
                Game.CompleteTurn(currentValidPositions);
                currentPieceOriginalPos = Vector2.downLeft;
            }
        }
        else{
            let potentialPickedPiece = Game.board.Get(vec);
            if (Game.board.RestrictionType != BoardRestrictionType.Closed){
                if (potentialPickedPiece != None){
                    if (!Vector2.downLeft.Contains(Game.board.boardRestrictions[x][y])){
                        if (potentialPickedPiece.IsCurrentlyMoving()){
                            Game.board.ResetBoardSquareColorAll();
                            Game.board.Set(vec,None);
                            Game.board.SetHeld(potentialPickedPiece);
                            currentPieceOriginalPos = vec;
                            currentValidPositions = potentialPickedPiece.GetPositions(vec,PosArgs.empty(potentialPickedPiece.IsWhite)).filter(pos => Game.board.IsInBounds(pos));
                            currentValidPositions.forEach(pos => {
                                Game.board.SetBoardSquareColor(pos,"button cellMove");
                            });
                            return;
                        }
                    }
                }
            }
            else if (Game.board.GetRestriction(vec).length > 0){
                Game.board.ResetBoardSquareColorAll();
                Game.board.Set(vec,None);
                Game.board.SetHeld(potentialPickedPiece);
                currentPieceOriginalPos = vec;
                currentValidPositions = Game.board.GetRestriction(vec);
                currentValidPositions.forEach(pos => {
                    Game.board.SetBoardSquareColor(pos,"button cellMove");
                });
                return;
            }
        }
    }
}
function UpdateCheckStatus(){
    let attacked = GetAttackedPositions(!Game.turn);
    let isInCheck = false;
    let checkMate = false;
    let CheckedPos = Vector2.downLeft;
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 8; y++){
            if (CheckedPos != Vector2.downLeft){
                break;
            }
            let piece = Game.board.board[x][y];
            if (piece.Type == PieceType.King && piece.IsCurrentlyMoving()){
                CheckedPos = new Vector2(x,y);
                attacked.forEach(pos => {
                    if (pos.Equal(CheckedPos)){
                        isInCheck = true;
                    }
                });
            }
        }
    }
    if (!isInCheck){
        return;
    }
    else{
        // this is what needs to get fixed
        let king = Game.board.Get(CheckedPos);
        let kingposes = king.GetPositions(CheckedPos,PosArgs.empty(king.IsWhite));
        kingposes.push(CheckedPos);
        let attacked2 = GetAttackedPositionsIndividual(!Game.turn, false);
        let blocked = GetAttackedPositionsIndividual(Game.turn, true);
        let trimmedattacks: PieceBinding[] = [];
        for (let x = 0; x < 8; x++){
            attacked2.forEach(piece => {
                kingposes.forEach(kpos => {
                    let isrepeated = false;
                    trimmedattacks.forEach(binding =>{
                        if (binding.Pos == piece.Pos){
                            isrepeated = true;
                        }
                    });
                    if (!isrepeated){
                        piece.Poses.forEach(pos => {
                            if (pos.Equal(kpos)){
                                trimmedattacks.push(piece);
                            }
                        });
                    }
                });
            });
        }
        let toremove: number[] = [];
        for (let i = 0; i < trimmedattacks.length; i++){
            for (let x = 0; x < 8; x++){
                blocked.forEach(piece => {
                    piece.Poses.forEach(pos => {
                        if (pos.Equal(trimmedattacks[i].Pos)){
                            Game.board.AddRestriction(piece.Pos,pos);
                            toremove.push(i);
                        }
                    });
                });
            }
            if (trimmedattacks[i].Piece.BlockType != BlockType.Capture){
                let direction = PositionsSelective(trimmedattacks[i].Pos,CheckedPos.Subtract(trimmedattacks[i].Pos).IntNormalize().MultiplyNum(-1),trimmedattacks[i].Piece.IsWhite);
                for (let x = 0; x < 8; x++){
                    blocked.forEach(piece => {
                        if (piece.Piece.Type != PieceType.King){
                            piece.Poses.forEach(pos => {
                                direction.forEach(apos =>{
                                    if (pos.Equal(apos)){
                                        Game.board.AddRestriction(piece.Pos,pos);
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
            Game.GameOver(king.IsWhite);
            return;
        }
    }
}
function GetAttackedPositionsIndividual(color: boolean,includemoves: boolean): PieceBinding[]{
    let AttackedArray: PieceBinding[] = [];
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 8; y++){
            let pos = new Vector2(x,y);
            let piece = Game.board.Get(pos);
            if (piece.IsWhite == color){
                if (includemoves){
                    AttackedArray.push(new PieceBinding(piece,piece.GetPositions(pos,PosArgs.empty(piece.IsWhite)),pos));
                }
                else{
                    AttackedArray.push(new PieceBinding(piece,piece.GetAttacks(pos,PosArgs.empty(piece.IsWhite)),pos));
                }

            }
        }
    }
    return AttackedArray;
}
function GetAttackedPositions(color: boolean): Vector2[]{
    let AttackedArray: Vector2[] = [];
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 8; y++){
            let pos = new Vector2(x,y);
            let piece = Game.board.Get(pos);
            if (piece.IsWhite == color){
                let positions: Vector2[];
                if (piece.Type != PieceType.King){
                    positions = piece.GetAttacks(pos,PosArgs.empty(piece.IsWhite));
                }
                else{
                    positions = piece.GetAttacks(pos,new PosArgs(piece.IsWhite,false,false));
                }
                positions.forEach(pos => {
                    if (AttackedArray.length > 0){
                        if (!pos.Contains(AttackedArray)){
                            AttackedArray.push(pos);
                        }
                    }
                    else{
                        AttackedArray.push(pos);
                    }
                });
            }
        }
    }
    return AttackedArray;
}
function ResetPiece(){
    if (Game.board.GetHeld() != None){
        Game.board.Set(currentPieceOriginalPos,Game.board.GetHeld());
        Game.board.SetHeld(None);
        currentValidPositions.forEach(pos => {
            Game.board.ResetBoardSquareColor(pos);
        });
        currentPieceOriginalPos = Vector2.downLeft;
    }
}
function CheckForPiecePromotions(): boolean {
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 2; y++){
            let pos = new Vector2(x,y*7);
            let piece = Game.board.Get(pos)
            let color = y*7 == 0;
            if (piece.IsWhite == color){
                if (piece.Type == PieceType.Pawn){
                    promotedpos = pos;
                    EnablePromotionUI(color);
                    Game.SetPause(true);
                    return true;
                }
            }
        }
    }
    return false;
}
function CompletePromotion(piecePath: string) {
    DisableOverlayUI();
    Game.board.Set(promotedpos,GetPieceFromPath(piecePath));
    Game.SetPause(false);
    UpdateCheckStatus();
}