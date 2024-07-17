let totalRot = ((90 / 100) * 180 * Math.PI) / 180;

let rotation = 0;
let targetRotation = totalRot;
let doAnim = true;
let canvas = null;
let ctx = null;
let text = document.querySelector(".text");
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
setTimeout(() => requestAnimationFrame(animate), 1500);

function calcPointsCirc(cx, cy, rad, dashLength) {
  var n = rad / dashLength,
    alpha = (Math.PI * 2) / n,
    pointObj = {},
    points = [],
    i = -1;

  while (i < n) {
    var theta = alpha * i,
      theta2 = alpha * (i + 1);

    points.push({
      x: Math.cos(theta) * rad + cx,
      y: Math.sin(theta) * rad + cy,
      ex: Math.cos(theta2) * rad + cx,
      ey: Math.sin(theta2) * rad + cy
    });
    i += 2;
  }
  return points;
}

function interpolate(current, target, factor) {
  return current + (target - current) * factor;
}

function animate() {
  //Clearing animation on every iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const center = {
    x: 175,
    y: 175
  };

  //main arc
  ctx.beginPath();
  ctx.strokeStyle = rotation >= 0.75 * Math.PI ? "#FF9421" : "#35FFFF";
  ctx.lineWidth = "3";
  let radius = 174;
  ctx.arc(center.x, center.y, radius, Math.PI, Math.PI + rotation);
  ctx.stroke();

  //Red Arc
  if (rotation <= 0.75 * Math.PI) {
    ctx.beginPath();
    ctx.strokeStyle = "#FF9421";
    ctx.lineWidth = "3";
    ctx.arc(center.x, center.y, radius, 1.75 * Math.PI, 0);
    ctx.stroke();
  }

  //functions to draw dotted lines
  const DrawDottedLine = (x1, y1, x2, y2, dotRadius, dotCount, dotColor) => {
    var dx = x2 - x1;
    var dy = y2 - y1;
    let slopeOfLine = dy / dx;
    var degOfLine =
      Math.atan(slopeOfLine) * (180 / Math.PI) > 0
        ? Math.atan(slopeOfLine) * (180 / Math.PI)
        : 180 + Math.atan(slopeOfLine) * (180 / Math.PI);
    var degOfNeedle = rotation * (180 / Math.PI);

    if (rotation >= 0.75 * Math.PI) {
      dotColor = degOfLine <= degOfNeedle ? "#FF9421" : "#f97272";
    } else {
      dotColor = degOfLine <= degOfNeedle ? dotColor : "#aad4d4";
    }
    var spaceX = dx / (dotCount - 1);
    var spaceY = dy / (dotCount - 1);
    var newX = x1;
    var newY = y1;
    for (var i = 0; i < dotCount; i++) {
      dotRadius = dotRadius >= 0.75 ? dotRadius - i * (0.5 / 15) : dotRadius;
      drawDot(newX, newY, dotRadius, `${dotColor}${100 - (i + 1)}`);
      newX += spaceX;
      newY += spaceY;
    }
  };

  const drawDot = (x, y, dotRadius, dotColor) => {
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = dotColor;
    ctx.fill();
  };

  let firstDottedLineDots = calcPointsCirc(center.x, center.y, 165, 1);
  for (let k = 0; k < firstDottedLineDots.length; k++) {
    let x = firstDottedLineDots[k].x;
    let y = firstDottedLineDots[k].y;
    DrawDottedLine(x, y, 175, 175, 1.75, 30, "#35FFFF");
  }

  //dummy circle to hide the line connecting to center
  ctx.beginPath();
  ctx.arc(center.x, center.y, 80, 2 * Math.PI, 0);
  ctx.fillStyle = "black";
  ctx.fill();

  //Speedometer triangle
  var x = -75,
    y = 0;
  ctx.save();
  ctx.beginPath();
  ctx.translate(175, 175);
  ctx.rotate(rotation);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.closePath();
  ctx.fillStyle = rotation >= 0.75 * Math.PI ? "#FF9421" : "#35FFFF";
  ctx.fill();
  ctx.restore();

  rotation = interpolate(rotation, targetRotation, 0.1);

  text.innerHTML = Math.round((rotation / Math.PI) * 100) + 0 + "%";
  requestAnimationFrame(animate);
}

function updateSpeed() {
  let speedInput = document.getElementById("speedInput").value;
  let speedPercentage = Math.max(0, Math.min(100, speedInput));
  targetRotation = (speedPercentage / 100) * Math.PI;
}