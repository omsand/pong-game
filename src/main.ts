import './style.css'
import type { Paddle } from './type'

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
function drawPaddle(paddle: Paddle) {
  ctx.fillStyle = 'white'
  ctx.fillRect(
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height
  )
}
// points
let playerScore = 0
let computerScore = 0

let gameOver = false
const winningScore = 1

function resetBall() {
  ball.x = canvas.width / 2
  ball.y = canvas.height / 2

  if (ball.speedX > 0) {
    ball.speedX = -4
  } else {
    ball.speedX = 4
  }

  ball.speedY = 4
  console.log('reset ball', ball)
}

function drawScore() {
  ctx.fillStyle = 'white'
  ctx.font = '32px Arial'
  ctx.fillText(`${playerScore}`, 300, 50)
  ctx.fillText(`${computerScore}`, 480, 50)
}
// GAME OVER :(
  function drawGameOver() {
    ctx.fillStyle = 'white'
    ctx.font = '40px Arial'
  
    if (playerScore >= winningScore) {
      ctx.fillText('You Win!', 310, 220)
    }
  
    if (computerScore >= winningScore) {
      ctx.fillText('You Lose!', 310, 220)
    }
  
    ctx.font = '20px Arial'
    ctx.fillText('Press Space to restart', 300, 270)
  }

  function checkWinner() {
    if (
      playerScore >= winningScore ||
      computerScore >= winningScore
    ) {
      gameOver = true
    }
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

  if (event.code === 'Space' && gameOver) {
    playerScore = 0
    computerScore = 0
  
    gameOver = false
  
    resetBall()
  } 
})

function updatePlayerPaddle() {
  if (keys.w) {
    playerPaddle.y = playerPaddle.y - 15
  }

  if (keys.s) {
    playerPaddle.y = playerPaddle.y + 15
  }
}
// Centre line
function drawCenterLine() {
  ctx.fillStyle = 'white'

  for (let y = 0; y < canvas.height; y = y + 30) {
    ctx.fillRect(canvas.width / 2 - 2, y, 4, 15)
  }
}

function keepPaddleInBounds(paddle: {
  x: number
  y: number
  width: number
  height: number
}) {
  if (paddle.y < 0) {
    paddle.y = 0
  }

  if (paddle.y + paddle.height > canvas.height) {
    paddle.y = canvas.height - paddle.height
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
    ball.speedY = ball.speedY * -1.0
  }

  // bounce off left and right walls
  if (ball.x < 0) {
    computerScore = computerScore + 1
    resetBall()
  }

  if (ball.x > canvas.width) {
    playerScore = playerScore + 1
    resetBall()
  }
}

// ball hits paddles
function checkPaddleCollision() {

  // player paddle collision
  if (
    ball.x - ball.radius <= playerPaddle.x + playerPaddle.width &&
    ball.y >= playerPaddle.y &&
    ball.y <= playerPaddle.y + playerPaddle.height
  ) {
    ball.speedX = ball.speedX * -1.1
  }


  // computer paddle collision
  if (
    ball.x + ball.radius >= computerPaddle.x &&
    ball.y >= computerPaddle.y &&
    ball.y <= computerPaddle.y + computerPaddle.height
  ) {
    ball.speedX = ball.speedX * -1.1
  }
}

// computer movement
function updateComputerPaddle() {
  const paddleCenter = computerPaddle.y + computerPaddle.height / 2

  if (paddleCenter < ball.y) {
    computerPaddle.y = computerPaddle.y + 4
  }

  if (paddleCenter > ball.y) {
    computerPaddle.y = computerPaddle.y - 4
  }
}
// the game in action
function gameLoop() {
  clearScreen()

  if (gameOver) {
    drawGameOver()
    requestAnimationFrame(gameLoop)
    return
  }

  updatePlayerPaddle()
  updateComputerPaddle()
  keepPaddleInBounds(playerPaddle)
  keepPaddleInBounds(computerPaddle)
  updateBall()
  checkPaddleCollision()
  checkWinner()

  drawCenterLine()
  drawPaddle(playerPaddle)
  drawPaddle(computerPaddle)
  drawBall()
  drawScore()

  requestAnimationFrame(gameLoop)
}
gameLoop()

