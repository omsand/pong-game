import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App not found')
}

app.innerHTML = `
  <canvas 
    id="game"
    width="800"
    height="500">
  </canvas>
`

const canvas = document.querySelector<HTMLCanvasElement>('#game')

if (!canvas) {
  throw new Error('Canvas not found')
}

const ctx = canvas.getContext('2d')

if (!ctx) {
  throw new Error('Canvas context not found')
}


const context = ctx
// the ball
const ball = {
  x: 400,
  y: 250,
  radius: 10,
  speedX: 4,
  speedY: 4,
}


function drawBall() {
  context.beginPath()

  context.arc(
    ball.x,
    ball.y,
    ball.radius,
    0,
    Math.PI * 2
  )

  context.fillStyle = 'white'
  context.fill()
}
// the paddles
const playerPaddle = {
  x: 40,
  y: 200,
  width: 12,
  height: 100,
}
const computerPaddle = {
  x: 748,
  y: 200,
  width: 12,
  height: 100,
}
function drawPaddle(paddle: {
  x: number
  y: number
  width: number
  height: number
}) {
  ctx.fillStyle = 'white'
  ctx.fillRect(
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height
  )
}
// player movement
const keys = {
  w: false,
  s: false,
}
window.addEventListener('keydown', (event) => {
  if (event.key === 'w') {
    keys.w = true
  }

  if (event.key === 's') {
    keys.s = true
  }
})

window.addEventListener('keyup', (event) => {
  if (event.key === 'w') {
    keys.w = false
  }

  if (event.key === 's') {
    keys.s = false
  }
})

function updatePlayerPaddle() {
  if (keys.w) {
    playerPaddle.y = playerPaddle.y - 6
  }

  if (keys.s) {
    playerPaddle.y = playerPaddle.y + 6
  }
}


// clear the screen
function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function updateBall() {
  ball.x = ball.x + ball.speedX
  ball.y = ball.y + ball.speedY


  // bounce off top and bottom walls
  if (
    ball.y + ball.radius >= canvas.height ||
    ball.y - ball.radius <= 0
  ) {
    ball.speedY = ball.speedY * -1
  }


  // bounce off left and right walls
  if (
    ball.x + ball.radius >= canvas.width ||
    ball.x - ball.radius <= 0
  ) {
    ball.speedX = ball.speedX * -1
  }
}
// the game in action
function gameLoop() {
  clearScreen()
  updatePlayerPaddle()
  updateBall()
  drawBall()
  drawPaddle(playerPaddle)
  drawPaddle(computerPaddle)
  requestAnimationFrame(gameLoop)
}
gameLoop()

