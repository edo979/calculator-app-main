const switcherEl = document.querySelector('.theme_switcher'),
  keyboardEl = document.querySelector('.calc-app_keyboard'),
  displayEl = document.getElementById('display'),
  themeNames = ['light', 'dark', 'violet']

// Numbers
let firstNum = undefined,
  secondNum = undefined,
  func = undefined,
  displayNum = '0',
  isLastKeyFunc = false

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

  if ('+-/x'.includes(keyPressed)) {
    setNumbers()
    calculate()
    setCalcFun(keyPressed)

    // prevent multiple calculation before entering second number
    if (isLastKeyFunc) {
      return
    } else {
      isLastKeyFunc = true
      return
    }
  }

  // number is entered, prevent calulate with same number over and over ...
  isLastKeyFunc = false

  if (keyPressed == 'DEL') {
    displayNum = 0
    updateDisplay('0')
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
  if (keyPressed == '.' && displayNum.includes('.')) {
    return
  }

  if (displayNum == '0') {
    if (keyPressed == '.') {
      displayNum = '0.'
    } else {
      displayNum = keyPressed
    }
  } else {
    displayNum = displayNum + '' + keyPressed
  }

  displayEl.value = displayNum
}

function getNumber() {
  number = displayEl.value
  if (number.includes('.')) {
    return parseFloat(number)
  } else {
    return parseInt(number)
  }
}

function setNumbers() {
  if (firstNum === undefined) {
    firstNum = getNumber()
  } else {
    secondNum = getNumber()
  }
  displayNum = '0'
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
  if (secondNum == undefined) {
    return
  }

  // store result in first number
  firstNum = func(firstNum, secondNum)
  displayEl.value = firstNum

  // must build second number
  secondNum = undefined
}
