const switcherEl = document.querySelector('.theme_switcher')

switcherEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('theme_switch')) {
    Array.from(switcherEl.children).forEach((btn) =>
      btn.classList.remove('theme_switch--active')
    )

    e.target.classList.add('theme_switch--active')
  }
})
