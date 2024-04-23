import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'

import signalsData from '../mocks/signals' // Importa el objeto de señales

function Dashboard() {
  const [userPosition, setUserPosition] = useState({
    latitude: 0,
    longitude: 0
  })
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0) // Índice del mensaje actual
  const [showMessages] = useState(true) // Estado para controlar la visibilidad de los mensajes

  // Simula la obtención de la posición actual del usuario (aquí puedes usar la API de geolocalización del navegador)
  useEffect(() => {
    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Posición actual del usuario:', latitude, longitude)
          setUserPosition({ latitude, longitude })
        },
        (error) => {
          console.error('Error al obtener la posición:', error)
        }
      )
    }

    getUserLocation()
  }, [])

  const calculateDistance = (point1, point2) => {
    const R = 6371
    const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180
    const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.latitude * Math.PI) / 180) *
        Math.cos((point2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const getNearbySignals = useCallback(() => {
    const nearbySignals = signalsData.filter((signal) => {
      const distance = calculateDistance(userPosition, signal.gpsPosition)
      return distance < 0.1
    })
    return nearbySignals
  }, [userPosition])

  useEffect(() => {
    const nearbySignals = getNearbySignals()
    if (nearbySignals.length > 0 && showMessages) {
      const timer = setTimeout(() => {
        // Avanzar al siguiente mensaje o reiniciar si se alcanza el final
        setCurrentMessageIndex((prevIndex) =>
          prevIndex === nearbySignals.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [userPosition, getNearbySignals, showMessages, currentMessageIndex])

  return (
    <div>
      <header className='road-signal-header'>
        <div></div>
        <div>
          <h1>Road Signal</h1>
        </div>
        <div>
          <Link className='Link-react-router-dom-go-out' to='/'>
            Salir
          </Link>
        </div>
      </header>
      <div className='road-signal-container'>
        <ul className='road-signal-ul'>
          {showMessages &&
            getNearbySignals().map((signal, index) => (
              <li
                key={index}
                style={{
                  display: index === currentMessageIndex ? 'block' : 'none'
                }}
              >
                {signal.name} a{' '}
                {Math.round(
                  calculateDistance(userPosition, signal.gpsPosition) * 1000
                )}{' '}
                metros
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
