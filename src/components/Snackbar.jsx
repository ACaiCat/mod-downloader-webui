import './Snackbar.css'

export default function Snackbar({ message, type = 'info', onClose }) {
  if (!message) return null

  const icon =
    type === 'success' ? 'check_circle' :
    type === 'error' ? 'error' : 'info'

  return (
    <div className={`snackbar snackbar--${type}`}>
      <span className="material-symbols-rounded snackbar__icon">{icon}</span>
      <span className="snackbar__text">{message}</span>
      <button className="icon-button snackbar__close" onClick={onClose}>
        <span className="material-symbols-rounded">close</span>
      </button>
    </div>
  )
}
