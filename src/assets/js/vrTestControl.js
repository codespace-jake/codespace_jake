// Place url of your deployed app here
const myUrl = "https://65574cfd7abbc6110e054aa6--statuesque-dusk-5500ef.netlify.app/";
const horizontalRatio = 16 / 9;
const verticalRatio = 3 / 4;

$(document).ready(function () {
  makeWalkthrough();
});
var myOrientation;
function makeWalkthrough() {
  const myWidth = window.innerWidth;
  const myHeight = window.innerHeight;
  let horizPadd;
  let newHeight;
  if (myWidth < 768) {
    horizPadd = 6;
  } else {
    horizPadd = 11;
  }
  const newWidth = 100 - horizPadd * 2;
  if (myHeight > myWidth) {
    newHeight = horizontalRatio * newWidth;
    myOrientation = "vert";
  } else {
    newHeight = verticalRatio * newWidth;
    myOrientation = "horz";
  }

  // Insert window for walkthrough
  var marzipanoWindow = document.createElement("iframe");
  marzipanoWindow.style = `height:${newHeight}vw; width:${newWidth}vw`;
  marzipanoWindow.src = `${myUrl}/index.html`;
  $("#walkthrough").append(marzipanoWindow);
}
$(window).resize(function () {
  if (window.innerHeight > window.innerWidth && myOrientation === "horz") {
    $("#walkthrough").empty();
    makeWalkthrough();
  } else if (
    window.innerHeight < window.innerWidth &&
    myOrientation === "vert"
  ) {
    $("#walkthrough").empty();
    makeWalkthrough();
  }
});
// script for Screenful
var scriptScreenful = document.createElement("script");
scriptScreenful.type = "text/javascript";
scriptScreenful.src = `${myUrl}/vendor/screenfull.min.js`;
$("head").append(scriptScreenful);
// script for Classlist
var scriptClassList = document.createElement("script");
scriptClassList.type = "text/javascript";
scriptClassList.src = `${myUrl}/vendor/classList.js`;
$("head").append(scriptClassList);
// script for bowser
var scriptBowser = document.createElement("script");
scriptBowser.type = "text/javascript";
scriptBowser.src = `${myUrl}/vendor/bowser.min.js`;
$("head").append(scriptBowser);
// script for es5
var scriptEs5 = document.createElement("script");
scriptEs5.type = "text/javascript";
scriptEs5.src = `${myUrl}/vendor/es5-shim.js`;
$("head").append(scriptEs5);
// script for events
var scriptEvent = document.createElement("script");
scriptEvent.type = "text/javascript";
scriptEvent.src = `${myUrl}/vendor/eventShim.js`;
$("head").append(scriptEvent);
// script for animation
var scriptAnimation = document.createElement("script");
scriptAnimation.type = "text/javascript";
scriptAnimation.src = `${myUrl}/vendor/requestAnimationFrame.js`;
$("head").append(scriptAnimation);
// script for Marzipano
var scriptMarzipano = document.createElement("script");
scriptMarzipano.type = "text/javascript";
scriptMarzipano.src = `${myUrl}/vendor/marzipano.js`;
$("head").append(scriptMarzipano);
