var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
context = new AudioContext();
var barCount = 256 //must be a power of 2 ?
const fftsize =  barCount*2;
const rightBarCutoff = 30; //fft gets frequencies higher than 20kHz that are not hearable/ relevant for music
 barCount -= rightBarCutoff
const green = "#00ff00";
const yellow = "#ffff00";
const red = "#ff0000"
const colors = [green,yellow,red];
const colorTresholdes = [170,200,255]//must be sorted


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


function render() {
  var freq = new Uint8Array(this.analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freq);
//console.log(freq)
  // Iterate over the frequencies.
  ctx.clearRect(0,0,canvas.width,canvas.height)
  for (var i = 0; i < freq.length; i++) {
    var value;

      value = freq[i];
//console.log(value);
  //  ctx.fillStyle = "#000000";
    //ctx.fillStyle = "#" + value.toString(16) +""+ (255-value).toString(16)+"00"; for weird colors that slowly blend towards red
/*    if(value<100){ //when the treshhold is reaced the entire bar changes colors
      ctx.fillStyle = green;

    }else if(value<200){
        ctx.fillStyle = yellow;
    }else{
        ctx.fillStyle = red;
    }
*/

  for(let j=colorTresholdes.length-1;j>=0;j--){
      ctx.fillStyle = colors[j]
      if(value<colorTresholdes[j]){
        ctx.fillRect(i/barCount*canvas.width ,canvas.height-value/255*canvas.height,
          canvas.width/barCount   ,  canvas.height);
      }else{
        ctx.fillRect(i/barCount*canvas.width ,canvas.height-colorTresholdes[j]/255*canvas.height,
          canvas.width/barCount   ,  canvas.height);

      }

  }

    var percent = i / freq.length;
    var x = Math.round(percent * this.width);

    // draw the line at the right side of the canvas

  }

requestAnimationFrame(render)
}
function onStreamError(){
console.warn("onStreamError")

}

//callbacks

function updateGain(){
//console.log(document.getElementById("gainSlider").value)

gain.gain.value = document.getElementById("gainSlider").value


}

window.addEventListener('resize', resize);
function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

}
resize();
