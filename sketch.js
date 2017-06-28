var capture;
var wriggliesMask;
var wrigglies;
var wrigglies2;
var music;
var rectX = -1;
var rectY = -1;
var rectWidth = -1;
var rectHeight = -1;
var threshold = 15;
var amplitude;
var musicDuration;

var widthMultiplier;
var heightMultiplier;

window.onload = function(){

  var tracker = new tracking.ObjectTracker('face');

  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);

  tracking.track('#webcam', tracker, { camera: true });

  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      if (bigChange(rectX, rect.x)){
        rectX = rect.x;
      }
      if (bigChange(rectY, rect.y)){
        rectY = rect.y;
      }
      if (bigChange(rectWidth, rect.width)){
        rectWidth = rect.width;
      }
      if (bigChange(rectHeight, rect.height)){
        rectHeight = rect.height;
      }
    });
  });
}

function bigChange(prev, next){
  return Math.abs(prev - next) > threshold;
}


function preload(){
  music = loadSound("static/brinn.mp3");

  wrigglies = createVideo(['static/wrigglies3.mp4'])
  wrigglies.loop();
  wrigglies.hide();

  wrigglies2 = createVideo(['static/wrigglies2.mp4'])
  wrigglies2.loop();
  wrigglies2.hide();
  wrigglies2.speed(0.5);

}

function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");

  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();

  widthMultiplier = windowWidth/320;
  heightMultiplier = windowHeight/240;

  amplitude = new p5.Amplitude();

  music.play();
  music.loop();
  
}

function draw(){
  var ampLevel = amplitude.getLevel();

  var redColor = map(ampLevel, 0, 1, 100, 255);
  var blueColor = map(ampLevel, 0, 1, 255, 100);

  background(255);
  image(capture, 0, 0, windowWidth, windowHeight);

  var wriggliesSize;
  var offset = 0;
  if (music.currentTime() > 30){
    wriggliesSize = 1.5;
    offset = 200;
  } else if (ampLevel < 0.1){
    wriggliesSize = 0;
  } else {
    wriggliesSize = map(music.currentTime(), 0, 30, 0, 1.5);
  }

  push();
  translate(widthMultiplier*rectX, heightMultiplier*rectY + windowHeight/2 + offset);
  angleMode(DEGREES);
  rotate(-90);
  scale(wriggliesSize, wriggliesSize);
  blend(wrigglies, 0, 0, wrigglies.width, wrigglies.height, 0, 0, widthMultiplier*rectWidth, heightMultiplier*rectHeight, DARKEST)
  pop();

  blend(wrigglies2, 0, 0, wrigglies2.width, wrigglies2.height, 0, 0, windowWidth, windowHeight, SOFT_LIGHT);
  tint(redColor, 0, blueColor);
  
}