import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Page from './Page.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Page/>
  )
}

export default App
