const climber = document.querySelector('.climber');
const flag = document.querySelector('.flag');
const road = [];

  for (let i = 0; i < 6; i += 1) {
    road.push(i + 1);
  }

let index = 0;

document.addEventListener('keydown', (e) => {
  if ((e.key == 'z') && (index > 0)) {
    climber.classList.remove(`point${road[index]}`);
    index -= 1;
    climber.classList.add(`point${road[index]}`);
  }

  if ((e.key == 'x') && (index < 5)) {
    climber.classList.remove(`point${road[index]}`);
    index += 1;
    climber.classList.add(`point${road[index]}`);
  }

  if (index == 5) {
    flag.classList.remove('flag-start');
  } else {
    flag.classList.add('flag-start');
  }
})
