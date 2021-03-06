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
const circleSpacing = 1;

var rainbowGradiant; // for line mode
var verticalRainbowGradiant;
var gyrPattern;
var showDisabledBlocks = true;
var disabledColor = "#101010";
var lineModeFilled = true;
var backgroundColor = "#000000"
var movingRainbowSpeed = 0.001;
var currentColor = "verticalRainbow";
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


var movingRainbowOffset =0;
function choseColor(index,value,disabled){
  if(disabled){
    return disabledColor;
  }

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
    case "movingRainbow":
    movingRainbowOffset -= movingRainbowSpeed;
    return  rainbowColors[(Math.abs(index +Math.floor(movingRainbowOffset)))% rainbowColors.length];
    break;
    case "verticalRainbow":
    return verticalRainbow[1019-Math.floor(value/255*1020)];
    break;
    case "movingVerticalRainbow":
    movingRainbowOffset -= movingRainbowSpeed;
    return  verticalRainbow[Math.floor(+Math.abs(((1529-value/255*1530) -movingRainbowOffset)% verticalRainbow.length))];

    break;
    default:
        return "#ffffff";
  }



}

function chosePattern(index,value,disabled){
  if(disabled){
    return disabledColor;
  }

  switch (currentColor) {
    case "gyr":
      return gyrPattern;

      break;
    case "singleColor":
    return barColor;
    break;
    case "rainbow":
    return rainbowGradiant
    break;
    case "movingRainbow":
    movingRainbowOffset -= movingRainbowSpeed *1000;
    moveRainbow(Math.abs(index +Math.floor(movingRainbowOffset% (canvas.width*1.5-2)))+1)
    return movedRainbow
    break;
    case "verticalRainbow":
    return verticalRainbowGradiant;
    break;
    case "movingVerticalRainbow":
    movingRainbowOffset = (movingRainbowOffset + movingRainbowSpeed *1000)%verticalMovingRainbowCanvas.height;
    moveVerticalRainbow(Math.abs(Math.floor((verticalMovingRainbowCanvas.height-movingRainbowOffset)% (canvas.height*1.5-2)))+1)
    return movedRainbow;
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

  if(showDisabledBlocks){
    switch (currentStyle) {
      case "blockMode":
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(squareCanvas,0,0);
        break;
        case "circleMode":
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(circleCanvas,0,0);
        break;
      default:
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0,0,canvas.width,canvas.height)

    }
  }else{
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0,0,canvas.width,canvas.height)

    }

      //code run once per drawCyle
      switch (currentStyle) {
        case "lineMode":
          let y =0;
          let j = 0;

          ctx.beginPath();
          ctx.moveTo(canvas.width/barCount*0.5,canvas.height-freq[i]/255*canvas.height)

          break;
          case "bar":
            if(currentColor != "rainbow" &&currentColor !="movingRainbow" ){
              ctx.fillStyle = chosePattern(i,0,0);
            }
          break;
        default:

      }

   

//code run for each bar:
  for (var i = 0; i < freq.length; i++) {
    var value;

      value = freq[i];

  if(currentStyle == "bar"){
      if(currentColor =="rainbow" ||currentColor =="movingRainbow"){
      ctx.fillStyle = choseColor(i,0,0);
    }
        ctx.fillRect(i/barCount*canvas.width ,canvas.height-value/255*canvas.height,
          canvas.width/barCount   ,  canvas.height);



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
        ctx.arc(i/barCount*canvas.width +blockSize/2,canvas.height-y*blockSize+blockSize/2,  blockSize/2-circleSpacing,0,2*Math.PI);
        ctx.fill();
        y++
      }

    }else if(currentStyle =="lineMode"){


      ctx.lineTo(i*canvas.width/barCount+canvas.width/barCount*0.5,canvas.height-value/255*canvas.height)
    }

}

