export const handleToggle = () => {
  const htmlEl = document.documentElement

  htmlEl.classList.toggle('dark')
  if (htmlEl.classList.value.includes('dark')) {
    localStorage.theme = 'dark'
  } else {
    localStorage.theme = 'light'
  }
}
