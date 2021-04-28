// the FEN string for the starting position for the chess board.
const startingfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
// some global game vars.
let currentValidPositions: Vector2[];
let currentPieceOriginalPos: Vector2;
let promotedpos: Vector2;
enum BoardRestrictionType{
    Free,
    Closed
}
// the class that contains all of the board logic, plus the stored state of the board.
class Board{
    boardSize: number;
    boardRestrictions: Vector2[][][];
    board: Piece[][];
    RestrictionType: BoardRestrictionType;
    Held: Piece;
    // initializes the board and restrictions with empty cells, and other vars.
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
    // adds a movement restiction to a specific piece.
    AddRestriction (torestrict: Vector2,position: Vector2): void{
        this.RestrictionType = BoardRestrictionType.Closed;
        if (this.IsInBounds(torestrict)){
            this.boardRestrictions[torestrict.x][torestrict.y].push(position);
        }
    }
    // gets the restriction for that piece
    GetRestriction (vec: Vector2): Vector2[]{
        if (this.IsInBounds(vec)){
            return this.boardRestrictions[vec.x][vec.y];
        }
        return [];
    }
    // clears all restrictions
    ClearRestrictions (): void{
        this.RestrictionType = BoardRestrictionType.Free;
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.boardRestrictions[x][y] = [];
            }
        }
    }
    // gets a piece for a specific position
    Get (vec: Vector2): Piece{
        return this.board[vec.x][vec.y];
    }
    // sets the piece at a specific position and updates the board HTML with the piece image
    Set (vec: Vector2,piece: Piece): void{
        this.board[vec.x][vec.y] = piece;
        document.getElementById(`Pieceimg:(${vec.x},${vec.y})`)!.setAttribute('src',piece.Path);
    }
    // same as get for the board except with the held piece.
    GetHeld (): Piece{
        return this.Held;
    }
    SetHeld (piece: Piece): void{
        this.Held = piece;
        document.getElementById(`HeldPieceIMG`)!.setAttribute('src',piece.Path);
    }
    // is a position within the board?
    IsInBounds (vec: Vector2): boolean{
        return (((vec.x > -1) && (vec.x < 8))&& ((vec.y > -1) && (vec.y < 8)));
    }
    // sets the color of a cell on the board
    SetBoardCellColor (vec: Vector2,cssclass: string){
        document.getElementById(`GridCell:(${vec.x},${vec.y})`)!.setAttribute('class',cssclass);
    }
    // resets a boards cell color to its default state
    ResetBoardCellColor (vec: Vector2){
        document.getElementById(`GridCell:(${vec.x},${vec.y})`)!.setAttribute('class',`button cell${GetOriginalCellColor(vec)}`);
    }
    // resets all of the board's cell colors to their default states.
    ResetBoardCellColorAll (){
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                this.ResetBoardCellColor(new Vector2(x,y));
            }
        }
    }
    // clears the entire board.
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
    // starts the game and resets all of the gamestate
    Start: function() : void{
        this.turn = true;
        this.SetPause(false);
        this.board.Clear()
        ParseAndDisplayFen(startingfen);
        this.board.ClearRestrictions();
        DisableOverlayUI();
        ResetCaptures();
    },
    // do cleanup after a player has moved
    CompleteTurn: function(positions : Vector2[]) : void{
        if (this.board.RestrictionType == BoardRestrictionType.Closed){
            this.board.ClearRestrictions();
        }
        positions.forEach(pos => {
            this.board.ResetBoardCellColor(pos);
        });
        this.turn = !this.turn;
        let checked = CheckForPiecePromotions();
        if (checked){
            return;
        }
        UpdateCheckStatus();
    },
    // enable the game over UI
    GameOver: function(color: boolean){
        Game.SetPause(true);
        EnableCheckmateUI(!color);
    },
    SetPause: function(bool: boolean) {
        this.IsPaused = bool;
    }
}
// gets a piece object from a fen string
function GetPieceFromFen(fen : string) : Piece{
    let Piece = None;
    pieces.forEach(piece => {
        if(piece.Fen == fen){
            Piece = piece;
        }
    });
    return Piece;
}
// gets a piece object from its associatedc image path
function GetPieceFromPath(path: string) : Piece{
    let Piece = None;
    pieces.forEach(piece => {
        if(piece.Path == path){
            Piece = piece;
        }
    });
    return Piece;
}
// parses and displays a fen string on the gameboard.
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
// transfers a piece to a specific position, when the player clicks on a cell.
function TransferPiece(x:number,y:number){
    if (!Game.IsPaused){
        let vec = new Vector2(x,y);
        // if the position to move was the position the piece started in, reset the piece.
        if (currentPieceOriginalPos != undefined){
            if (vec.Equal(currentPieceOriginalPos)){
                Game.board.Set(vec,Game.board.GetHeld());
                Game.board.SetHeld(None);
                currentValidPositions.forEach(pos => {
                    Game.board.ResetBoardCellColor(pos);
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
            // if the player isn't holding anything and this cell isn't empty, add it to the player's hand and record the valid movement positions 
            // (if there are any, if not it wont be picked up)
            let potentialPickedPiece = Game.board.Get(vec);
            if (Game.board.RestrictionType != BoardRestrictionType.Closed){
                if (potentialPickedPiece != None){
                    if (!Vector2.downLeft.Contains(Game.board.boardRestrictions[x][y])){
                        if (potentialPickedPiece.IsCurrentlyMoving()){
                            Game.board.ResetBoardCellColorAll();
                            Game.board.Set(vec,None);
                            Game.board.SetHeld(potentialPickedPiece);
                            currentPieceOriginalPos = vec;
                            currentValidPositions = potentialPickedPiece.GetPositions(vec,PosArgs.empty(potentialPickedPiece.IsWhite)).filter(pos => Game.board.IsInBounds(pos));
                            currentValidPositions.forEach(pos => {
                                Game.board.SetBoardCellColor(pos,"button cellMove");
                            });
                            return;
                        }
                    }
                }
            }
            // if the board has restrictions it does somethign different because there isn't free movement.
            // instead take the precalculated valid positions and check and see if this piece can move with those.
            else if (Game.board.GetRestriction(vec).length > 0){
                Game.board.ResetBoardCellColorAll();
                Game.board.Set(vec,None);
                Game.board.SetHeld(potentialPickedPiece);
                currentPieceOriginalPos = vec;
                currentValidPositions = Game.board.GetRestriction(vec);
                currentValidPositions.forEach(pos => {
                    Game.board.SetBoardCellColor(pos,"button cellMove");
                });
                return;
            }
        }
    }
}
// resets a piece to its original position before the player picked it up.
function ResetPiece(){
    if (Game.board.GetHeld() != None){
        Game.board.Set(currentPieceOriginalPos,Game.board.GetHeld());
        Game.board.SetHeld(None);
        currentValidPositions.forEach(pos => {
            Game.board.ResetBoardCellColor(pos);
        });
        currentPieceOriginalPos = Vector2.downLeft;
    }
}
// the long and arduous function for checking if a player is in check, or checkmate on any given move.
function UpdateCheckStatus(){
    let attacked = GetAttackedPositions(!Game.turn);
    let isInCheck = false;
    let checkMate = false;
    let CheckedPos = Vector2.downLeft;
    // first, detect checkmate by checking the king's position against the list of the attacked enemy positions
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
        // if that passes we're in check. now to restrict the movement of pieces so the player will
        // be forced to avoid check on their turn if they can (so its legal)

        // initializes the vars for the kingpos, kingmovement, attacks, and blocks
        let king = Game.board.Get(CheckedPos);
        let kingposes = king.GetPositions(CheckedPos,PosArgs.empty(king.IsWhite));
        kingposes.push(CheckedPos);
        let attacked2 = GetAttackedPositionsIndividual(!Game.turn, false);
        let blocked = GetAttackedPositionsIndividual(Game.turn, true);
        let prunedattacks: PieceBinding[] = [];

        // prunes the list of attacks to attacks that threate the king
        for (let x = 0; x < 8; x++){
            attacked2.forEach(piece => {
                kingposes.forEach(kpos => {
                    let isrepeated = false;
                    prunedattacks.forEach(binding =>{
                        if (binding.Pos == piece.Pos){
                            isrepeated = true;
                        }
                    });
                    if (!isrepeated){
                        piece.Poses.forEach(pos => {
                            if (pos.Equal(kpos)){
                                prunedattacks.push(piece);
                            }
                        });
                    }
                });
            });
        }
        // for each attack, check and see if there are any moves the defending can make to block all incoming attacks.
        // this needs to be case specific because pieces move differently and therefore need different block checks
        let toremove: number[] = [];
        for (let i = 0; i < prunedattacks.length; i++){
            for (let x = 0; x < 8; x++){
                blocked.forEach(piece => {
                    piece.Poses.forEach(pos => {
                        if (pos.Equal(prunedattacks[i].Pos)){
                            Game.board.AddRestriction(piece.Pos,pos);
                            toremove.push(i);
                        }
                    });
                });
            }
            if (prunedattacks[i].Piece.BlockType != BlockType.Capture){
                let direction = PositionsSelective(prunedattacks[i].Pos,CheckedPos.Subtract(prunedattacks[i].Pos).IntNormalize().MultiplyNum(-1),prunedattacks[i].Piece.IsWhite);
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
        // if the doubly pruned attacks, through king only interference AND through blocks is more than one, checkmate. otherwise return.
        toremove.forEach(int => {
            prunedattacks.splice(int,1);
        });
        checkMate = prunedattacks.length > 0;
        if (checkMate){
            Game.GameOver(king.IsWhite);
            return;
        }
    }
}
// gets the attacked positions for each individual piece, because sometimes having an abstracted list of the positions isn't enough
function GetAttackedPositionsIndividual(color: boolean, includemoves: boolean): PieceBinding[]{
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
// returns an array of all individually attacked positions on the board.
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
// checks the board for piece promotions, and if there are any, initiates the ui sequence for promoting that specific piece.
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
// signals that the promotion is complete and the gamestate can be restored.
function CompletePromotion(piecePath: string) {
    DisableOverlayUI();
    Game.board.Set(promotedpos,GetPieceFromPath(piecePath));
    Game.SetPause(false);
    UpdateCheckStatus();
}