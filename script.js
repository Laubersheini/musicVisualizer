var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
context = new AudioContext();
var barCount = 128 //must be a power of 2 //2048 is the most my laptop can handle
const fftsize =  barCount*2;
const rightBarCutoff = 0; //fft gets frequencies higher than 20kHz that are not hearable/ relevant for music
 barCount -= rightBarCutoff
const green = "#00ff00";
const yellow = "#ffff00";
const red = "#ff0000"
const colors = [green,yellow,red];
const colorTresholdes = [170,200,255]//must be sorted
const backgroundColor = "#000000"

var currentColor = "rainbow";
var currentStyle = "circleMode" // "bar", "blockMode","circleMode"
var rainbowColors = [];
var barColor = "#ffffff";
var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");



if (navigator.mozGetUserMedia) {
  navigator.mozGetUserMedia({audio: true},
                            onStream.bind(this),
                            onStreamError.bind(this));
} else if (navigator.webkitGetUserMedia) {
  navigator.webkitGetUserMedia({audio: true},
                            onStream.bind(this),
                            onStreamError.bind(this));
}

var gain = context.createGain();
 function onStream(stream) {
  var input = context.createMediaStreamSource(stream);

  var analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = fftsize;
  input.connect(gain)
  // Connect graph.
  gain.connect(analyser);

  this.analyser = analyser;
  // Setup a timer to visualize some stuff.
  this.render();
}


function choseColor(index,value){

  switch (currentColor) {
    case "gyr":

      for(let i=0;i<colorTresholdes.length;i++){

        if(value<=colorTresholdes[i]){
          return colors[i];
        }
      }
      break;
    case "singleColor":
    return barColor;
    break;
    case "rainbow":
    return rainbowColors[index];
    break;
    default:
        return "#ffffff";
  }



}


function render() {
  var freq = new Uint8Array(this.analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freq);
//console.log(freq)
  // Iterate over the frequencies.
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0,0,canvas.width,canvas.height)

  for (var i = 0; i < freq.length; i++) {
    var value;

      value = freq[i];
//console.log(value);
  //  ctx.fillStyle = "#000000";
    //ctx.fillStyle = "#" + value.toString(16) +""+ (255-value).toString(16)+"00"; for weird colors that slowly blend towards red

  if(currentStyle == "bar")
  for(let j=colorTresholdes.length-1;j>=0;j--){
      ctx.fillStyle = choseColor(i,colorTresholdes[j]);
      if(value<colorTresholdes[j]){
        ctx.fillRect(i/barCount*canvas.width ,canvas.height-value/255*canvas.height,
          canvas.width/barCount   ,  canvas.height);
      }else{
        ctx.fillRect(i/barCount*canvas.width ,canvas.height-colorTresholdes[j]/255*canvas.height,
          canvas.width/barCount   ,  canvas.height);

      }


    }else if(currentStyle == "blockMode"){
      var blockSize = canvas.width/barCount;
      var blockCount = Math.floor(canvas.height/blockSize);
      var valuePerBlock = 255/blockCount;
      let y =0;
      let j = 0;
      ctx.fillStyle = choseColor(i,0)
      while(y<blockCount&&y*valuePerBlock<value){

        ctx.fillStyle = choseColor(i,y*valuePerBlock);
        ctx.fillRect(i/barCount*canvas.width ,canvas.height-y*blockSize,blockSize-2   , blockSize-2);
        y++
      }

    }else if(currentStyle =="circleMode"){
      var blockSize = canvas.width/barCount;
      var blockCount = Math.floor(canvas.height/blockSize);
      var valuePerBlock = 255/blockCount;
      let y =0;
      let j = 0;
      ctx.fillStyle = choseColor(i,0)
      while(y<blockCount&&y*valuePerBlock<value){

        ctx.fillStyle = choseColor(i,y*valuePerBlock);
        ctx.beginPath();
        ctx.arc(i/barCount*canvas.width +blockSize/2,canvas.height-y*blockSize+blockSize/2,  blockSize/2-1,0,2*Math.PI);
        ctx.fill();
        y++
      }

}

}
requestAnimationFrame(render)
}

function onStreamError(){
console.warn("onStreamError")

}

//callbacks

function generateRainbow(){
  var r = 255;
  var g = 0;
  var b = 0;
  var stepSize = 255/barCount*4;
  for(let i=0; i<barCount/4;i++){
    g += stepSize;
    rainbowColors[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
  }
  //yellow

  for(let i=barCount/4; i<barCount/2;i++){
    r -= stepSize;
  rainbowColors[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
  }
//green
for(let i=barCount/2; i<barCount/4 *3;i++){
  b += stepSize;
rainbowColors[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//cyan
for(let i=barCount/4 *3; i<barCount;i++){
  g -= stepSize;
  rainbowColors[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
}
generateRainbow();
window.addEventListener('resize', resize);
function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

}
resize();
