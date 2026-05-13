import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Pages (a serem criadas)
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">A carregar...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <div className="text-center p-8"><h1>Dashboard</h1></div> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? <div className="text-center p-8"><h1>Login</h1></div> : <Navigate to="/" />} />
        <Route path="*" element={<div className="text-center p-8"><h1>404 - Página não encontrada</h1></div>} />
      </Routes>
    </Router>
  )
}

export default App
