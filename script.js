const switcherEl = document.querySelector('.theme_switcher'),
  keyboardEl = document.querySelector('.calc-app_keyboard'),
  displayEl = document.getElementById('display')

// Numbers
let firstNum = undefined,
  secondNum = undefined,
  isNewNumber = true,
  func = undefined

// Theme
// Get from Local Storage
const themeName = getThemeFromStorage()
if (themeName) {
  // load from storage
  addClassToBodyEl(themeName)

  const switchEl = switcherEl.querySelector(`*[data-switch='${themeName}'`)

  setActivThemeSwitch(switchEl)
} else {
  // detect color scheme
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    setActivThemeSwitch(switcherEl.children[1])
  }
}

// event listenerts
// theme change listeners
switcherEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('theme_switch')) {
    setActivThemeSwitch(e.target)

    addClassToBodyEl(e.target.dataset.switch)

    saveTheme(e.target.dataset.switch)
  }
})

// calc key listeners
// using mouse click
keyboardEl.addEventListener('click', (e) => {
  const keyPressed = e.target.value
  if (isFuncKeyPress(keyPressed)) {
    return
  }

  updateDisplay(keyPressed)
})
displayEl.addEventListener('keydown', (e) => {
  e.preventDefault()
  let keyPress = e.key

  if (keyPress == 'Backspace') {
    isFuncKeyPress('DEL')
    return
  }
  if (keyPress == 'Delete') {
    isFuncKeyPress('RESET')
    return
  }
  if (keyPress == 'Enter') {
    isFuncKeyPress('=')
    return
  }
  if (keyPress == '*') {
    keyPress = 'x'
  }

  if ('0123456789/x-+,'.includes(keyPress)) {
    if (isFuncKeyPress(keyPress)) {
      return
    }

    updateDisplay(keyPress)
  }
})

// functions for changing theme

function addClassToBodyEl(themeName) {
  document.querySelector('body').classList = themeName
}

function setActivThemeSwitch(switchEl) {
  Array.from(switcherEl.children).forEach((btn) =>
    btn.classList.remove('theme_switch--active')
  )

  switchEl.classList.add('theme_switch--active')
}

// function for calc app

function isFuncKeyPress(keyPressed) {
  if (keyPressed == '=') {
    calculate()
    return true
  }

  if ('+-/x'.includes(keyPressed)) {
    if (firstNum == undefined) {
      firstNum = 0
    }

    if (secondNum != undefined) {
      calculate()
    }

    setCalcFun(keyPressed)
    isNewNumber = true
    return true
  }

  if (keyPressed == 'DEL') {
    displayEl.value = 0
    return true
  }

  if (keyPressed == 'RESET') {
    displayEl.value = '0'
    firstNum = undefined
    secondNum = undefined
    func = undefined
    isNewNumber = true
    return true
  }

  return false
}

function updateDisplay(keyPressed) {
  if (isNewNumber) {
    displayEl.value = '0'
    isNewNumber = false
  }

  if (keyPressed == ',' && displayEl.value.includes(',')) {
    return
  }

  if (displayEl.value == '0') {
    if (keyPressed == ',') {
      displayEl.value = '0,'
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

  if (number.includes(',')) {
    return parseFloat(number.replace(',', '.'))
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
  displayEl.value = firstNum.toString().replace('.', ',')

  // prepare for new calculate
  secondNum = undefined
  func = undefined
}

// Local Storage For Theme
function saveTheme(themeName) {
  localStorage.setItem('theme', themeName)
}

function getThemeFromStorage() {
  return localStorage.getItem('theme')
}
