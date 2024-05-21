// import './App.css'
import { useRef } from "react"
function Welcome() {

const name = 'Thaís'
const gender = 'feminino'

const message= gender === 'feminino' ? 'Bem-vinda ' : "Bem-vindo ";

  return (
    <div>
      <h1>{message}{name}</h1>
    </div>
  )
}

export default Welcome;
