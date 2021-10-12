const canvas = document.getElementById('myCanvas');
canvas.width = 3200;
canvas.height = 1800;

const ctx = canvas.getContext('2d');

let stateClimber = { 
      coord: { x: 740, y: 1530, pointIndex: 0 }, 
      state: { size: { width: 108, height: 200 } },
      moveStatus: { move: {x: 0, y: 0}, moveIndex: 0, direction: 0 } };
const stateFlag = { 
      coord: { x: 2780, y: 0 }, // Координаты и статус, который 0,
      state: {size: {width: 160, height: 200} },
      status: 0};             // пока альпинист не дошёл (флага не видно)                                          

const moves = [  // скорости с которыми будет перемещаться альпинист.
  {x: 40, y: -39}, // между 0 и 1 пунктом
  {x: 40, y: -38}, // между 1 и 2 пунктом
  {x: 46, y: -11}, // и так далее.
  {x: 43, y: -16}, // прямо уможить на direction: 1
  {x: 37, y: -32}  // в обратную сторону на direction: -1
];

const points = [ // Координаты пунктов трассы со статусом нахождения альпиниста.
  {x: 740, y: 1530, status: 1}, // Альпинист в начальной точке, поэтому здесь status: 1
  {x: 1140, y: 1140, status: 0}, 
  {x: 1540, y: 760, status: 0}, 
  {x: 2000, y: 650, status: 0}, 
  {x: 2430, y: 490, status: 0}, 
  {x: 2800, y: 170, status: 0}]

stateClimber.state.img = new Image();
function drawClimber(climber) {
  // Сюда будем принимать объект stateClimber
  // Из него получим данные о нахождении альпиниста в данный момент
  // И здесь же будем менять статусы пунктов и флага.
  climber.coord.x += climber.moveStatus.move.x * climber.moveStatus.direction;
  climber.coord.y += climber.moveStatus.move.y * climber.moveStatus.direction;
  ctx.drawImage(climber.state.img, 
                climber.coord.x, 
                climber.coord.y,
                climber.state.size.width, 
                climber.state.size.height);
  climber.state.img.src = 'img/climber.png';     
}

stateFlag.state.img = new Image();
function drawFlag (flag) {
  if (flag.status === 1) {
    ctx.drawImage(flag.state.img, 
      flag.coord.x, 
      flag.coord.y, 
      flag.state.size.width, 
      flag.state.size.height);  
    flag.state.img.src = 'img/win.gif'; 
  }  
}

function drawPoint (point) { // принимаем объект из массива points;
  ctx.beginPath();
  ctx.rect(point.x, point.y, 108, 12);
  if (point.status === 0) { // если статус 0, то альпиниста нет, 
    ctx.fillStyle = '#f20'; // пункт почти красный
  } else {                  // в противном случае
    ctx.fillStyle = '#0f5'; // почти зелёный
    }  
  ctx.fill();
  ctx.closePath();
}

function checkPoints (points, climber) {
  points.forEach((point, index) => {
    if (point.x === climber.coord.x && point.y === climber.coord.y) {
      point.status = 1;
      climber.coord.pointIndex = index;
      climber.moveStatus.direction = 0;
    } else {
      point.status = 0;
    }
  });
}

function checkFlag (points, flag) {
  if (points[points.length - 1].status === 1) {
    flag.status = 1;
  } else {
    flag.status = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
  points.forEach(point => {drawPoint(point);}); // рисуем пункты  
  drawClimber(stateClimber);  
  drawFlag(stateFlag);
  checkPoints(points, stateClimber);
  checkFlag(points, stateFlag);
  requestAnimationFrame(draw);
}

document.addEventListener('keydown', (e) => {
  if (stateClimber.moveStatus.direction === 0) { 
    if (e.key === 'z') {
      if (points[0].status !== 1) {
        stateClimber.moveStatus.direction = -1;
        stateClimber.moveStatus.moveIndex = stateClimber.coord.pointIndex - 1;
        stateClimber.moveStatus.move = moves[stateClimber.moveStatus.moveIndex];
      }
    }
    if (e.key === 'x') {
      if (points[points.length - 1].status !== 1) {
        stateClimber.moveStatus.direction = 1;
        stateClimber.moveStatus.moveIndex = stateClimber.coord.pointIndex;
        stateClimber.moveStatus.move = moves[stateClimber.moveStatus.moveIndex];
      }
    } 
  }
});

draw();