if(currentStyle== "lineMode"){
      ctx.fillStyle = chosePattern(0,0,0);
      ctx.strokeStyle = chosePattern(0,0,0);
  if(lineModeFilled){

    ctx.lineTo(canvas.width,canvas.height);
    ctx.lineTo(0,canvas.height);
    ctx.fill()
  }else{

    ctx.stroke()
  }

  }
requestAnimationFrame(render)
}

function onStreamError(){
console.warn("onStreamError")

}

var squareCanvas;
var circleCanvas;

function generateSquares(){

  var blockSize = canvas.width/barCount;
  var blockCount = Math.floor(canvas.height/blockSize);
  var valuePerBlock = 255/blockCount;
  squareCanvas=document.createElement('canvas');
  circleCanvas = document.createElement("canvas");
  var squareCtx=squareCanvas.getContext('2d');
  squareCanvas.width=canvas.width;
  squareCanvas.height=canvas.height;
  squareCtx.fillStyle = backgroundColor;
  squareCtx.fillRect(0,0,canvas.width,canvas.height)

  var ctx=circleCanvas.getContext('2d');
  circleCanvas.width=canvas.width;
  circleCanvas.height=canvas.height;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0,0,canvas.width,canvas.height)
    for (var i = 0; i < barCount; i++) {

  //    squareCtx.fillRect(0,0,canvas.width,canvas.height)
      squareCtx.fillStyle = choseColor(i,0,true)

      for(let j=0;j<255;j++){//disabled Blocks
        squareCtx.fillStyle = choseColor(i,0,true)
        squareCtx.fillRect(i/barCount*canvas.width ,canvas.height-j*blockSize,blockSize-2   , blockSize-2);


        ctx.fillStyle = choseColor(i,0,true);//probably wrong?
        ctx.beginPath();
        ctx.arc(i/barCount*canvas.width +blockSize/2,canvas.height-j*blockSize+blockSize/2,  blockSize/2-circleSpacing,0,2*Math.PI);
        ctx.fill();
      }


    }
}

