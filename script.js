const canvas = document.getElementById('myCanvas');
canvas.width = 3200;
canvas.height = 1800;

const ctx = canvas.getContext('2d');

let begin;

let SET_GAME = 0;

const DURATION_GAME = 30;

const stateClimber = { 
      coord: { x: 740, y: 1530, pointIndex: 0 }, 
      state: { size: { width: 108, height: 200 }, 
               lifes: { amount: 3, health: 25 },
               scores: 0,
               newLife: 0 },
      moveStatus: { move: {x: 0, y: 0}, moveIndex: 0, direction: 0, up: 0 } };

const stateFlag = { 
      coord: { x: 2780, y: 0 }, // Координаты и статус, который 0,
      state: {size: {width: 160, height: 200} },
      status: 0};             // пока альпинист не дошёл (флага не видно)                                          

const moves = [  // скорости с которыми будет перемещаться альпинист.
  {x: 13, y: -13}, // между 0 и 1 пунктом
  {x: 13, y: -13}, // между 1 и 2 пунктом
  {x: 15, y: -4}, // и так далее.
  {x: 14, y: -5}, // прямо уможить на direction: 1
  {x: 12, y: -10}  // в обратную сторону на direction: -1
];

const points = [ // Координаты пунктов трассы со статусом нахождения альпиниста.
  {x: 740, y: 1530, status: 1, climbed: 1}, // Альпинист в начальной точке, поэтому здесь status: 1
  {x: 1140, y: 1140, status: 0, climbed: 0}, 
  {x: 1540, y: 760, status: 0, climbed: 0}, 
  {x: 2000, y: 650, status: 0, climbed: 0}, 
  {x: 2430, y: 490, status: 0, climbed: 0}, 
  {x: 2800, y: 170, status: 0, climbed: 0}];

const collapseStones = [
  {x: 1000, y: 1350},
  {x: 1400, y: 900},
  {x: 1700, y: 700},
  {x: 2200, y: 600},
  {x: 2700, y: 300},
]

for (let i = 0; i < 20; i += 1) {
  collapseStones.push({x: 1400 + Math.round(1600 * Math.random()), y: 700 + Math.round(1100 * Math.random())});
}
for (let i = 0; i < 2; i += 1) {
  collapseStones.push({x: 2600 + Math.round(500 * Math.random()), y: 200 + Math.round(500 * Math.random())});
}

const typeStones = [
  { diameter: 100, damage: 15, instability: 5 },
  { diameter: 60, damage: 8, instability: 10 },
  { diameter: 30, damage: 3, instability: 15 }
]

const stones = [];

const AMOUNT_STONES = 15;

function createStone(xyStones, typesStones) {
  let indexXyStones = Math.floor(26.99 * Math.random());
  let indexTypesStones = Math.floor(2.99 * Math.random());
  let stone = {coord: {}, type: {}};
  stone.coord.x = xyStones[indexXyStones].x;
  stone.coord.y = xyStones[indexXyStones].y;
  stone.type.instability = typesStones[indexTypesStones].instability;
  stone.type.diameter = typesStones[indexTypesStones].diameter;
  stone.type.damage = typesStones[indexTypesStones].damage;
  return stone;
        
}
// createStone(collapseStones, typeStones);

for (let i = 0; i < AMOUNT_STONES; i += 1) {
  stones.push(createStone(collapseStones, typeStones));
}

stateClimber.state.img = new Image();
function drawClimber(climber) {
  // Сюда будем принимать объект stateClimber
  // Из него получим данные о нахождении альпиниста в данный момент
  // И здесь же будем менять статусы пунктов и флага.
  moveClimber(climber);
  ctx.drawImage(climber.state.img, 
                climber.coord.x, 
                climber.coord.y,
                climber.state.size.width, 
                climber.state.size.height);
  climber.state.img.src = 'img/climber.png';     
}

function moveClimber (climber) {
  climber.coord.x += climber.moveStatus.move.x * climber.moveStatus.direction;
  climber.coord.y += climber.moveStatus.move.y * climber.moveStatus.direction;

  if (climber.state.newLife === 1) {
    climber.state.newLife = 0;
  }

  if (climber.moveStatus.up === 1) {
    let time = Date.now()
    let speed = - 14 + 6 * (((time - climber.moveStatus.time)) / 400) ** 2;
    if (speed < 21) {
      climber.coord.y += speed;
    } else {
      climber.coord.y += 21;
    }
  }
  
  if (checkDeath(climber) && climber.moveStatus.up !== -1) {
    climber.moveStatus.time = Date.now();
    climber.moveStatus.up = -1;
  }

  if (climber.moveStatus.up === -1) {
    let time = Date.now();
    let speed = 6 * (((time - climber.moveStatus.time)) / 400) ** 2;
    climber.coord.y += speed;
  }

  if (climber.coord.y > 1800 || climber.coord.x > 3200) {
    climber.coord.pointIndex = 0;
    let index = climber.coord.pointIndex;
    climber.coord.x = points[index].x;
    climber.coord.y = points[index].y;
    climber.state.lifes.health = 25;
    climber.moveStatus.up = 0;  
    climber.state.newLife = 1;
  }
}

