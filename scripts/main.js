// Оголошення зміних та ініціалізаця налаштувань гри
let scoreBlock; // DOM-елемент для відображення рахунку
let score = 0; // Поточний рахунок
let isPaused = false; // Прапор для відстеження стану паузи


const config = {
	step: 0, // Лічильник для контролю швидкості гри
	maxStep: 6, // Максимальна кількість кроків перед оновленням стану гри
	sizeCell: 16, // Розмір кожної клітинки на ігровій сітці
	sizeBerry: 16 / 4 // Розмір ягоди (їжі) на ігровій сітці
}

const snake = {
	x: 160, // Початкова позиція змійки по горизонталі
	y: 160, // Початкова позиція змійки по вертикалі
	dx: config.sizeCell, // Швидкість змійки по горизонталі
	dy: 0, // Швидкість змійки по вертикалі
	tails: [], // Масив для збереження координат хвоста змійки
	maxTails: 3 // Максимальна довжина хвоста змійки
}

let berry = {   // Початкова позиція ягоди 
	x: 0,
	y: 0 
} 


let canvas = document.querySelector("#game-canvas"); // Отримання посилання на елемент <canvas>
let context = canvas.getContext("2d"); // Отримання контексту для малювання на <canvas>
scoreBlock = document.querySelector(".game-score .score-count"); // Отримання посилання на елемент, що відображає рахунок
drawScore(); // Ініціалізація відображення рахунку

function gameLoop() {
  requestAnimationFrame(gameLoop); // Функція викликає себе рекурсивно для оновлення гри на кожен кадр

  if (++config.step < config.maxStep) {
    return; // Перевірка, чи досягнута максимальна кількість кроків
  }
  config.step = 0; // Скидання лічильника кроків

  context.clearRect(0, 0, canvas.width, canvas.height); // Очищення <canvas>

  drawBerry(); // Малювання ягоди
  drawSnake(); // Малювання змійки

  if (isGameOver()) {
    refreshGame(); // Перезапуск гри при проигрыше
	}
	
	if (isPaused) {
    return; // Если игра приостановлена, просто выходим из функции
  }
}

requestAnimationFrame(gameLoop); // Початок гри (виклик першого кадру)

function drawSnake() {
	snake.x += snake.dx; // Зміна позиції змійки по горизонталі
	snake.y += snake.dy; // Зміна позиції змійки по вертикалі

	collisionBorder(); // Перевірка зіткнення змійки з межами гри

	snake.tails.unshift({ x: snake.x, y: snake.y }); // Додавання нової клітинки до хвоста змійки

	if (snake.tails.length > snake.maxTails) {
		snake.tails.pop(); // Видалення останньої клітинки з хвоста змійки, якщо довжина перевищує максимальну
	}

	snake.tails.forEach(function (el, index) {
		if (index == 0) {
			context.fillStyle = "#008000"; // Колір голови змійки
		} else {
			context.fillStyle = "#32CD32"; // Колір решти клітинок змійки
		}
		context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell); // Малювання квадратної клітинки змійки

		if (el.x === berry.x && el.y === berry.y) {
			snake.maxTails++; // Зміна максимальної довжини хвоста
			incScore(); // Збільшення рахунку
			randomPositionBerry(); // Випадкове розміщення нової ягоди
		}

		for (let i = index + 1; i < snake.tails.length; i++) {
			if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
				refreshGame(); // Перезапуск гри при зіткненні змійки зі своїм хвостом
			}
		}
	});
}

function collisionBorder() {
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell; // Переміщення змійки на протилежний бік екрану при виході за межі
	} else if (snake.x >= canvas.width) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if (snake.y >= canvas.height) {
		snake.y = 0;
	}
}

function refreshGame() {
  alert("Игра окончена. Набрано очков: " + score); // Выводит сообщение о проигрыше и набранных очках
  score = 0; // Скидання рахунку
  drawScore(); // Оновлення відображеня рахунку

  snake.x = 160; // Початкова позиція змійки
  snake.y = 160;
  snake.tails = []; // Очищення хвоста змійки
  snake.maxTails = 3; // Початкова довжина хвоста
  snake.dx = config.sizeCell; // Початкова швидкість змійки по горизонталі
  snake.dy = 0; // Початкова швидкість змійки по вертикалі

  randomPositionBerry(); // Випадкове розміщення ягоди
}


function drawBerry() {
	context.beginPath();
	context.fillStyle = "#A00034"; // Колір ягоди
	context.arc(
		berry.x + config.sizeCell / 2,
		berry.y + config.sizeCell / 2,
		config.sizeBerry,
		0,
		2 * Math.PI
	); // Малювання круглої ягоди
	context.fill();
}

function randomPositionBerry() {
	berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell; // Випадкова позиція ягоди по горизонталі
	berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell; // Випадкова позиція ягоди по вертикалі
}

function incScore() {
	score++; // Збільшення рахунку
	drawScore(); // Оновлення відображення рахунку
}

function drawScore() {
	scoreBlock.innerHTML = score; // Відображення рахунку на сторінці
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min); // Генерація випадкового цілого числа
}

document.addEventListener("keydown", function (e) {
	if (e.code == "KeyW") {
		snake.dy = -config.sizeCell; // Зміна швидкості змійки при натисканні клавіші "W"
		snake.dx = 0;
	} else if (e.code == "KeyA") {
		snake.dx = -config.sizeCell; // Зміна швидкості змійки при натисканні клавіші "A"
		snake.dy = 0;
	} else if (e.code == "KeyS") {
		snake.dy = config.sizeCell; // Зміна швидкості змійки при натисканні клавіші "S"
		snake.dx = 0;
	} else if (e.code == "KeyD") {
		snake.dx = config.sizeCell; // Зміна швидкості змійки при натисканні клавіші "D"
		snake.dy = 0;
	} else if (e.code === "Space") {
    isPaused = !isPaused; // Инвертируем значение флага isPaused при нажатии клавиши Space
    if (isPaused) {
      // Если игра приостановлена, выводим сообщение
      alert("Игра приостановлена");
    }
  }
});

function isGameOver() {
  for (let i = 1; i < snake.tails.length; i++) {
    if (snake.x === snake.tails[i].x && snake.y === snake.tails[i].y) {
      return true; // Если змейка столкнулась с собственным хвостом, возвращаем true
    }
  }
  return false;
}

