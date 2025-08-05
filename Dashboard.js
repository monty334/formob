import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {// eslint-disable-next-line
  const navigate = useNavigate()

  // --- News States ---
  const [newsItems, setNewsItems] = useState([])
  const [newsDate, setNewsDate] = useState('')
  const [newsTitle, setNewsTitle] = useState('')
  const [newsText, setNewsText] = useState('')
  const [newsImage, setNewsImage] = useState(null)
  const [newsUploading, setNewsUploading] = useState(false)

  // --- Events States ---
  const [events, setEvents] = useState([])
  const [eventDate, setEventDate] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventCategory, setEventCategory] = useState('')

  // --- Teams States ---
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useState('')
  const [teamCategory, setTeamCategory] = useState('')

  // --- Drivers States ---
  const [drivers, setDrivers] = useState([])
  const [driverName, setDriverName] = useState('')
  const [driverNumber, setDriverNumber] = useState('')
  const [driverTeam, setDriverTeam] = useState('')
  const [driverCategory, setDriverCategory] = useState('')

  // --- Constructors States ---
  const [constructors, setConstructors] = useState([])
  const [constructorTeamName, setConstructorTeamName] = useState('')
  const [constructorPoints, setConstructorPoints] = useState('')
  const [constructorCategory, setConstructorCategory] = useState('')

  // Load data on mount
  useEffect(() => {
    fetchNews()
    fetchEvents()
    fetchTeams()
    fetchDrivers()
    fetchConstructors()
  }, [])

  // --- Fetch functions ---
  async function fetchNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
      .limit(10)
    if (!error) setNewsItems(data)
  }

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (!error) setEvents(data)
  }

  async function fetchTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true })
    if (!error) setTeams(data)
  }

  async function fetchDrivers() {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name', { ascending: true })
    if (!error) setDrivers(data)
  }

  async function fetchConstructors() {
    const { data, error } = await supabase
      .from('constructors')
      .select('*')
      .order('points', { ascending: false })
    if (!error) setConstructors(data)
  }

  // --- Add News ---
  async function handleAddNews(e) {
    e.preventDefault()
    if (!newsDate || !newsTitle || !newsText) {
      alert('Please fill in date, title, and text')
      return
    }

    setNewsUploading(true)
    let image_url = null
    if (newsImage) {
      const fileExt = newsImage.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('news-images')
        .upload(fileName, newsImage)
      if (error) {
        alert('Image upload error: ' + error.message)
        setNewsUploading(false)
        return
      }
      image_url = data.path
    }

    const { error } = await supabase.from('news').insert([
      {
        date: newsDate,
        title: newsTitle,
        text: newsText,
        image_url,
      },
    ])

    if (error) {
      alert('Error adding news: ' + error.message)
    } else {
      alert('News added!')
      setNewsDate('')
      setNewsTitle('')
      setNewsText('')
      setNewsImage(null)
      fetchNews()
    }
    setNewsUploading(false)
  }

  // --- Add Event ---
  async function handleAddEvent(e) {
    e.preventDefault()
    if (!eventDate || !eventName || !eventLocation || !eventCategory) {
      alert('Please fill all event fields')
      return
    }

    const { error } = await supabase.from('events').insert([
      {
        date: eventDate,
        name: eventName,
        location: eventLocation,
        category: eventCategory,
      },
    ])

    if (error) {
      alert('Error adding event: ' + error.message)
    } else {
      alert('Event added!')
      setEventDate('')
      setEventName('')
      setEventLocation('')
      setEventCategory('')
      fetchEvents()
    }
  }

  // --- Add Team ---
  async function handleAddTeam(e) {
    e.preventDefault()
    if (!teamName || !teamCategory) {
      alert('Please fill all team fields')
      return
    }

    const { error } = await supabase.from('teams').insert([
      {
        name: teamName,
        category: teamCategory,
      },
    ])

    if (error) {
      alert('Error adding team: ' + error.message)
    } else {
      alert('Team added!')
      setTeamName('')
      setTeamCategory('')
      fetchTeams()
    }
  }

  // --- Add Driver ---
  async function handleAddDriver(e) {
    e.preventDefault()
    if (!driverName || !driverNumber || !driverTeam || !driverCategory) {
      alert('Please fill all driver fields')
      return
    }

    const { error } = await supabase.from('drivers').insert([
      {
        name: driverName,
        number: parseInt(driverNumber, 10),
        team: driverTeam,
        category: driverCategory,
      },
    ])

    if (error) {
      alert('Error adding driver: ' + error.message)
    } else {
      alert('Driver added!')
      setDriverName('')
      setDriverNumber('')
      setDriverTeam('')
      setDriverCategory('')
      fetchDrivers()
    }
  }

  // --- Add Constructor ---
  async function handleAddConstructor(e) {
    e.preventDefault()
    if (!constructorTeamName || !constructorPoints || !constructorCategory) {
      alert('Please fill all constructor fields')
      return
    }

    const { error } = await supabase.from('constructors').insert([
      {
        team_name: constructorTeamName,
        points: parseInt(constructorPoints, 10),
        category: constructorCategory,
      },
    ])

    if (error) {
      alert('Error adding constructor: ' + error.message)
    } else {
      alert('Constructor added!')
      setConstructorTeamName('')
      setConstructorPoints('')
      setConstructorCategory('')
      fetchConstructors()
    }
  }

  // --- Delete handlers ---
  async function handleDelete(table, id) {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) alert('Delete error: ' + error.message)
    else {
      alert('Deleted!')
      if (table === 'news') fetchNews()
      else if (table === 'events') fetchEvents()
      else if (table === 'teams') fetchTeams()
      else if (table === 'drivers') fetchDrivers()
      else if (table === 'constructors') fetchConstructors()
    }
  }

  // --- Styles ---
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 20,
      maxWidth: 900,
      margin: '0 auto',
    },
    section: {
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 20,
      marginBottom: 40,
      backgroundColor: '#fff',
    },
    sectionHeader: {
      fontSize: 24,
      marginBottom: 20,
      color: '#cc1f1f',
      borderBottom: '3px solid #cc1f1f',
      paddingBottom: 6,
    },
    formGroup: {
      marginBottom: 15,
    },
    label: {
      display: 'block',
      marginBottom: 6,
      fontWeight: '600',
    },
    input: {
      width: '100%',
      padding: 8,
      fontSize: 14,
      borderRadius: 4,
      border: '1px solid #ccc',
    },
    button: {
      backgroundColor: '#cc1f1f',
      color: '#fff',
      padding: '10px 16px',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: 16,
    },
    listItem: {
      borderBottom: '1px solid #eee',
      padding: '10px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: '#cc1f1f',
      border: 'none',
      color: '#fff',
      padding: '4px 8px',
      borderRadius: 4,
      cursor: 'pointer',
    },
  }

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: 40 }}>Dashboard</h1>
<button
  style={{ ...styles.button, marginBottom: 20 }}
  onClick={() => navigate('/')}
