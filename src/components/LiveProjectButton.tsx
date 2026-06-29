export default function LiveProjectButton() {
  return (
    <button
      className="px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors"
      style={{
        borderRadius: '9999px',
        border: '2px solid #D7E2EA',
        color: '#D7E2EA',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'Kanit, sans-serif',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(215,226,234,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      Live Project
    </button>
  )
}
