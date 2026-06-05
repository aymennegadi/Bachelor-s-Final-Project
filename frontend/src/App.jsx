import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import GestUsers from './pages/GestUsers'
import GestLabo from './pages/GestLabo'
import Parametres from './pages/Parametres'
import Reception from './pages/Reception'
import FichesMateriel from './pages/FichesmaterielMag'
import Mouvements from './pages/Mouvements'
import Inventaire from './pages/Inventaire'
import SuiviMateriel from './pages/SuiviMateriel'
import DemandesValider from './pages/DemandesValider'
import MesEquipements from './pages/MesEquipements'
import Disponibilite from './pages/Disponibilite'
import MesDemandes from './pages/MesDemandes'
import DemanderEquipement from './pages/DemanderEquipement'
import DemanderSalle from './pages/DemanderSalle'
import SignalerEquipement from './pages/SignalerEquipement'
import Historique from './pages/Historique'
import DemandesLaboratoire from './pages/DemandesLaboratoire'
import DemandesEmpruntMag from './pages/DemandesEmpruntMag'
import SignalementsMag from './pages/SignalementsMag'
import { useRole } from './contexts/RoleContext.jsx'

function App() {
  const { darkMode, setDarkMode } = useRole()
  console.log("App darkMode:", darkMode, "setDarkMode:", typeof setDarkMode)

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      <Navbar />
      <Routes>
        <Route path='/' element={<><LoginForm /><Footer /></>}/>
        <Route path='/admin' element={<Layout title="Dashboard" />}>
          <Route index element={<Dashboard />}/>
          <Route path='utilisateurs' element={<GestUsers />}/>
          <Route path='laboratoires' element={<GestLabo />}/>
          <Route path='parametres' element={<Parametres />}/>
        </Route>

        <Route path='/users' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='reception' element={<Reception />}/>
          <Route path='fiches' element={<FichesMateriel />}/>
          <Route path='mouvements' element={<Mouvements />}/>
          <Route path='inventaire' element={<Inventaire />}/>
          <Route path='parametres' element={<Parametres />}/>
          <Route path='suivi' element={<SuiviMateriel />}/>
          <Route path='demandes' element={<DemandesValider />}/>
          <Route path='equipements' element={<MesEquipements />}/>
          <Route path='disponibilite' element={<Disponibilite />}/>
          <Route path='mes-demandes' element={<MesDemandes />}/>
          <Route path='demander-equipement' element={<DemanderEquipement />}/>
          <Route path='demander-salle' element={<DemanderSalle />}/>
          <Route path='signaler-equipement' element={<SignalerEquipement />}/>
          <Route path='historique' element={<Historique />}/>
          <Route path='demandes-labo' element={<DemandesLaboratoire />}/>
          <Route path='demandes-emprunt' element={<DemandesEmpruntMag />}/>
          <Route path='signalements' element={<SignalementsMag />}/>
        </Route>
      </Routes>
    </div>
  )
}
export default App