>
  Go to Home
</button>
      {/* News Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>News</h2>
        <form onSubmit={handleAddNews}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              style={styles.input}
              type="date"
              value={newsDate}
              onChange={(e) => setNewsDate(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              type="text"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Text</label>
            <textarea
              style={{ ...styles.input, height: 80 }}
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewsImage(e.target.files[0])}
            />
          </div>
          <button style={styles.button} type="submit" disabled={newsUploading}>
            {newsUploading ? 'Uploading...' : 'Add News'}
          </button>
        </form>

        <ul style={{ marginTop: 20 }}>
          {newsItems.map((item) => (
            <li key={item.id} style={styles.listItem}>
              <div>
                <strong>{item.title}</strong> ({item.date})
                <br />
                {item.text}
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete('news', item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Events Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Events</h2>
        <form onSubmit={handleAddEvent}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              style={styles.input}
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              style={styles.input}
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <input
              style={styles.input}
              type="text"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Add Event
          </button>
        </form>

        <ul style={{ marginTop: 20 }}>
          {events.map((ev) => (
            <li key={ev.id} style={styles.listItem}>
              <div>
                <strong>{ev.name}</strong> ({ev.date}) - {ev.location} [{ev.category}]
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete('events', ev.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Teams Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Teams</h2>
        <form onSubmit={handleAddTeam}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <input
              style={styles.input}
              type="text"
              value={teamCategory}
              onChange={(e) => setTeamCategory(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Add Team
          </button>
        </form>

        <ul style={{ marginTop: 20 }}>
          {teams.map((team) => (
            <li key={team.id} style={styles.listItem}>
              <div>
                <strong>{team.name}</strong> [{team.category}]
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete('teams', team.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Drivers Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Drivers</h2>
        <form onSubmit={handleAddDriver}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Number</label>
            <input
              style={styles.input}
              type="number"
              value={driverNumber}
              onChange={(e) => setDriverNumber(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Team</label>
            <input
              style={styles.input}
              type="text"
              value={driverTeam}
              onChange={(e) => setDriverTeam(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <input
              style={styles.input}
              type="text"
              value={driverCategory}
              onChange={(e) => setDriverCategory(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Add Driver
          </button>
        </form>

        <ul style={{ marginTop: 20 }}>
          {drivers.map((driver) => (
            <li key={driver.id} style={styles.listItem}>
              <div>
                <strong>{driver.name}</strong> #{driver.number} — {driver.team} [{driver.category}]
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete('drivers', driver.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Constructors Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionHeader}>Constructor Standings</h2>
        <form onSubmit={handleAddConstructor}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Team Name</label>
            <input
              style={styles.input}
              type="text"
              value={constructorTeamName}
              onChange={(e) => setConstructorTeamName(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Points</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              value={constructorPoints}
              onChange={(e) => setConstructorPoints(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <input
              style={styles.input}
              type="text"
              value={constructorCategory}
              onChange={(e) => setConstructorCategory(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Add Constructor
          </button>
        </form>

        <ul style={{ marginTop: 20 }}>
          {constructors.map((c) => (
            <li key={c.id} style={styles.listItem}>
              <div>
                <strong>{c.team_name}</strong> — {c.points} points [{c.category}]
              </div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete('constructors', c.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )

  
}
