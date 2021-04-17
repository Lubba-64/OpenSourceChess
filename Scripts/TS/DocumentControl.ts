let capturesUIIsActive = true;
document.onmousemove = function(e){ 
    var mouse = document.getElementById('HeldPieceIMG')!;
    var limitfactor = 0.9;
    var MousePos = new Vector2(clampNumber(e.clientX,0,window.innerWidth*limitfactor),clampNumber(e.clientY,0,window.innerHeight*limitfactor));
    mouse.style.marginLeft = (MousePos.x)+"px";
    mouse.style.marginTop = (MousePos.y)+"px";
}
window.onresize = function() {
    RefreshPlacementCSS(new Vector2(window.innerWidth,window.innerHeight));
};

function DrawBoardHTML(){
    let element = document.getElementById("boardContainerMain")!;
`    $(".boardContainer").on( {
        'mouseleave':ResetPiece
     });
`
    for (let y = 0; y < 8; y++){
        let rowid = `BoardRow:${y}`;
        element.innerHTML += `<div class="rowContainer" id="${rowid}"></div>`
        let row = document.getElementById(rowid)!;
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
            row.innerHTML += `<button class= ${buttonclass} onclick=${onclick} id = ${buttonid}></button>`
            document.getElementById(buttonid)!.innerHTML += `<img src="img/none.png" alt="!" id=${imgid} class="pieceIMG"></img>`
        }
    }
}
function AddCapturedPiece(piece:Piece): void{
    var element = `<img src="${piece.Path}" alt="!" class="pieceIMGMini">`
    document.getElementById(`capturedPieces${piece.IsWhite ? "White": "Black"}`)!.innerHTML += element;
}
function ResetCaptures() {
    document.getElementById(`capturedPiecesWhite`)!.innerHTML = "";
    document.getElementById(`capturedPiecesBlack`)!.innerHTML = "";
}
function DisableOverlayUI(){
    let element = document.getElementById("boardOverlayContainer")!;
    element.setAttribute("style","display: none;");
}
function EnableOverlayUI(){
    let element = document.getElementById("boardOverlayContainer")!;
    element.setAttribute("style","");
}
function EnableCheckmateUI(color: boolean) {
    EnableOverlayUI();
    let promotion = document.getElementById("promotionDiv")!;
    promotion.setAttribute("style","display: none;");
    let checkmate = document.getElementById("CheckmateDiv")!;
    checkmate.setAttribute("style","");
    let winnertext = document.getElementById("WinnerTXT")!;
    winnertext.innerHTML = `${color?"White":"Black"} Won!`;
}
function EnablePromotionUI(color: boolean) {
    EnableOverlayUI();
    let checkmate = document.getElementById("CheckmateDiv")!;
    checkmate.setAttribute("style","display: none;");
    let promotion = document.getElementById("promotionDiv")!;
    promotion.setAttribute("style","");
    ResetPromotionOptionsContainer();
    AddPieceToPromotionOptionsContainer(color ? WhiteQueen: BlackQueen);
    AddPieceToPromotionOptionsContainer(color ? WhiteRook: BlackRook);
    AddPieceToPromotionOptionsContainer(color ? WhiteBishop: BlackBishop);
    AddPieceToPromotionOptionsContainer(color ? WhiteKnight: BlackKnight);
}
function AddPieceToPromotionOptionsContainer(piece: Piece){
    let element = document.getElementById("promotionOptionsContainer")!;
    element.innerHTML += `<button onclick=CompletePromotion("${piece.Path}") class="promotionButton"><img src="${piece.Path}" alt="!" class="pieceIMG"></button>`
}
function ResetPromotionOptionsContainer(){
    let element = document.getElementById("promotionOptionsContainer")!;
    element.innerHTML = "";
}
function SetCapturesActive(active: boolean){
    let element = document.getElementById("leftSideBar")!;
    element.setAttribute("style",active ? "" : "display: none;");
}