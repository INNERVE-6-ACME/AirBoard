var obj;
var prevIndex = { visiblity: undefined, x: 0, y: 0, z: 0 }
var prevThumb = { visiblity: undefined, x: 0, y: 0, z: 0 }
let trackerSize = 1
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var canvasCtx2 = null
var canvas2=null

var ws = new WebSocket(ws_url + "/ws/board/" + roomId)
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});

camera.start();

function fingersUp(res4, total) {
  var fingers = []
  if (res4.x > total[0][3])
    fingers.push(1)
  else
    fingers.push(0)
  var fArray = [8, 12, 16, 20]
  fArray.forEach((item) => {
    if (total[0][item].y > total[0][item - 2].y)
      fingers.push(0)
    else
      fingers.push(1)
  })
  return fingers
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.translate(width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks.length !== 0) {
    //console.log(results.multiHandLandmarks)
    var res1 = prevIndex
    //console.log(results.multiHandLandmarks)
    var res2 = results.multiHandLandmarks[0][8]
    var res4 = results.multiHandLandmarks[0][4]
    var pos = fingersUp(res4, results.multiHandLandmarks)
    if (document.getElementById("defaultCanvas0") != null)
    {
      canvasCtx2 = document.getElementById("defaultCanvas0").getContext("2d");
      canvas2 = document.getElementById("defaultCanvas0")}
    if (pos[1] === 1 && pos[2] === 1 && pos[3]===1 && pos[4]===1 && canvasCtx2 != null) {
      let esize = parseInt(_("#eraser-size").value);
      canvasCtx2.fillStyle = "rgba(0,0,0,0)";
      canvasCtx2.clearRect((1 - res1.x) * 1280 - esize, res1.y * 720 - esize, esize*2, esize*2);
      ws.send(JSON.stringify({
        "type": "erase",
        "c1": { x: (1 - res1.x), y: res1.y },
        "esize": esize
      }))

    }
    else if(pos[1] === 1 && pos[2] === 0 && pos[3]===0 && pos[4]===0 && canvasCtx2 != null){
      mouseDragged(res1, res2, res4)
    }
    // socket2.emit()
    prevIndex = res2
    prevThumb = res4
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
        { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// </script>
function _(selector) {
  return document.querySelector(selector);
}

function setup() {
  let canvas = createCanvas(1280, 720);
  canvas.parent("#canvas-wrapper");
}

function mouseDragged(res1, res2, res4) {
  let type = "pencil";
  let size = parseInt(_("#pen-size").value);
  let color = _("#pen-color").value;
  //console.log(typeof(color))
  fill(color);
  stroke(color);
  if (type == "pencil") {
    let pmouseX = (1 - res1.x) * 1280, pmouseY = res1.y * 720, mouseX = (1 - res2.x) * 1280, mouseY = res2.y * 720
    strokeWeight(size)
    stroke(color)
    line(pmouseX, pmouseY, mouseX, mouseY)
    ws.send(JSON.stringify({
      "type": "pen",
      "c1": { x: pmouseX, y: pmouseY },
      "c2": { x: mouseX, y: mouseY },
      "stroke-size": size,
      "stroke-color": color,
    }))
  }
}

ws.onmessage = (e) => {
  var x = e
  e = JSON.parse(e.data)
  if (e["type"] === "pen") {
    strokeWeight(e['stroke-size'])
    stroke(e['stroke-color'])
    line(e['c1']['x'], e['c1']['y'], e['c2']['x'], e['c2']['y']);
  }
  else if (e["type"] === "erase") {
    if (document.getElementById("defaultCanvas0") != null) {
      canvasCtx2 = document.getElementById("defaultCanvas0").getContext("2d");
      canvasCtx2.fillStyle = "rgba(0,0,0,0)";
      canvasCtx2.clearRect(( e['c1']['x']) * 1280 - esize,e['c1']['y'] * 720 - esize, esize*2, esize*2);
    }
  }
  else if(e["type"] == "reset"){
    clear()
  }
}

_("#reset-canvas").addEventListener("click",
  function () {
    clear()
    ws.send(JSON.stringify({
      "type": "reset"
    }))
  });

_("#save-canvas").addEventListener("click",
  function () {
    saveCanvas(canvas, "sketch", "png");
  });



_("#save_canvas_cloud").addEventListener("click", () => {
  var url = api_url + "/api/savesession/";
  var data = {
    "session_id": roomId,
    "board": canvas.toDataURL("image/png").split(";base64,")[1]
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token " + document.cookie.valueOf('authtoken').split("authtoken=")[1].split(";")[0]
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    
  })
})
