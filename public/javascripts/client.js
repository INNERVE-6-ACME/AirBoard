//import{io} from "socket.io-client";
const socket=io("/")
const videoGrid=document.getElementById("video-grid")
//document.getElementsByClassName('input_video')[0];
const peer=new Peer(undefined,{
    host:"/",
    port:"3001"
})

const myVideo=document.createElement("video")
myVideo.muted=true

// navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
//           navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia ||
//           navigator.mediaDevices.msGetUserMedia;


// if (navigator.getUserMedia)
// {
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream)
    peer.on("call",call=>{
        call.answer(stream)
        const video=document.createElement("video")
        call.on("stream",userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })
    socket.on('new-user-connected',userId =>{
        if(userId!=peer.id){
            console.log("New user: "+userId);
            connectToNewUser(userId,stream);
        }
    })
    socket.emit('connection-request',ROOM_ID,peer.id);
});
//}

peer.on("open",id=>{
    socket.emit("join-room",ROOM_ID,id) ;
})

function addVideoStream(video,stream){
    video.srcObject=stream,
    video.addEventListener("loadedmetadata",()=>{
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId,stream)
{
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on("stream",userVideoStream=>{
        call.answer(stream)
        addVideoStream(video,userVideoStream)
    })
    call.on("close",()=>{
        video.remove()
    })
}