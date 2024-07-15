import './style.css'

export type LetterState = 'wrong' | 'partial' | 'good'
export type UserTry = { input: string; state: LetterState[] }

const wordToFind = 'funeraire'

let input: string = ''
let progress: UserTry[] = []

const handleKeyboard = (event: KeyboardEvent) => {
  const [, ...restOfTheWord] = wordToFind
  const { key: pressedLetter, isTrusted } = event

  if (!isTrusted) return

  if (pressedLetter === 'Backspace') {
    input = input.slice(0, -1)

    return updatePage()
  }

  if (restOfTheWord.length === input.length) {
    if (pressedLetter !== 'Enter') return

    const userTry = getUserTry(input.toLowerCase(), restOfTheWord.join(''))

    progress = [...progress, userTry]

    input = ''

    return updatePage()
  }

  if (!pressedLetter.match(/^[a-z]$/i)) return

  input += pressedLetter

  updatePage()
}

const getUserTry = (input: string, wordToFind: string) => {
  const compareState = [...input].map((letter, key) => {
    if (letter === wordToFind[key]) return 'good'

    if (wordToFind.includes(letter)) return 'partial'

    return 'wrong'
  })
  return { input: input, state: compareState }
}

const getInputRow = (wordToFind: string, input: string, letterStateList: LetterState[]) => {
  const [firstLetter, ...restOfTheWord] = wordToFind

  const content = restOfTheWord
    .map((_letter, index) => `<span id="${letterStateList[index]}">${[...input][index] ?? '_'}</span>`)
    .join('')

  return `<div><span id="good">${firstLetter}</span> ${content}</div>`
}

const updatePage = () =>
  (document.querySelector<HTMLDivElement>('#app')!.innerHTML =
    `<h1>TUSMO + VANILLA</h1>` +
    progress.map(userTry => getInputRow(wordToFind, userTry.input, userTry.state)).join('') +
    getInputRow(wordToFind, input, []))

document.addEventListener('keydown', event => handleKeyboard(event))

updatePage()
