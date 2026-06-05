import { useRole } from '../contexts/RoleContext'

function Header({ title }) {
  const { darkMode } = useRole()
  
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className={`px-8 py-4 flex items-center justify-between border-b shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-700'}`}>
        {title}
      </h1>

      <p className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
        {today}
      </p>

    </div>
  )
}
export default Header