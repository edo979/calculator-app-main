const switcherEl = document.querySelector('.theme_switcher'),
  keyboardEl = document.querySelector('.calc-app_keyboard'),
  displayEl = document.getElementById('display'),
  themeNames = ['light', 'dark', 'violet']

// Numbers
let firstNum = undefined,
  secondNum = undefined,
  isNewNumber = true,
  func = undefined

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

  if (keyPressed == '=') {
    calculate()
    return
  }

  if ('+-/x'.includes(keyPressed)) {
    if (secondNum != undefined) {
      calculate()
    }

    setCalcFun(keyPressed)
    isNewNumber = true
    return
  }

  if (keyPressed == 'DEL') {
    displayEl.value = 0
    return
  }

  if (keyPressed == 'RESET') {
    displayEl.value = '0'
    firstNum = undefined
    secondNum = undefined
    func = undefined
    isNewNumber = true
    return
  }

  updateDisplay(keyPressed)
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

function updateDisplay(keyPressed) {
  if (isNewNumber) {
    displayEl.value = '0'
    isNewNumber = false
  }

  if (keyPressed == '.' && displayEl.value.includes('.')) {
    return
  }

  if (displayEl.value == '0') {
    if (keyPressed == '.') {
      displayEl.value = '0.'
    } else {
      displayEl.value = keyPressed
    }
  } else {
    displayEl.value = displayEl.value + keyPressed
  }

  setNumbers()
}

function stringToNumber() {
  const number = displayEl.value

  if (number.includes('.')) {
    return parseFloat(number)
  } else {
    return parseInt(number)
  }
}

function setNumbers() {
  if (func == undefined) {
    firstNum = stringToNumber()
  } else {
    secondNum = stringToNumber()
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
    case 'x':
      func = (num1, num2) => num1 * num2
      return

    default:
      func = (num1, num2) => num1 + num2
  }
}

function calculate() {
  if (secondNum == undefined || func == undefined) {
    return
  }

  // store result in first number
  firstNum = func(firstNum, secondNum)
  displayEl.value = firstNum

  // prepare for new calculate
  secondNum = undefined
  func = undefined
}
