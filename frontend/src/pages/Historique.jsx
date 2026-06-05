import { useState } from 'react'
import { useRole } from '../contexts/RoleContext'

function Historique() {
  const { role, nom } = useRole()
  const [activeTab, setActiveTab] = useState('tout')
  const [dateFilter, setDateFilter] = useState('')

  // Données simulées pour l'historique
  const [historiqueData] = useState([
    // Demandes d'équipement
    { id: 1, type: 'equipement', action: 'Demande équipement', details: 'Ordinateur Portable (Achat)', date: '15/04/2026', statut: 'En attente', reference: 'DEQ-001' },
    { id: 2, type: 'equipement', action: 'Demande équipement', details: 'Projecteur (Emprunt)', date: '14/04/2026', statut: 'Validée', reference: 'DEQ-002' },
    { id: 3, type: 'equipement', action: 'Demande équipement', details: 'Microscope (Achat)', date: '10/04/2026', statut: 'Refusée', reference: 'DEQ-003' },
    
    // Demandes de salle
    { id: 4, type: 'salle', action: 'Demande salle', details: 'Laboratoire Informatique - TP Réseaux', date: '20/04/2026', statut: 'Validée', reference: 'DSA-001' },
    { id: 5, type: 'salle', action: 'Demande salle', details: 'Laboratoire Réseaux - Examen pratique', date: '18/04/2026', statut: 'En attente', reference: 'DSA-002' },
    { id: 6, type: 'salle', action: 'Demande salle', details: 'Laboratoire Électronique - Cours', date: '12/04/2026', statut: 'Validée', reference: 'DSA-003' },
    
    // Signalements
    { id: 7, type: 'signalement', action: 'Signalement équipement', details: 'Ordinateur Portable - Panne écran', date: '15/04/2026', statut: 'En attente', reference: 'SIG-001' },
    { id: 8, type: 'signalement', action: 'Signalement équipement', details: 'Vidéoprojecteur - Mauvaise qualité', date: '14/04/2026', statut: 'Pris en charge', reference: 'SIG-002' },
    { id: 9, type: 'signalement', action: 'Signalement équipement', details: 'Système Audio - Équipement corrompu', date: '08/04/2026', statut: 'Résolu', reference: 'SIG-003' },
  ])

  const filteredData = historiqueData.filter(item => {
    const matchesTab = activeTab === 'tout' || item.type === activeTab
    const matchesDate = !dateFilter || item.date.includes(dateFilter)
    return matchesTab && matchesDate
  })

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'Validée': return 'bg-green-100 text-green-600'
      case 'En attente': return 'bg-yellow-100 text-yellow-600'
      case 'Refusée': return 'bg-red-100 text-red-600'
      case 'Pris en charge': return 'bg-blue-100 text-blue-600'
      case 'Résolu': return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'equipement': 
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      case 'salle':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      case 'signalement':
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      default:
        return null
    }
  }

  const stats = {
    equipement: historiqueData.filter(item => item.type === 'equipement').length,
    salle: historiqueData.filter(item => item.type === 'salle').length,
    signalement: historiqueData.filter(item => item.type === 'signalement').length,
    total: historiqueData.length
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-700">Historique des Activités</h2>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
              <p className="text-sm text-slate-400">Total Activités</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              {getTypeIcon('equipement')}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{stats.equipement}</p>
              <p className="text-sm text-slate-400">Demandes Équipement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              {getTypeIcon('salle')}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{stats.salle}</p>
              <p className="text-sm text-slate-400">Demandes Salle</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              {getTypeIcon('signalement')}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700">{stats.signalement}</p>
              <p className="text-sm text-slate-400">Signalements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('tout')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'tout' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setActiveTab('equipement')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'equipement' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Équipements
              </button>
              <button
                onClick={() => setActiveTab('salle')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'salle' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Salles
              </button>
              <button
                onClick={() => setActiveTab('signalement')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'signalement' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Signalements
              </button>
            </div>
          </div>
          
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tableau d'historique */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Type</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Détails</th>
              <th className="pb-3">Référence</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'equipement' ? 'bg-purple-100 text-purple-600' :
                      item.type === 'salle' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {item.type === 'equipement' ? 'Équipement' :
                       item.type === 'salle' ? 'Salle' : 'Signalement'}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-slate-700 font-medium">{item.action}</td>
                <td className="py-3 text-slate-500 max-w-xs truncate" title={item.details}>
                  {item.details}
                </td>
                <td className="py-3">
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {item.reference}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{item.date}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(item.statut)}`}>
                    {item.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">Aucune activité trouvée pour les filtres sélectionnés</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Historique
