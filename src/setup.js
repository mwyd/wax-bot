const initRoot = () => {
  const body = document.querySelector('body')
  const root = document.createElement('div')

  root.classList.add('wxb')

  root.setAttribute('id', 'wxb-root')

  if (!body) {
    throw 'Missing body element'
  }

  body.appendChild(root)

  return root
}

export { initRoot }