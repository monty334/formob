import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Dashboard from './Dashboard'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // 1. Load session once on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const userEmail = session?.user?.email

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={
            session && userEmail === 'reesmonty6@gmail.com' ? (
              <Dashboard session={session} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}
