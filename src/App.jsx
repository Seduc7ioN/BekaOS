import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Landing from './components/Landing'
import Studio from './components/Studio'
import { watchAuth } from './services/firebase'

function App() {
  const [route, setRoute] = useState('landing')
  const [session, setSession] = useState({ user: null, studio: null, loading: true })

  useEffect(() => watchAuth(setSession), [])

  const navigate = (nextRoute) => {
    setRoute(nextRoute)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (route === 'auth') {
    return <Auth onBack={() => navigate('landing')} onSuccess={() => navigate('studio')} />
  }

  if (route === 'studio') {
    return (
      <Studio
        user={session.user}
        studio={session.studio}
        onBack={() => navigate('landing')}
        onAuth={() => navigate('auth')}
      />
    )
  }

  return (
    <Landing
      user={session.user}
      onAuth={() => navigate('auth')}
      onStudio={() => navigate('studio')}
    />
  )
}

export default App
