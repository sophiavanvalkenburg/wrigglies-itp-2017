window.onload = function(){

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var tracker = new tracking.ObjectTracker('face');

  var catFace = new Image();
  catFace.src = "static/cat01.png";

  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);

  tracking.track('#webcam', tracker, { camera: true });

  tracker.on('track', function(event) {

    var rectWidth = -1;
    var rectHeight = -1;
    event.data.forEach(function(rect) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (bigChange(rectWidth, rect.width)){
        rectWidth = rect.width;
      }
      if (bigChange(rectHeight, rect.height)){
        rectHeight = rect.height;
      }
      if (catFace.complete){
        context.drawImage(catFace, rect.x, rect.y, rectWidth, rectHeight);
      }
    });
  });
}

function bigChange(prev, next){
  return Math.abs(prev - next) > 15;
}

