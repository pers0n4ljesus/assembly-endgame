import { useState } from 'react'
import { languages } from './language.js'
import clsx from 'clsx'
import { getRandomWord, getFarewellText } from './utils.js'
import Confetti from "react-confetti"

export default function App() {

  const [ currentWord, setCurrentWord ] = useState(() => getRandomWord())

  const [ guess, setGuess ] = useState([])

  const wrongGuessCount = guess.filter(char => !currentWord.includes(char)).length

  const isGameWon = currentWord.split('').every(char => guess.includes(char))

  const isGameOver = (wrongGuessCount >= (languages.length - 1))

  const isGameFinished = !isGameOver && !isGameWon

  const isLastGuessIncorrect = wrongGuessCount > 0 && !currentWord.includes(guess[guess.length]) && isGameFinished

  const mainStatus = isGameWon ? "You Win!" : isGameOver ? "You Lost!" : ""

  const desc = isGameWon ? "Well done! 🎉" : 
    isGameOver ? 
      "You lose! Better start learning Assembly 😭" : 
        isLastGuessIncorrect ? getFarewellText(languages[wrongGuessCount-1].name) :
          ""

  const gameStaus = clsx("banner", {
    "farewell-message": isLastGuessIncorrect
  })

  function validateGuess(char) {
    // let isPresent = false;
    // for (let i=0; i < guess.length; i++) {
    //   if (guess[i] === char) {
    //     isPresent = true;
    //   }
    // }
    // !isPresent ? setGuess(prevGuess => [...prevGuess, char]) : null;
    setGuess(prevGuess =>
      prevGuess.includes(char) ?
        prevGuess :
        [...prevGuess, char]
    )
  }



  const alphabets = "abcdefghijklmnopqrstuvxwyz"

  const generateChips = languages.map((language, index) => {

    const isLanguageLost = index < wrongGuessCount

    const className = clsx("chips", isLanguageLost && "lost")
    return (
      <span 
      key={language.name}
      style={{
        color: language.color, 
        backgroundColor: language.backgroundColor 
      }}
      className={className}
      // className={`chips ${isLanguageLost ? "lost" : ""}`}
    >{language.name}</span>
    )
})


    const gameWord = currentWord
      .split('')
      .map((char, index) => {
        const letterClassName = clsx(
          isGameOver && !guess.includes(char) && "missed-letter"
        )
        return (
          <span key={index}
            className={letterClassName}>
            {
              isGameOver ? char.toUpperCase() :
                guess.includes(char) ?
                  char.toUpperCase() :
                  ''
            }
          </span>
        )
      })

    const keyboard = alphabets
      .split('')
      .map((char) => {
        const isGuessed = guess.includes(char);
        const isCorrect = currentWord.includes(char) && isGuessed;
        const isWrong = !currentWord.includes(char) && isGuessed;

        
        const className = clsx({
          correct: isCorrect,
          wrong: isWrong
        })
        return (
        <button 
          key={char}
          disabled={!isGameFinished}
          aria-disabled={guess.includes(char)}
          aria-label={`Letter ${char}`}
          onClick={() => validateGuess(char)}
          className={className}
          // style={{
          //   backgroundColor: currentWord.includes(char) && guess.includes(char) ? '#10A95B' : guess.includes(char) ? '#EC5D49' : null
          // }}
        >{char.toUpperCase()}</button>
      )
    })

    function resetGame() {
      setCurrentWord(getRandomWord())
      setGuess([])
    }

  return(
    <main>
      {isGameWon && 
        <Confetti 
          recycle={false}
          numberOfPieces={1000}/>
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section 
        aria-live="polite"
        role="status"
        className={gameStaus}
        style={{
          backgroundColor: isGameWon ?
            "#10A95B" : isGameOver ?
              "#BA2A2A" : wrongGuessCount > 0 ? 
                "#7A5EA7" : "transparent"
        }}>
        <p className="main-status">{mainStatus}</p>
        <p className="result-desc">{desc}</p>
      </section>
      
      {/*Combined visually-hidden aria-live region for status updates */} 
      <section 
        className='sr-only'
        aria-live="polite"
        role="status">
          <p> {
              currentWord.includes(guess[guess.length]) ?
                `Correct! The letter ${guess[guess.length]} is in the word.` :
                `Sorry, the letter ${guess[guess.length]} is not in the word.`
            }
            You have {(languages.length-1) - wrongGuessCount} attemps left.
          </p>
          <p>Current word: {currentWord.split("")
            .map(char => guess.includes(char) ? char + "." : "blank.")
              .join(" ")}</p>
      </section>

      <section className="language-chips">
        {generateChips}
      </section>

      <section className='word-boxes'>
        {gameWord}
      </section>

      <section className='keyboard'>
        {keyboard}
      </section>

      {(isGameOver || isGameWon) && 
        <button 
          onClick={resetGame}
          className='new-game'
        >New Game</button>}
    </main>
  )
}