import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <header className='road-signal-header'>
        <div></div>
        <div>
          <h1>Road Signal</h1>
        </div>
        <div></div>
      </header>
      <div className='road-signal-container'>
        <Link className='Link-react-router-dom-start' to='/dashboard'>
          Start
        </Link>
      </div>
    </div>
  )
}

export default Home
