import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AddOnsProvider } from './context/AddOnsContext.jsx'
import { EventsProvider } from './context/EventsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventsProvider>
      <AddOnsProvider>
        <App />
      </AddOnsProvider>
    </EventsProvider>
  </StrictMode>,
)
