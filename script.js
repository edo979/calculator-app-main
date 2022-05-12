const switcherEl = document.querySelector('.theme_switcher'),
  keyboardEl = document.querySelector('.calc-app_keyboard'),
  displayEl = document.getElementById('display'),
  themeNames = ['light', 'dark', 'violet']

// Numbers
let a = 0,
  b = undefined,
  func = undefined,
  lastKey = 'num',
  isBnumberBuild = false

// detect color scheme
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  setActivThemeSwitch(switcherEl.children[1])
}

// event listenerts
// theme change listeners
switcherEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('theme_switch')) {
    setActivThemeSwitch(e.target)

    changeTheme(parseInt(e.target.dataset.switch))
  }
})

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (event) => {
    const newColorScheme = event.matches ? 'dark' : 'light'

    if (newColorScheme == 'dark') {
      setActivThemeSwitch(switcherEl.children[1])
    } else {
      setActivThemeSwitch(switcherEl.children[0])
    }
  })

// calc key listeners
// using mouse click
keyboardEl.addEventListener('click', (e) => {
  const keyPressed = e.target.value

  if (keyPressed == '+') {
    lastKey = 'func'
    setNumber()
    setCalcFun('+')
    return
  }

  createNumberOnDisplay(keyPressed)
  lastKey = 'num'
})

// functions for changing theme

function changeTheme(themeNumber) {
  document.querySelector('body').classList = themeNames[themeNumber - 1]
}

function setActivThemeSwitch(switchEl) {
  Array.from(switcherEl.children).forEach((btn) =>
    btn.classList.remove('theme_switch--active')
  )

  switchEl.classList.add('theme_switch--active')
}

// function for calc app

function createNumberOnDisplay(keyPressed) {
  numKeyEntered = true

  if (keyPressed == 'DEL') {
    displayEl.value = '0'
    return
  }

  if (lastKey == 'func') {
    displayEl.value = 0
  }

  const displayValue = displayEl.value

  if (displayValue == '0') {
    if (keyPressed != '.') {
      displayEl.value = keyPressed
      return
    }
  }

  if (keyPressed == '.' && displayValue.includes('.')) {
    return
  }

  displayEl.value = displayValue + keyPressed
}

function getNumber() {
  number = displayEl.value
  if (number.includes('.')) {
    return parseFloat(number)
  } else {
    return parseInt(number)
  }
}

function setNumber() {
  if (func === undefined) {
    // set first number
    a = getNumber()
  } else {
    if (b === undefined && lastKey == 'func') {
      b = getNumber()

      calculate()
    }
  }
}

function setCalcFun(mathOperator) {
  switch (mathOperator) {
    case '+':
      func = (num1, num2) => num1 + num2
      return
    case '-':
      func = (num1, num2) => num1 - num2
      return
    case '/':
      func = (num1, num2) => num1 / num2
      return
    case '*':
      func = (num1, num2) => num1 * num2
      return

    default:
      func = (num1, num2) => num1 + num2
  }
}

function calculate() {
  // store result in first number
  a = func(a, b)
  displayEl.value = a

  // prepere new calculation
  b = undefined
  isBnumberBuild = false
}
