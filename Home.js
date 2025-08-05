import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Link } from 'react-router-dom'

export default function Home() {
  const [events, setEvents] = useState([])
  const [teams, setTeams] = useState([])
  const [drivers, setDrivers] = useState([])
  const [news, setNews] = useState([])
  const [standings, setStandings] = useState({ f1: [], f2: [], f3: [] })
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    fetchEvents()
    fetchTeams()
    fetchDrivers()
    fetchNews()
    fetchStandings()

    return () => subscription.unsubscribe()
  }, [])

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true }).limit(5)
    if (data) setEvents(data)
  }

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('name', { ascending: true }).limit(10)
    if (data) setTeams(data)
  }

  const fetchDrivers = async () => {
    const { data } = await supabase.from('drivers').select('*').order('name', { ascending: true }).limit(10)
    if (data) setDrivers(data)
  }

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5)
    if (data) setNews(data)
  }

  const fetchStandings = async () => {
    const { data: f1 } = await supabase.from('constructors').select('*').eq('category', 'F1').order('points', { ascending: false })
    const { data: f2 } = await supabase.from('constructors').select('*').eq('category', 'F2').order('points', { ascending: false })
    const { data: f3 } = await supabase.from('constructors').select('*').eq('category', 'F3').order('points', { ascending: false })
    setStandings({ f1: f1 || [], f2: f2 || [], f3: f3 || [] })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  const sectionStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    minWidth: 280,
    flex: '1 1 300px',
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: '#cc1f1f', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '2.2rem' }}>🏁 Motorsport Hub</h1>
        <nav style={{ marginTop: '1rem' }}>
          {['events', 'teams', 'drivers', 'news'].map(s => (
            <a key={s} href={`#${s}`} style={{ color: 'white', margin: '0 1rem', textDecoration: 'none', fontWeight: 600 }}>
              {s.toUpperCase()}
            </a>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Events */}
        <section style={sectionStyle} id="events">
          <h2>Upcoming Events</h2>
          {events.length === 0 ? <p>No upcoming events.</p> :
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {events.map(ev => (
                <li key={ev.id} style={{ marginBottom: 12 }}>
                  <strong>{ev.name}</strong><br />
                  {new Date(ev.date).toLocaleDateString()} — {ev.location} ({ev.category})
                </li>
              ))}
            </ul>}
        </section>

        {/* Teams */}
        <section style={sectionStyle} id="teams">
          <h2>Teams</h2>
          {teams.length === 0 ? <p>No teams found.</p> :
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {teams.map(t => (
                <li key={t.id} style={{ marginBottom: 10 }}>
                  <strong>{t.name}</strong> ({t.category})
                </li>
              ))}
            </ul>}
        </section>

        {/* Drivers */}
        <section style={sectionStyle} id="drivers">
          <h2>Drivers</h2>
          {drivers.length === 0 ? <p>No drivers found.</p> :
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {drivers.map(d => (
                <li key={d.id} style={{ marginBottom: 10 }}>
                  <strong>{d.name}</strong> #{d.number} — {d.category}
                </li>
              ))}
            </ul>}
        </section>

        {/* NEWS */}
        <section style={{ ...sectionStyle, gridColumn: '1 / -1' }} id="news">
          <h2>Latest News</h2>
          {news.length === 0 ? <p>No news available.</p> :
            news.map(item => (
              <div key={item.id} style={{ marginBottom: '2rem' }}>
                <h3>{item.title}</h3>
                {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100%', borderRadius: 6, marginBottom: '1rem' }} />}
                <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
                <small>Posted on {new Date(item.date || item.created_at).toLocaleDateString()}</small>
              </div>
            ))}
        </section>

        {/* Standings */}
        <section style={sectionStyle}>
          <h2>F1 Constructors</h2>
          {standings.f1.map((team, i) => (
            <p key={team.id}><strong>{i + 1}. {team.name}</strong> — {team.points} pts</p>
          ))}
        </section>

        <section style={sectionStyle}>
          <h2>F2 Constructors</h2>
          {standings.f2.map((team, i) => (
            <p key={team.id}><strong>{i + 1}. {team.name}</strong> — {team.points} pts</p>
          ))}
        </section>

        <section style={sectionStyle}>
          <h2>F3 Constructors</h2>
          {standings.f3.map((team, i) => (
            <p key={team.id}><strong>{i + 1}. {team.name}</strong> — {team.points} pts</p>
          ))}
        </section>
      </main>

      <footer style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#eaeaea', color: '#444' }}>
        {session?.user?.email === 'reesmonty6@gmail.com' && (
          <p>
            <Link to="/dashboard" style={{ color: '#cc1f1f', fontWeight: 'bold', textDecoration: 'none' }}>
              Go to Admin Dashboard
            </Link>
          </p>
        )}
        {session ? (
          <div>
            <p>Welcome, {session.user.email}</p>
            <button onClick={handleSignOut} style={{
              background: '#cc1f1f', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', marginTop: '0.5rem'
            }}>
              Sign Out
            </button>
          </div>
        ) : (
          <p>
            <Link to="/login" style={{ color: '#cc1f1f', textDecoration: 'none' }}>Admin Login</Link>
          </p>
        )}
        <p style={{ marginTop: '1rem' }}>© 2025 Motorsport Hub. All rights reserved.</p>
      </footer>
    </div>
  )
}
