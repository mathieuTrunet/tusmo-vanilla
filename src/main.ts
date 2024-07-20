import './style.css'

export type LetterState = 'wrong' | 'partial' | 'good'
export type UserTry = { input: string; state: LetterState[] }

const wordToFind = 'funeraire'

let input: string = ''
let progress: UserTry[] = []

const handleKeyboard = (event: KeyboardEvent) => {
  const [_firstLetter, ...wordToFindMinusFirstLetter] = wordToFind
  const { key: pressedKey, isTrusted } = event

  if (!isTrusted) return

  if (pressedKey === 'Backspace') return (input = input.slice(0, -1))

  if (wordToFindMinusFirstLetter.length === input.length) {
    if (pressedKey !== 'Enter') return

    const userTry = getUserTry(input, wordToFindMinusFirstLetter)

    progress = [...progress, userTry]

    input = ''
  }

  if (!pressedKey.match(/^[a-z]$/i)) return

  input += pressedKey.toLowerCase()
}

const handleInteraction = (event: KeyboardEvent) => {
  handleKeyboard(event)

  updatePage()
}

const getUserTry = (input: string, wordToFind: string[]) => {
  const compareState = [...input].map((letter, key) => {
    if (letter === wordToFind[key]) return 'good'

    if (wordToFind.includes(letter)) return 'partial'

    return 'wrong'
  })
  return { input: input, state: compareState }
}

const getLetterHolder = (letter: string, state?: string) => `<span class="${state}">${letter ?? '_'}</span>`

const getInputRow = (wordToFind: string, input: string, letterStateList: LetterState[]) => {
  const [firstLetter, ...restOfTheWord] = wordToFind

  const firstLetterHolder = getLetterHolder(firstLetter, 'good')

  const restOfLettersHolders = restOfTheWord.reduce(
    (content, _letter, index) => content + getLetterHolder([...input][index], letterStateList[index]),
    ''
  )

  return `<div>${firstLetterHolder}${restOfLettersHolders}</div>`
}

const updatePage = () => {
  const title = `<h1>TUSMO + VANILLA</h1>`

  const currentInputRow = getInputRow(wordToFind, input, [])

  const previousInputsRows = progress.reduce(
    (content, userTry) => content + getInputRow(wordToFind, userTry.input, userTry.state),
    ''
  )

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = title + previousInputsRows + currentInputRow
}

document.addEventListener('keydown', handleInteraction)

updatePage()