var verticalRainbow;
function generateVerticalRainbow(){
  verticalRainbow = [];
  var r = 255;
  var g = 0;
  var b = 0;
  var stepSize = 1
  const barCount = 255*4;
  for(let i=0; i<barCount/4;i++){
    g += stepSize;
    verticalRainbow[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
  }
  //yellow

  for(let i=barCount/4; i<barCount/2;i++){
    r -= stepSize;
  verticalRainbow[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
  }
//green
for(let i=barCount/2; i<barCount/4 *3;i++){
  b += stepSize;
verticalRainbow[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//cyan
for(let i=barCount/4 *3; i<barCount;i++){
  g -= stepSize;
  verticalRainbow[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//blue

//fade back to red for the moving rainbow mode
for(let i=barCount; i<barCount*1.25;i++){
  r += stepSize;
  verticalRainbow[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//violet
for(let i=barCount*1.25 ;i<barCount*1.5;i++){
  b -= stepSize;
  verticalRainbow[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//red
}
generateVerticalRainbow();

function generateRainbow(){
  rainbowColors = [];
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
//blue

//fade back to red for the moving rainbow mode
for(let i=barCount; i<barCount*1.25;i++){
  r += stepSize;
  rainbowColors[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//violet
for(let i=barCount*1.25 ;i<barCount*1.5;i++){
  b -= stepSize;
  rainbowColors[i] = "#"+ Math.round(r).toString(16).padStart(2,"0")+Math.round(g).toString(16).padStart(2,"0")+Math.round(b).toString(16).padStart(2,"0");
}
//red
}
generateRainbow();




var movingRainbowCanvas;
var verticalMovingRainbowCanvas;
var movedRainbow;
function moveRainbow(dx){
  console.log(dx)
  var tmpCanvas = document.createElement("canvas");
  var tmpCtx = tmpCanvas.getContext("2d");
  tmpCanvas.height = canvas.height
  tmpCanvas.width = canvas.width;
  tmpCtx.drawImage(movingRainbowCanvas,0,0,movingRainbowCanvas.width-dx,canvas.height,dx,0,movingRainbowCanvas.width,canvas.height);
  tmpCtx.drawImage(movingRainbowCanvas,movingRainbowCanvas.width-dx,0,dx,canvas.height,0,0,dx,canvas.height);

  movedRainbow = ctx.createPattern(tmpCanvas,"no-repeat")
}
function moveVerticalRainbow(dy){
  console.log(dy)
//  console.log(verticalMovingRainbowCanvas.height-dy)
  var tmpCanvas = document.createElement("canvas");
  var tmpCtx = tmpCanvas.getContext("2d");
  tmpCanvas.height = canvas.height
  tmpCanvas.width = canvas.width;
  tmpCtx.drawImage(verticalMovingRainbowCanvas,0,0,verticalMovingRainbowCanvas.width,verticalMovingRainbowCanvas.height-dy,0,dy,verticalMovingRainbowCanvas.width,verticalMovingRainbowCanvas.height);
  tmpCtx.drawImage(verticalMovingRainbowCanvas,0,verticalMovingRainbowCanvas.height-dy,canvas.width,dy,0,0,canvas.width,dy);
  movedRainbow = ctx.createPattern(tmpCanvas,"no-repeat")

}


function generateGradiants(){
  //for line mode
  rainbowGradiant = ctx.createLinearGradient(0, 0, canvas.width*1.5, 0);
  rainbowGradiant.addColorStop(0, "red");
  rainbowGradiant.addColorStop(1/6,"yellow")
  rainbowGradiant.addColorStop(2/6, "#00ff00");
  rainbowGradiant.addColorStop(3/6,"cyan");
  rainbowGradiant.addColorStop(4/6,"blue");
  rainbowGradiant.addColorStop(5/6,"#ff00ff");
  rainbowGradiant.addColorStop(1,"red")

  verticalRainbowGradiant =  ctx.createLinearGradient(0, 0,0, canvas.height*1.5);
  verticalRainbowGradiant.addColorStop(0, "red");
  verticalRainbowGradiant.addColorStop(1/6,"yellow")
  verticalRainbowGradiant.addColorStop(2/6, "#00ff00");
  verticalRainbowGradiant.addColorStop(3/6,"cyan");
  verticalRainbowGradiant.addColorStop(4/6,"blue");
  verticalRainbowGradiant.addColorStop(5/6,"#ff00ff");
  verticalRainbowGradiant.addColorStop(1,"red")

  movingRainbowCanvas = document.createElement("canvas");
  var tmpCtx2 = movingRainbowCanvas.getContext("2d");
  movingRainbowCanvas.width = canvas.width*1.5;
  movingRainbowCanvas.height = canvas.height;
  tmpCtx2.fillStyle = rainbowGradiant;
  tmpCtx2.fillRect(0,0,movingRainbowCanvas.width,movingRainbowCanvas.height)

  verticalMovingRainbowCanvas = document.createElement("canvas");
  tmpCtx2 = verticalMovingRainbowCanvas.getContext("2d");
  verticalMovingRainbowCanvas.width = canvas.width;
  verticalMovingRainbowCanvas.height = canvas.height*1.5;
  tmpCtx2.fillStyle = verticalRainbowGradiant;
  tmpCtx2.fillRect(0,0,verticalMovingRainbowCanvas.width,verticalMovingRainbowCanvas.height)




  var tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  var tmpCtx = tmpCanvas.getContext("2d");
  for(let i=colorTresholdes.length-1;i>=0;i--){
    tmpCtx.fillStyle = colors[i]
   tmpCtx.fillRect(0,canvas.height-canvas.height* colorTresholdes[i]/255,canvas.width, canvas.height);
  }
  gyrPattern = ctx.createPattern(tmpCanvas,"no-repeat");
}


window.addEventListener('resize', resize);
function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
generateSquares()
generateGradiants();
 console.log("resized")
}
resize();
