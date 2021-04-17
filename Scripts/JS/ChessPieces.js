"use strict";
// some extraneous variables used to define more about the piece class
var PieceType;
(function (PieceType) {
    PieceType[PieceType["Pawn"] = 0] = "Pawn";
    PieceType[PieceType["Bishop"] = 1] = "Bishop";
    PieceType[PieceType["Knight"] = 2] = "Knight";
    PieceType[PieceType["Rook"] = 3] = "Rook";
    PieceType[PieceType["Queen"] = 4] = "Queen";
    PieceType[PieceType["King"] = 5] = "King";
    PieceType[PieceType["None"] = 6] = "None";
})(PieceType || (PieceType = {}));
var BlockType;
(function (BlockType) {
    BlockType[BlockType["Line"] = 0] = "Line";
    BlockType[BlockType["Capture"] = 1] = "Capture";
    BlockType[BlockType["None"] = 2] = "None";
})(BlockType || (BlockType = {}));
class PosArgs {
    constructor(color, overlap, prune) {
        this.Color = color;
        this.Overlap = overlap;
        this.Prune = prune;
    }
    static empty(color) {
        return new PosArgs(color, false, true);
    }
}
// contains all of the information needed to define how a piece works
class Piece {
    constructor(path, fen, is_white, can_be_blocked, type, block_type, reg_pos, attack_pos) {
        this.Path = path;
        this.Fen = fen;
        this.IsWhite = is_white;
        this.CanBeBlocked = can_be_blocked;
        this.Type = type;
        this.BlockType = block_type;
        this.GetPositions = reg_pos;
        this.GetAttacks = attack_pos;
    }
    IsCurrentlyMoving() {
        return Game.turn == this.IsWhite;
    }
}
class PieceBinding {
    constructor(piece, poses, pos) {
        this.Poses = poses;
        this.Piece = piece;
        this.Pos = pos;
    }
}
// The data for each piece the game will use.
const None = new Piece("img/none.png", "", false, false, PieceType.None, BlockType.None, NonePositions, NonePositions);
const BlackBishop = new Piece("img/BB.png", "b", false, true, PieceType.Bishop, BlockType.Line, BishopPositions, BishopPositions);
const WhiteBishop = new Piece("img/WB.png", "B", true, true, PieceType.Bishop, BlockType.Line, BishopPositions, BishopPositions);
const BlackKnight = new Piece("img/BKN.png", "n", false, false, PieceType.Knight, BlockType.Capture, KnightPositions, KnightPositions);
const WhiteKnight = new Piece("img/WKN.png", "N", true, false, PieceType.Knight, BlockType.Capture, KnightPositions, KnightPositions);
const BlackRook = new Piece("img/BR.png", "r", false, true, PieceType.Rook, BlockType.Line, RookPositions, RookPositions);
const WhiteRook = new Piece("img/WR.png", "R", true, true, PieceType.Rook, BlockType.Line, RookPositions, RookPositions);
const BlackPawn = new Piece("img/BP.png", "p", false, false, PieceType.Pawn, BlockType.Capture, PawnPositions, PawnAttacks);
const WhitePawn = new Piece("img/WP.png", "P", true, false, PieceType.Pawn, BlockType.Capture, PawnPositions, PawnAttacks);
const BlackQueen = new Piece("img/BQ.png", "q", false, true, PieceType.Queen, BlockType.Line, QueenPositions, QueenPositions);
const WhiteQueen = new Piece("img/WQ.png", "Q", true, true, PieceType.Queen, BlockType.Line, QueenPositions, QueenPositions);
const BlackKing = new Piece("img/BK.png", "k", false, false, PieceType.King, BlockType.None, KingPositions, KingPositions);
const WhiteKing = new Piece("img/WK.png", "K", true, false, PieceType.King, BlockType.None, KingPositions, KingPositions);
const pieces = [BlackBishop, WhiteBishop, BlackKing, WhiteKing, BlackKnight, WhiteKnight, BlackPawn, WhitePawn, BlackQueen, WhiteQueen, BlackRook, WhiteRook, None];
function BishopPositions(vec, Args) {
    let positions = [];
    for (let xdir = 1; xdir > -2; xdir -= 2) {
        for (let ydir = 1; ydir > -2; ydir -= 2) {
            let dir = new Vector2(xdir, ydir);
            let iter = vec.Add(dir);
            let finished = false;
            while (!finished) {
                if (Game.board.IsInBounds(iter)) {
                    let piece = Game.board.Get(iter);
                    if (piece == None) {
                        positions.push(iter);
                        iter = iter.Add(dir);
                        continue;
                    }
                    else if (!Args.Overlap ? piece.IsWhite != Args.Color : piece != None) {
                        positions.push(iter);
                        iter = iter.Add(dir);
                        finished = true;
                    }
                }
                finished = true;
            }
        }
    }
    return positions;
}
function KnightPositions(vec, Args) {
    let positions = [new Vector2(2, 1), new Vector2(2, -1), new Vector2(-2, 1), new Vector2(-2, -1), new Vector2(1, 2), new Vector2(1, -2), new Vector2(-1, 2), new Vector2(-1, -2)];
    for (let i = 0; i < positions.length; i++) {
        positions[i].AddSelf(vec);
    }
    let prunedPositions = [];
    for (let i = 0; i < positions.length; i++) {
        if (Game.board.IsInBounds(positions[i])) {
            let piece = Game.board.Get(positions[i]);
            if (piece == None) {
                prunedPositions.push(positions[i]);
            }
            else if (!Args.Overlap ? piece.IsWhite != Args.Color : true) {
                prunedPositions.push(positions[i]);
            }
        }
    }
    return prunedPositions;
}
function RookPositions(vec, Args) {
    let positions = [];
    for (let z = 0; z < 2; z++) {
        for (let zdir = 1; zdir > -2; zdir -= 2) {
            let zn = (z == 0 ? vec.y : vec.x) + zdir;
            let finished = false;
            while (!finished) {
                let iter = z == 0 ? new Vector2(vec.x, zn) : new Vector2(zn, vec.y);
                if (Game.board.IsInBounds(iter)) {
                    let piece = Game.board.Get(iter);
                    if (piece == None) {
                        positions.push(iter);
                        zn += zdir;
                        continue;
                    }
                    else if (!Args.Overlap ? piece.IsWhite != Args.Color : piece != None) {
                        positions.push(iter);
                        zn += zdir;
                        finished = true;
                    }
                }
                finished = true;
            }
        }
    }
    return positions;
}
function PawnPositions(vec, Args) {
    let positions = [];
    let ydir = Args.Color ? -1 : 1;
    let indir = new Vector2(vec.x, vec.y + ydir, ["enpassant_"]);
    if (Game.board.IsInBounds(indir)) {
        // move forward
        if (Game.board.Get(indir) == None) {
            positions.push(indir);
        }
        // special start move forward
        if (vec.y == (Args.Color ? 6 : 1)) {
            let double = new Vector2(vec.x, vec.y + ydir * 2, ["enpassant_"]);
            if (Game.board.Get(indir) == None && Game.board.Get(double) == None) {
                positions.push(double);
            }
        }
        let pos = new Vector2(vec.x, vec.y + ydir);
        if (Game.board.IsInBounds(pos)) {
            // reg captures
            for (let i = 1; i > -2; i -= 2) {
                let attack_pos = new Vector2(vec.x + i, vec.y + ydir, ["enpassant_"]);
                if (Game.board.IsInBounds(attack_pos)) {
                    let piece = Game.board.Get(attack_pos);
                    if (piece != None) {
                        if (!Args.Overlap ? !piece.IsCurrentlyMoving() : true) {
                            positions.push(attack_pos);
                        }
                    }
                }
            }
            // en-passants
            if (Game.previousMove.INITIALIZED) {
                for (let i = 1; i > -2; i -= 2) {
                    let attack_pos = new Vector2(vec.x + i, vec.y);
                    if (Game.board.IsInBounds(attack_pos)) {
                        if (Game.board.Get(attack_pos).Type == PieceType.Pawn) {
                            if (Game.previousMove.PIECE.Type == PieceType.Pawn) {
                                if (Game.previousMove.PREVPOSITION.y == (Args.Color ? 1 : 6)) {
                                    if (Game.previousMove.POSITION.y == (Args.Color ? 3 : 4)) {
                                        if (Game.previousMove.POSITION.Equal(attack_pos)) {
                                            positions.push(new Vector2(vec.x + i, vec.y + ydir, ["enpassant-"]));
                                        }
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
function QueenPositions(vec, Args) {
    let positions = [];
    for (let xdir = 1; xdir > -2; xdir--) {
        for (let ydir = 1; ydir > -2; ydir--) {
            let dir = new Vector2(xdir, ydir);
            let iter = vec.Add(dir);
            let finished = false;
            while (!finished) {
                if (!dir.Equal(Vector2.zero)) {
                    if (Game.board.IsInBounds(iter)) {
                        let piece = Game.board.Get(iter);
                        if (piece == None) {
                            positions.push(iter);
                            iter = iter.Add(dir);
                            continue;
                        }
                        else if (!Args.Overlap ? piece.IsWhite != Args.Color : true) {
                            positions.push(iter);
                            iter = iter.Add(dir);
                            finished = true;
                        }
                    }
                }
                finished = true;
            }
        }
    }
    return positions;
}
function KingPositions(vec, Args) {
    let positions = [Vector2.up, Vector2.down, Vector2.left, Vector2.right, Vector2.upLeft, Vector2.upRight, Vector2.downLeft, Vector2.downRight];
    for (let i = 0; i < positions.length; i++) {
        positions[i] = positions[i].Add(vec);
    }
    let prunedPositions = [];
    for (let i = 0; i < positions.length; i++) {
        if (Game.board.IsInBounds(positions[i])) {
            let piece = Game.board.Get(positions[i]);
            if (Args.Prune) {
                let attacked = GetAttackedPositions(!Args.Color);
                if (piece == None) {
                    if (!positions[i].Contains(attacked)) {
                        prunedPositions.push(positions[i]);
                    }
                }
                else if (piece.IsWhite != Args.Color || Args.Overlap) {
                    if (!PieceIsSupported(positions[i])) {
                        prunedPositions.push(positions[i]);
                    }
                }
            }
            else {
                if (piece == None) {
                    prunedPositions.push(positions[i]);
                }
                else if (piece.IsWhite != Args.Color || Args.Overlap) {
                    prunedPositions.push(positions[i]);
                }
            }
        }
    }
    return prunedPositions;
}
function PositionsSelective(pos, dir, color) {
    let positions = [];
    let iter = pos.Add(dir);
    let finished = false;
    while (!finished) {
        if (Game.board.IsInBounds(iter)) {
            let piece = Game.board.Get(iter);
            if (piece == None) {
                positions.push(iter);
                iter = iter.Add(dir);
                continue;
            }
            else if (piece.IsWhite != color) {
                positions.push(iter);
                iter = iter.Add(dir);
                finished = true;
            }
        }
        finished = true;
    }
    return positions;
}
function PieceIsSupported(vec) {
    let originalPiece = Game.board.Get(vec);
    if (originalPiece != None) {
        let color = originalPiece.IsWhite;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let checkedpos = new Vector2(x, y);
                if (!vec.Equal(checkedpos)) {
                    let piece = Game.board.Get(checkedpos);
                    if (piece != None) {
                        if (piece.IsWhite == color) {
                            let flag = false;
                            flag = vec.Contains(piece.GetAttacks(checkedpos, new PosArgs(piece.IsWhite, true, false)));
                            if (flag) {
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
function PawnAttacks(vec, Args) {
    let positions = [];
    let ydir = Args.Color ? -1 : 1;
    let pos = new Vector2(vec.x, vec.y + ydir);
    if (Game.board.IsInBounds(pos)) {
        // reg captures
        for (let i = 1; i > -2; i -= 2) {
            let attack_pos = new Vector2(vec.x + i, vec.y + ydir, ["enpassant_"]);
            if (Game.board.IsInBounds(attack_pos)) {
                if (!Args.Overlap ? !Game.board.Get(vec).IsCurrentlyMoving() : true) {
                    positions.push(attack_pos);
                }
            }
        }
        // en-passants
        if (Game.previousMove.INITIALIZED) {
            for (let i = 1; i > -2; i -= 2) {
                let attack_pos = new Vector2(vec.x + i, vec.y);
                if (Game.board.IsInBounds(attack_pos)) {
                    if (Game.board.Get(attack_pos).Type == PieceType.Pawn) {
                        if (Game.previousMove.PIECE.Type == PieceType.Pawn) {
                            if (Game.previousMove.PREVPOSITION.y == (Args.Color ? 1 : 6)) {
                                if (Game.previousMove.POSITION.y == (Args.Color ? 3 : 4)) {
                                    if (Game.previousMove.POSITION.Equal(attack_pos)) {
                                        positions.push(new Vector2(vec.x + i, vec.y + ydir, ["enpassant-"]));
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
function NonePositions(vec, Args) {
    return Args.Color ? [vec] : [];
}
