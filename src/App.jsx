import TopAppBar from './components/TopAppBar.jsx'
import Home from './pages/Home.jsx'
import './styles/global.css'

export default function App() {
  return (
    <div className="app-layout">
      <TopAppBar />
      <main className="app-content">
        <Home />
      </main>
    </div>
  )
}
