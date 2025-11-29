import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavigationPanel from './components/NavigationPanel'
import Introduction from './components/Introduction';
import Description from './components/Description';
import Statistics from './components/Statistics';
import APITab from './components/API';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <NavigationPanel/>
        <Routes>
          <Route path="/pages/1" element={<Introduction id={1} />} />
          <Route path="/pages/2" element={<Description id={2} />} />
          <Route path="/pages/3" element={<Statistics id={3} />} />
          <Route path="/pages/4" element={<APITab id={4}/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


{/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}