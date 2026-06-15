import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AddOnsProvider } from './context/AddOnsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { EventsProvider } from './context/EventsContext.jsx'
import { PlayersProvider } from './context/PlayersContext.jsx'
import { SocialFeedProvider } from './context/SocialFeedContext.jsx'
import { TheamProvider } from './Provider/TheamProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TheamProvider>
      <AuthProvider>
        <EventsProvider>
          <PlayersProvider>
            <SocialFeedProvider>
              <AddOnsProvider>
                <App />
              </AddOnsProvider>
            </SocialFeedProvider>
          </PlayersProvider>
        </EventsProvider>
      </AuthProvider>
    </TheamProvider>
  </StrictMode>,
)
