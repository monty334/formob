import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('Error sending login link. Please try again.')
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff5f5',
      padding: '1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    formBox: {
      backgroundColor: 'white',
      padding: '2.5rem 3rem',
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(204, 31, 31, 0.25)',
      maxWidth: '400px',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'center',
      color: '#7f1d1d',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      fontWeight: '700',
      color: '#cc1f1f',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      marginBottom: '1.25rem',
      borderRadius: '8px',
      border: '2px solid #cc1f1f',
      fontSize: '1rem',
      outlineColor: '#cc1f1f',
      boxSizing: 'border-box',
      color: '#7f1d1d',
    },
    button: {
      backgroundColor: '#cc1f1f',
      border: 'none',
      color: 'white',
      padding: '0.9rem 1.5rem',
      fontSize: '1.1rem',
      fontWeight: '700',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      backgroundColor: '#e59b9b',
      cursor: 'not-allowed',
    },
    message: {
      marginTop: '1rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#7f1d1d',
    },
    footer: {
      marginTop: '2rem',
      fontSize: '0.9rem',
      color: '#7f1d1d',
    },
  }

  return (
    <div style={styles.container}>
      <form style={styles.formBox} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login to Admin Dashboard</h2>
        <input
          style={styles.input}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Login Link'}
        </button>
        {message && <div style={styles.message}>{message}</div>}
        <div style={styles.footer}>
          Powered by Motorsport Hub © 2025
        </div>
      </form>
    </div>
  )
}
