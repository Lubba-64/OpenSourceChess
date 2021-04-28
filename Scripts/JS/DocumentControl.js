"use strict";
// controls HTML elements
let capturesUIIsActive = true;
// moves the mouse image to the position of the mouse cursor
document.onmousemove = function (e) {
    var mouse = document.getElementById('HeldPieceIMG');
    var limitfactor = 0.9;
    var MousePos = new Vector2(clampNumber(e.clientX, 0, window.innerWidth * limitfactor), clampNumber(e.clientY, 0, window.innerHeight * limitfactor));
    mouse.style.marginLeft = (MousePos.x) + "px";
    mouse.style.marginTop = (MousePos.y) + "px";
};
window.onresize = function () {
    RefreshPlacementCSS(new Vector2(window.innerWidth, window.innerHeight));
};
// draws the chess board.
function DrawBoardHTML() {
    let element = document.getElementById("boardContainerMain");
    for (let y = 0; y < 8; y++) {
        // adds a row container for every y position
        let rowid = `BoardRow:${y}`;
        element.innerHTML += `<div class="rowContainer" id="${rowid}"></div>`;
        let row = document.getElementById(rowid);
        // adds a cell 8 times per row, with a button and image element
        for (let x = 0; x < 8; x++) {
            let strpos = `(${x},${y})`;
            let buttonid = `GridCell:${strpos}`;
            let z = GetOriginalCellColor(new Vector2(x, y));
            let buttonclass = `"button cell${z}"`;
            let onclick = `TransferPiece${strpos}`;
            let imgid = `Pieceimg:${strpos}`;
            row.innerHTML += `<button class=${buttonclass} onclick=${onclick} id=${buttonid}></button>`;
            document.getElementById(buttonid).innerHTML += `<img src="img/none.png" alt="!" id=${imgid} class="pieceIMG"></img>`;
        }
    }
}
// adds a captured piece to the captured UI
function AddCapturedPiece(piece) {
    var element = `<img src="${piece.Path}" alt="!" class="pieceIMGMini">`;
    document.getElementById(`capturedPieces${piece.IsWhite ? "White" : "Black"}`).innerHTML += element;
}
// resets the captured piece UI
function ResetCaptures() {
    document.getElementById(`capturedPiecesWhite`).innerHTML = "";
    document.getElementById(`capturedPiecesBlack`).innerHTML = "";
}
// disables the overlay UI for either promotions or end of game situations
function DisableOverlayUI() {
    let element = document.getElementById("boardOverlayContainer");
    element.setAttribute("style", "display: none;");
}
// enables the overlay UI for either promotions or end of game situations
function EnableOverlayUI() {
    let element = document.getElementById("boardOverlayContainer");
    element.setAttribute("style", "");
}
// enables the checkmate specific UI
function EnableCheckmateUI(color) {
    EnableOverlayUI();
    let promotion = document.getElementById("promotionDiv");
    promotion.setAttribute("style", "display: none;");
    let checkmate = document.getElementById("CheckmateDiv");
    checkmate.setAttribute("style", "");
    let winnertext = document.getElementById("WinnerTXT");
    winnertext.innerHTML = `${color ? "White" : "Black"} Won!`;
}
// enables the promotion UI
function EnablePromotionUI(color) {
    EnableOverlayUI();
    let checkmate = document.getElementById("CheckmateDiv");
    checkmate.setAttribute("style", "display: none;");
    let promotion = document.getElementById("promotionDiv");
    promotion.setAttribute("style", "");
    ResetPromotionOptionsContainer();
    AddPieceToPromotionOptionsContainer(color ? WhiteQueen : BlackQueen);
    AddPieceToPromotionOptionsContainer(color ? WhiteRook : BlackRook);
    AddPieceToPromotionOptionsContainer(color ? WhiteBishop : BlackBishop);
    AddPieceToPromotionOptionsContainer(color ? WhiteKnight : BlackKnight);
}
// adds a promotion option to the container
function AddPieceToPromotionOptionsContainer(piece) {
    let element = document.getElementById("promotionOptionsContainer");
    element.innerHTML += `<button onclick=CompletePromotion("${piece.Path}") class="promotionButton"><img src="${piece.Path}" alt="!" class="pieceIMG"></button>`;
}
// resets the promotion container
function ResetPromotionOptionsContainer() {
    let element = document.getElementById("promotionOptionsContainer");
    element.innerHTML = "";
}
// sets the capture UI's active state
function SetCapturesActive(active) {
    let element = document.getElementById("leftSideBar");
    element.setAttribute("style", active ? "" : "display: none;");
}
function GetOriginalCellColor(vec) {
    let z = (vec.x % 2) + 1;
    if (vec.y % 2 == 0) {
        z = z == 2 ? 1 : 2;
    }
    return z;
}
