const blessed = require('blessed')

const screen = blessed.screen({
  smartCSR: true
})
screen.title = 'Embedded Politics'

const t = blessed.text({
  top: 0,
  left: 0,
  width: '100%',
  height: screen.height - 2,
  content: '',
  scrollable: true,
  tags: true,
  scrollback: 0
})

const bl = blessed.text({
  top: t.height + 1,
  left: 0,
  width: '50%',
  height: 1,
  content: '',
  tags: true
})

const br = blessed.text({
  top: t.height + 1,
  right: 0,
  width: 13 + 1 + 11,
  height: 1,
  content: '',
  tags: true,
  align: 'right'
})

screen.append(t)
screen.append(bl)
screen.append(br)

function ui (c) {
  if (c.index === 1) {
    clearTextElement()
    screen.clearRegion(0, 0, screen.width, screen.height)
  }
  t.pushLine(`\n${c.answer.statement}\n${c.answer.answer}`)
  t.setScrollPerc(100)
  bl.setContent(`Model {bold}${c.survey.model.name}{/bold}`)
  const wow = new Date(c.survey.date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  br.setContent(
    `${wow} [{bold}${String(c.index).padStart(2, '0')}{/bold}/64]`
  )
  screen.render()
}

function clearTextElement () {
  t.setContent('')
  screen.render()
}

module.exports = {
  ui
}
