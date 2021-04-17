document.onmousemove = function(e){ 
    var x = e.clientX; 
    var y = e.clientY; 
    document.getElementById('HeldPieceIMG').style.marginLeft  = x+"px";
    document.getElementById('HeldPieceIMG').style.marginTop  = y+"px";
}