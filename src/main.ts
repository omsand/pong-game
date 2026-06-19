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