let xcor = 100;
let ycor = 30;
pterodactyl = new Image();
function drawPterodactyl () {  
  xcor += 7;
  ycor += 5;
  ctx.drawImage(pterodactyl, xcor, ycor, 500, 300);
  pterodactyl.src = 'img/pterodactil2.png';
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

function drawStone (stone) { // принимаем объект из массива points;
  moveStone(stone);

  ctx.beginPath();
  ctx.arc(stone.coord.x, stone.coord.y, stone.type.diameter / 2, 0, Math.PI*2, false); 
  ctx.fillStyle = '#fdc'; 
  ctx.fill();
  ctx.closePath();
}

function moveStone (stone) {
  if (stone.type.instability = 5) {
    stone.coord.x -= stone.type.instability * Math.random();
    stone.coord.y += stone.type.instability * Math.random();
  }
  if (stone.type.instability = 10) {
    stone.coord.x -= stone.type.instability * Math.random() - 2.5;
    stone.coord.y += stone.type.instability * Math.random() - 1.5;
  }
  if (stone.type.instability = 15) {
    stone.coord.x -= stone.type.instability * Math.random() - 5;
    stone.coord.y += stone.type.instability * Math.random() - 4;
  }
}

function drawStones(arr) {
  arr.forEach(stone => drawStone(stone));
}

function drawScore(climber) {
  ctx.font = '100px Arial';
  ctx.fillStyle = '#F00';
  ctx.fillText('Очки: ' + climber.state.scores, 100, 200);
}

function drawTime() {
  ctx.font = '100px Arial';
  ctx.fillStyle = '#F00';
  let end = Date.now();
  ctx.fillText('Время: ' + Math.round((DURATION_GAME - (end - begin) / 1000)), 100, 400);
}

function drawLife(climber) {
  ctx.font = '100px Arial';
  ctx.fillStyle = '#F00';
  ctx.fillText('Жизни: ' + climber.state.lifes.amount, 100, 1100);
  let health = climber.state.lifes.health;
  ctx.beginPath();
  ctx.moveTo(500, 700);
  ctx.lineTo(300, 700);
  ctx.arc(300, 700, 200, 0, 2 * Math.PI * health / 25, false);  
  ctx.lineTo(300, 700);

  if (health < 10) {
    ctx.fillStyle = '#F00';
  } else {
    ctx.fillStyle = '#0F0';
  }
  ctx.fill();
}

function drawTable(climber) {
  drawScore(climber);
  drawTime();
  drawLife(climber);
}

function checkPoints (points, climber) {
  if (climber.moveStatus.up !== -1) {
    points.forEach((point, index) => {
      if ((point.x >= climber.coord.x - 11 && point.x <= climber.coord.x + 11) && 
          (point.y >= climber.coord.y - 11 && point.y <= climber.coord.y + 11)) {
        point.status = 1;      
        climber.coord.pointIndex = index;
        climber.coord.x = point.x;
        climber.coord.y = point.y;
        climber.moveStatus.direction = 0;
        climber.moveStatus.up = 0;
        climber.moveStatus.x = 0;
        climber.moveStatus.y = 0;
          if (point.climbed === 0) {
            point.climbed = 1;
            climber.state.scores += 1;
          }
      } else {
        point.status = 0;
      }
    });
  }

  if (checkDeath(climber) && climber.moveStatus.up !== -1) {
    climber.moveStatus.time = Date.now();
    climber.moveStatus.up = -1;
  }
}

function checkFlag (points, flag) {
  if (points[points.length - 1].status === 1) {
    flag.status = 1;
  } else {
    flag.status = 0;
  }
}

function collisions (climber, stones) {
  let xClimber = climber.coord.x;
  let yClimber = climber.coord.y;
  let widthClimber = climber.state.size.width;
  let heightClimber = climber.state.size.height;

if (climber.moveStatus.up !== -1) {
  for (let i = 0; i < stones.length; i += 1) {
    if ((xClimber + widthClimber > stones[i].coord.x - stones[i].type.diameter / 2) &&
        (xClimber < stones[i].coord.x + stones[i].type.diameter / 2) &&
        (yClimber + heightClimber > stones[i].coord.y - stones[i].type.diameter / 2) &&
        (yClimber < stones[i].coord.y + stones[i].type.diameter / 2)) {
          climber.state.lifes.health -= stones[i].type.damage;
          if (climber.state.lifes.health < 0) {
            climber.state.lifes.health = 0;
          }
          stones.splice(i, 1);
        }
  }
}  
}

function checkStones (stones) {
  let arr = stones.filter((stone, index) => {
    if(stone.coord.y > 1800) {
      stones.splice(index, 1);
    }    
  });
  if (stones.length < AMOUNT_STONES / 2) {
    while (stones.length <= AMOUNT_STONES) {
      stones.push(createStone(collapseStones, typeStones));
    };
  }
}

function checkDeath (climber) {
  if (climber.moveStatus.up !== -1) {
    if (climber.state.lifes.health <= 0) {
      climber.state.lifes.amount -= 1;   
      return true; 
    } 
    return false;
  }
return false;
}

function nullStones (climber, stones) {
  if (climber.state.newLife === 1) {
    stones.length = 0;
  }
}

function checkGameOver (climber) {
  if (climber.state.lifes.amount === 0) {
    SET_GAME = 3;
    stateClimber.moveStatus.time = Date.now();
    return true;
  }
  let end = Date.now();
  if ((end - begin) / 1000 > DURATION_GAME) {
    SET_GAME = 4;
    return true;
  }
return false;
}

function checkWin (climber) {
  if (climber.coord.pointIndex === 5) {
    SET_GAME = 2;
    stateClimber.moveStatus.time = Date.now();
    return true;
  }
  return false;
}

function drawArc() {
  ctx.beginPath();
  ctx.moveTo(300, 500);
  ctx.lineTo(300, 700);
  ctx.arc(300, 700, 200, - Math.PI / 2, (2 * Math.PI) * 0.3 - Math.PI / 2, true);  
  ctx.lineTo(300, 700);
  ctx.fillStyle = '#0F0';
  ctx.stroke();
  // ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  if (SET_GAME === 0) {
    ctx.font = '500px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText('Альпинист', 300, 500);
    ctx.font = '100px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText(`Чтобы достигнуть вершины, у Вас есть три попытки `, 300, 700);
    ctx.fillText(`и ${DURATION_GAME} секунд.`, 300, 900);
    ctx.fillText(`Продвигайтесь вперёд и уворачивайтесь от камней.`, 300, 1100);
    ctx.fillText(`Клавиши управления:`, 300, 1300);
    ctx.fillText(`Назад - 'z', вперёд - 'x', вверх - 's'`, 300, 1500);
    ctx.fillText(`Нажмите клавишу 'Enter', чтобы начать игру`, 300, 1700);
  } 
  // if (checkGameOver(stateClimber)) {
  //   alert ('Вы проиграли.');
  //   return;
  // }
  // if (checkWin(stateClimber)) {
  //   alert ('Вы победили.');
  //   return;
  // }

  if (SET_GAME === 1) {
    points.forEach(point => {drawPoint(point);}); // рисуем пункты 
    nullStones(stateClimber, stones);
    drawStones(stones);
    // drawPterodactyl();
    drawClimber(stateClimber);  
    drawFlag(stateFlag);
    checkPoints(points, stateClimber);
    checkFlag(points, stateFlag);
    collisions (stateClimber, stones);
  
    drawTable(stateClimber);
    checkStones(stones);
    checkWin(stateClimber);
    checkGameOver(stateClimber);
  }

  if (SET_GAME === 2) {
    nullStones(stateClimber, stones);
    drawFlag(stateFlag);
    drawClimber(stateClimber);
    ctx.font = '200px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText('Победа.', 600, 500);
    ctx.font = '100px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText(`Затрачено ${Math.round((stateClimber.moveStatus.time - begin) / 1000)} секунд`, 600, 800);
    ctx.fillText(`Набрано ${stateClimber.state.scores} очков`, 600, 1100);
  }

  if (SET_GAME === 3) {
    nullStones(stateClimber, stones);
    ctx.font = '200px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText('Вы проиграли.', 600, 500);
    ctx.font = '100px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText(`Затрачено ${Math.round((stateClimber.moveStatus.time - begin) / 1000)} секунд`, 600, 800);
    ctx.fillText(`Набрано ${stateClimber.state.scores} очков`, 600, 1100);
  }

  if (SET_GAME === 4) {
    nullStones(stateClimber, stones);
    ctx.font = '200px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText('Время истекло.', 600, 500);
    ctx.fillText('Вы проиграли.', 600, 800);
    ctx.font = '100px Arial';
    ctx.fillStyle = '#F00';
    ctx.fillText(`Набрано ${stateClimber.state.scores} очков`, 600, 1100);
  }
  
  requestAnimationFrame(draw);
}

document.addEventListener('keydown', (e) => {
  if (SET_GAME === 0) {
    if (e.key === 'Enter') {
      SET_GAME = 1;
      begin = Date.now();
    }
  }
  if (stateClimber.moveStatus.direction === 0 && stateClimber.moveStatus.up === 0) { 
    if (e.key === 'z') {
      if (stateClimber.coord.pointIndex !== 0) {
        stateClimber.moveStatus.direction = -1;
        stateClimber.moveStatus.moveIndex = stateClimber.coord.pointIndex - 1;
        stateClimber.moveStatus.move = moves[stateClimber.moveStatus.moveIndex];
      }
    }
    if (e.key === 'x') {
      if (stateClimber.coord.pointIndex !== 5) {
        stateClimber.moveStatus.direction = 1;
        stateClimber.moveStatus.moveIndex = stateClimber.coord.pointIndex;
        stateClimber.moveStatus.move = moves[stateClimber.moveStatus.moveIndex];
      }
    } 
    if (e.key === 's') {
      stateClimber.moveStatus.time = Date.now()
      stateClimber.moveStatus.up = 1;
    }
  }
});

draw();
