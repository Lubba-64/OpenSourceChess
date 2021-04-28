// this entire file is for managing the sizing of CSS. this should all be refactored out but hey, its what you do when you HATE the frontend.


type numGetter= ()=>number;
class CSSSizeVar{
    _var:string;
    numEquation:numGetter;
    constructor(_var: string,value:numGetter){
        this._var = `--${_var}`;
        this.numEquation = () => 5;
        this.SetVar(value);
    }
    SetVar(setTo:numGetter){
        this.numEquation = setTo;
        this.UpdateVar();
    }
    UpdateVar(){
        
        document.documentElement.style.setProperty(this._var,`${this.numEquation()}px`);
    }
}
let cellSize = 100;
let miniMargain = 5;
function GetBoardSize(){return cellSize*Game.board.boardSize;}
const boardSizeCSS = new CSSSizeVar("boardSize",()=>{return GetBoardSize()+(cellSize/4)});
const cellSizeCSS = new CSSSizeVar("cellSize",()=>{return cellSize});
const pieceSizeCSS = new CSSSizeVar("pieceSize",()=>{return cellSize-(cellSize/5)});
const miniPieceMargainCSS = new CSSSizeVar("miniPieceMargain",()=>{return miniMargain});
const miniPieceSizeCSS = new CSSSizeVar("miniPieceSize",()=>{return cellSize-(cellSize/2+miniMargain*2)});
const sideBarWidthCSS = new CSSSizeVar("sideBarWidth",()=>{return cellSize*2});
const capturedPieceColumnHeightCSS = new CSSSizeVar("capturedPieceColumnHeight",()=>{return GetBoardSize()*0.75});
const sizeVars: CSSSizeVar[] = [boardSizeCSS,cellSizeCSS,pieceSizeCSS,miniPieceMargainCSS,miniPieceSizeCSS,sideBarWidthCSS,capturedPieceColumnHeightCSS];
function RefreshPlacementCSS(windowSize: Vector2){
    let isless = windowSize.x < windowSize.y;
    cellSize = clampNumber((isless ? windowSize.x : windowSize.y) / 10,30,200);
    SetCapturesActive(!isless);
    sizeVars.forEach(sizevar=>{
        sizevar.UpdateVar();
    })
}