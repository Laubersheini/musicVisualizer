// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  console.log("hi")
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function updateGain(){
//console.log(document.getElementById("gainSlider").value)

gain.gain.value = document.getElementById("gainSlider").value


}
function updateRainbowSpeed(){

movingRainbowSpeed = document.getElementById("rainbowSpeed").value
//console.log(movingRainbowSpeed)
}

function getRadioValue(name){
  var radios = document.getElementsByName(name);
  var radioValue;
for (var i = 0, length = radios.length; i < length; i++) {
  if (radios[i].checked) {
    // do whatever you want with the checked radio
    return radios[i].value;
    // only one radio can be logically checked, don't check the rest
  }
}


}

function updateColoring(){


barColor = document.getElementById("singleColor").value;
currentColor = getRadioValue("coloring");
if(currentColor == undefined){
  currentColor = "rainbow"
}
updateRainbowMode()
}

function updateRainbowMode(){
  if(currentColor == "rainbow"||currentColor == "movingRainbow"||currentColor == "verticalRainbow"||currentColor == "movingVerticalRainbow" )
  if(document.getElementById("rainbowMoving").checked && !document.getElementById("rainbowVertical").checked){
    currentColor = "movingRainbow";
  }else if(document.getElementById("rainbowMoving").checked && document.getElementById("rainbowVertical").checked){
    currentColor = "movingVerticalRainbow";
  }else if(!document.getElementById("rainbowMoving").checked && document.getElementById("rainbowVertical").checked){
    currentColor = "verticalRainbow";
  }else if(!document.getElementById("rainbowMoving").checked && !document.getElementById("rainbowVertical").checked){
    currentColor = "rainbow"
  }

}

function updateSingleColor(){
barColor = document.getElementById("singleColor").value;
if(barColor == undefined){
  barColor = "#ff00ff"
}
}
function updateStyle(){
currentStyle = getRadioValue("style");
if(currentStyle == undefined){
  currentStyle = "circleMode"
  showDisabledBlocks = true; //enable because it looks better :)

}
}

function updateBackgroundColor(){
backgroundColor = document.getElementById("backgroundColor").value;
if(backgroundColor == ""){
  backgroundColor = "#000000"
}
 generateSquares()
}

function updateOffBlocks(){
  showDisabledBlocks = document.getElementById("offBlocks").checked
  if(showDisabledBlocks == undefined){
    showDisabledBlocks = true;
  }
}


function updateLineModeFilled(){
  lineModeFilled = document.getElementById("lineModeFilled").checked


}

function changeBarCount(){
  var count = parseInt(document.getElementById("barCount").value)
  function power_of_2(n) {
   if (typeof n !== 'number'){
        return false;
      }
      return n && (n & (n - 1)) === 0;
  }
if(power_of_2(count)&&count>=16){

barCount = count;
fftSize = count *2;
barCount-= rightBarCutoff;
analyser.fftSize = fftSize;
 generateSquares()
generateRainbow();
}

}

window.onload = function(){
changeBarCount()
updateOffBlocks()
updateBackgroundColor()
updateColoring()
updateLineModeFilled()
updateSingleColor()
updateStyle()

}
