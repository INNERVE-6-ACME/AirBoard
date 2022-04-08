var obj;
var prevIndex={visiblity:undefined,x:0,y:0,z:0}
var prevThumb = {visiblity:undefined,x:0,y:0,z:0}
let trackerSize=1
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var canvasCtx2=null
//let canvasCtx2=document.getElementById("#canvas-wrapper").getContext("2d");
//require("dotenv").config()
var ws = new WebSocket(ws_url+"/ws/board/" + roomId)
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

camera.start();

function fingersUp(res4,total)
{
  var fingers=[]
  if(res4.x>total[0][3])
   fingers.push(1)
  else
   fingers.push(0)
  var fArray=[8,12,16,20]
  fArray.forEach((item) => {
    if(total[0][item].y>total[0][item-2].y)
     fingers.push(0)
    else
     fingers.push(1)
  })
  return fingers
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks.length!==0) {
    //console.log(results.multiHandLandmarks)
    var res1 = prevIndex
    //console.log(results.multiHandLandmarks)
    var res2 = results.multiHandLandmarks[0][8]
    var res4 = results.multiHandLandmarks[0][4]
    //var thumb3= results.multiHandLandmarks[0][3]
    //var middle = results.multiHandLandmarks[0][12]
    //var ring= results.multiHandLandmarks[0][16]
    //var little =results.multiHandLandmarks[0][20]
    var pos = fingersUp(res4,results.multiHandLandmarks)
    if(document.getElementById("defaultCanvas0") != null)
     canvasCtx2=document.getElementById("defaultCanvas0").getContext("2d");
    if(pos[1]===1 && pos[2]===1 && canvasCtx2!=null)
    {
      // canvasCtx2.beginPath();
      // //console.log(res2.x, res2.y);
      // canvasCtx2.arc((1 - res1.x) * 1280, res1.y * 720, 10, 0, 2 * Math.PI);
      // strokeWeight(trackerSize)

      canvasCtx2.fillStyle = 'white';
      canvasCtx2.fillRect((1-res1.x)*1280 - 20, res1.y*720 - 20, 40, 40);
      ws.send(JSON.stringify({
        "type": "erase",
        "c1": {x:(1-res1.x), y:res1.y},
      }))

      canvasCtx2.beginPath();
      //console.log(res2.x, res2.y);
      canvasCtx2.arc((1 - res2.x) * 1280, res2.y * 720, 10, 0, 2 * Math.PI);
      strokeWeight(trackerSize)
      canvasCtx2.stroke()
    }
    else{
    mouseDragged(res1,res2,res4)
    }
    // socket2.emit()
     prevIndex=res2 
    prevThumb = res4
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// </script>
function _(selector){
    return document.querySelector(selector);
}

function setup(){
    let canvas = createCanvas(1280,720);
    canvas.parent("#canvas-wrapper");
    background(255);
}

function mouseDragged(res1,res2,res4){
    let type= "pencil";
    let size = parseInt(_("#pen-size").value);
    let color= _("#pen-color").value;
    //console.log(typeof(color))
    fill(color);
    stroke(color);
    var x0=res4.x*1280;
    var y0=res4.y*720;
    var x1=res2.x*1280;
    var y1=res2.y*720;
    function distance(x0, y0, x1, y1){
        return Math.hypot(x1 - x0, y1 - y0);
    }
    var dist=distance(x0, y0, x1, y1)
    //console.log("Dist : "+ dist.toString());
    if(type == "pencil" && dist<=50){
        let pmouseX=(1-res1.x)*1280,pmouseY=res1.y*720,mouseX=(1-res2.x)*1280,mouseY=res2.y*720
        strokeWeight(size)
        line(pmouseX, pmouseY, mouseX, mouseY)
        ws.send(JSON.stringify({
          "type":"pen",
          "c1": {x:pmouseX, y:pmouseY},
          "c2": {x:mouseX, y:mouseY},
          "stroke-size": size
        }))
        //line(pmouseX,pmouseY,mouseX,mouseY);
    }
}

ws.onmessage = (e) => {
  var x = e
  e=JSON.parse(e.data)
  //console.log(typeof(e))
  // console.log(e['c1'])
  // console.log(e.c1.x)
  if(e["type"]==="pen")
  {
  strokeWeight(e['stroke-size'])
  line(e['c1']['x'], e['c1']['y'], e['c2']['x'], e['c2']['y']);
  }
  else{
    if(document.getElementById("defaultCanvas0") != null)
     canvasCtx2=document.getElementById("defaultCanvas0").getContext("2d");
    canvasCtx2.fillStyle = 'white';
    canvasCtx2.fillRect((1-e["c1"]["x"])*1280 - 20, e["c1"]["y"]*720 - 20, 40, 40);
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

// *************************************************************************** */