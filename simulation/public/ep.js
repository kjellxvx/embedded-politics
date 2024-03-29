const socket = new WebSocket('ws://localhost:4441')
const state = {
  models: new Set(),
  history: []
}

socket.addEventListener('message', event => {
  const msg = JSON.parse(event.data)
  console.log(msg)

  if (msg.hasOwnProperty('clear')) return clear()
  handle(msg)
})

function handle (s) {
  state.history.push(s)
  log(s)
  ui(s)
}

function log (s) {
  const style = `background: blue; color: white; font-size: 2em;`
  console.clear()
  Object.keys(s.survey.model).map(d => {
    console.log('\n'.repeat(1))
    console.log(`%c${d}`, `${style} font-weight: bold;`)
    console.log(`%c${s.survey.model[d]}`, style)
    if (d == "icon") {
      const iconElement = document.querySelector('.icon'); // Assuming there is only one icon in your HTML
    if (iconElement) {
      iconElement.src = `icons/${s.survey.model[d]}`;
    }
    } else {
      document.querySelector(`#${d}`).innerText = s.survey.model[d]
    }
  })

  const unixTimestamp = s.survey.date
  console.log('\n'.repeat(1))
  console.log(`%ctimestamp`, `${style} font-weight: bold;`)
  const timestampLength = unixTimestamp.toString().length
  const timestampMilliseconds =
    timestampLength === 10 ? unixTimestamp * 1000 : unixTimestamp
  const formattedDate = new Date(timestampMilliseconds).toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  )
  console.log(`%c${formattedDate}`, style)
  document.querySelector('#timestamp').innerText = formattedDate
}

function ui (s) {
  //console.log(s)
  addDot(s.survey.score, null, null, s.survey.model.icon)
  if (state.models.has(s.survey.model.name)) {
    const dot = document.getElementById(s.survey.model.name)
    const score = avg(s.survey.model.name)
    dot.style = `left: ${map(score[0])}px; top: ${map(score[1]) * -1}px;`
  } else {
    state.models.add(s.survey.model.name)
    addDot(
      avg(s.survey.model.name),
      s.survey.model.name,
      s.survey.model.displayname,
      s.survey.model.icon
    )
  }
}

function avg (model) {
  const surveys = state.history
    .filter(h => h.survey.model.name === model)
    .map(s => s.survey)
  return surveys
    .reduce(
      (sum, s) => {
        sum[0] += s.score[0]
        sum[1] += s.score[1]
        return sum
      },
      [0, 0]
    )
    .map(sum => sum / surveys.length)
}

function addDot (score, model, displayname, icon) {
  const a = document.getElementById('answers')
  const dot = document.createElement('img')
  dot.classList.add('dot')
  if (model) {
    dot.classList.add('model')
    dot.id = model
    dot.setAttribute('data-model', displayname)
  }
  dot.src = `icons/${icon}`
  dot.style = `left: ${map(score[0])}px; top: ${map(score[1]) * -1}px;`
  dot.setAttribute('data-score', score.toString())
  a.appendChild(dot)
}

function map (v) {
  const w = Number(
    getComputedStyle(document.body)
      .getPropertyValue('--compass-size')
      .replace('px', '')
  )
  return v * (w / 2 / 10)
}

function clear () {
  const a = document.getElementById('answers')
  a.innerHTML = ''

  state.models = new Set()
  state.history = []
}
