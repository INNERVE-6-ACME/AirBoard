console.log(res1,res2)
function _(selector){
    return document.querySelector(selector);
}

function setup(){
    let canvas = createCanvas(1280,720);
    canvas.parent("#canvas-wrapper");
    background(255);
}

function mouseDragged(){
    let type= "pencil";
    let size = parseInt(_("#pen-size").value);
    let color= _("#pen-color").value;
    fill(color);
    stroke(color);
    if(type == "pencil"){
        strokeWeight(size)
        line(pmouseX=res1.x,pmouseY=res1.y,mouseX=res2.x,mouseY=res2.y);
    }
}

_("#reset-canvas").addEventListener("click",
function(){
    background(255);
});

_("#save-canvas").addEventListener("click",
function(){
    saveCanvas(canvas,"sketch","png");
});

setup();
mouseDragged();