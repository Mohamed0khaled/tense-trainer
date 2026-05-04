import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="glass rounded-3xl p-10 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-muted">Let us take you back to the game.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-card"
        >
          Go home
        </button>
      </div>
    </PageTransition>
  )
}

export default NotFound
