import { useState } from 'react'
import CurrencyConverter from './components/CurrencyConverter';

function App() {

  const [count, setCount] = useState(0)

  return (
    <div className='mt-10 min-h-vh flex flex-col items-center justify-center'>
      <CurrencyConverter />
    </div>
  )
}

export default App
