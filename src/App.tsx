import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    // App acts as the route host. We will add a shell/layout wrapper in the next steps.
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
