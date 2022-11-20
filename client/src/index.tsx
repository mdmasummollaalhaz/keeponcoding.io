import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/index.scss'
import App from './App'
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
