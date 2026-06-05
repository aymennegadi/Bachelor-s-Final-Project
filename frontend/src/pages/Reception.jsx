import { useState, useEffect, useContext} from 'react'
import { RoleContext } from '../contexts/RoleContext'
import { getLaboratoires } from '../services/adminService'
import { getEquipements, createEquipement, getDemandesValidees, marquerReceptionnee } from '../services/magasinierService'

const ETATS = ['NEUF', 'BON_ETAT', 'EN_PANNE', 'EN_MAINTENANCE', 'REFORME']

const ETAT_LABELS = {
  NEUF: 'Neuf', BON_ETAT: 'Bon état', EN_PANNE: 'En panne',
  EN_MAINTENANCE: 'En maintenance', REFORME: 'Réformé'
}

const TYPE_LABELS = {
  ACHAT: 'Achat', REMPLACEMENT: 'Remplacement', REFORME: 'Réforme',
  EQUIPEMENT: 'Équipement', SALLE: 'Salle', SIGNALEMENT: 'Signalement'
}

const etatBadge = (etat) => {
  const colors = {
    NEUF: 'bg-green-100 text-green-600', BON_ETAT: 'bg-blue-100 text-blue-600',
    EN_PANNE: 'bg-red-100 text-red-600', EN_MAINTENANCE: 'bg-yellow-100 text-yellow-600',
    REFORME: 'bg-gray-100 text-gray-500'
  }
  return colors[etat] || 'bg-gray-100 text-gray-500'
}

const emptyForm = {
  reference: '', designation: '', categorie: '', etat: 'NEUF',
  quantite: '', prix: '', localisation: '', date_acquisition: '', laboratoire_id: ''
}

function Reception() {
  const [equipements, setEquipements] = useState([])
  const [laboratoires, setLaboratoires] = useState([])
  const [demandesValidees, setDemandesValidees] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [currentDemandeId, setCurrentDemandeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDemandes, setShowDemandes] = useState(true)
  const { userId } = useContext(RoleContext)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [eqs, labs, demandes] = await Promise.all([
        getEquipements(),
        getLaboratoires(),
        getDemandesValidees()
      ])
      setEquipements(eqs)
      setLaboratoires(labs)
      setDemandesValidees(demandes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReceptionner = (demande) => {
    setForm({
      reference: '',
      designation: demande.equipement?.designation || '',
      categorie: demande.equipement?.categorie || TYPE_LABELS[demande.type] || '',
      etat: 'NEUF',
      quantite: demande.equipement?.quantite || '1',
      prix: '',
      localisation: '',
      date_acquisition: new Date().toISOString().split('T')[0],
      laboratoire_id: ''
    })
    setCurrentDemandeId(demande.id)
    setShowModal(true)
  }

  const handlePrintDemande = (demande) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Demande d'Équipement</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: white; padding: 40px; }
        .header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1a5c2a; }
        .logo { width: 80px; height: 80px; object-fit: contain; }
        .univ-info h1 { font-size: 16px; color: #1a5c2a; font-weight: bold; margin: 0; }
        .univ-info h2 { font-size: 14px; color: #333; font-weight: bold; margin: 5px 0 0 0; }
        .univ-info p { font-size: 12px; color: #666; margin: 2px 0; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin: 30px 0; color: #1a5c2a; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .info-item { padding: 15px; background: #f9f9f9; border-radius: 8px; }
        .info-label { font-size: 12px; color: #666; margin-bottom: 5px; }
        .info-value { font-size: 14px; font-weight: bold; color: #333; }
        .motif-section { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .motif-label { font-size: 12px; color: #666; margin-bottom: 10px; }
        .motif-value { font-size: 14px; color: #333; line-height: 1.6; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 11px; color: #999; }
      </style></head><body>
      <div class="header">
        <img class="logo" src="http://localhost:5173/src/assets/LOGO_UNIV_ORAN_1_Anglais.png" alt="Logo"/>
        <div class="univ-info">
          <h1>جامعة وهران 1 - أحمد بن بلة</h1>
          <h2>Université d'Oran 1 - Ahmed Ben Bella</h2>
          <p>Faculté des Sciences Exactes et Appliquées</p>
        </div>
      </div>
      <div class="title">DEMANDE D'ÉQUIPEMENT</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Numéro de demande</div>
          <div class="info-value">#${demande.id}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date de demande</div>
          <div class="info-value">${new Date(demande.date_demande).toLocaleDateString('fr-DZ')}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Type de demande</div>
          <div class="info-value">${TYPE_LABELS[demande.type] || demande.type}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Demandeur</div>
          <div class="info-value">${demande.demandeur ? `${demande.demandeur.prenom} ${demande.demandeur.nom}` : '—'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Équipement demandé</div>
          <div class="info-value">${demande.equipement?.designation || '—'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Quantité</div>
          <div class="info-value">${demande.equipement?.quantite || 1}</div>
        </div>
      </div>
      <div class="motif-section">
        <div class="motif-label">Motif de la demande</div>
        <div class="motif-value">${demande.motif || '—'}</div>
      </div>
      <div class="footer">
        Document généré automatiquement - Université d'Oran 1
      </div>
      <script>window.onload = () => { window.print(); window.onafterprint = () => window.close() }</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  const handlePrintAllDemandes = () => {
    const printWindow = window.open('', '_blank')
    const demandesHTML = demandesValidees.map((d, index) => `
      <div style="margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
        <div style="font-size: 16px; font-weight: bold; color: #1a5c2a; margin-bottom: 15px;">
          Demande #${d.id} - ${TYPE_LABELS[d.type] || d.type}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div><strong>Date:</strong> ${new Date(d.date_demande).toLocaleDateString('fr-DZ')}</div>
          <div><strong>Demandeur:</strong> ${d.demandeur ? `${d.demandeur.prenom} ${d.demandeur.nom}` : '—'}</div>
          <div><strong>Équipement:</strong> ${d.equipement?.designation || '—'}</div>
          <div><strong>Quantité:</strong> ${d.equipement?.quantite || 1}</div>
        </div>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <strong>Motif:</strong> ${d.motif || '—'}
        </div>
      </div>
    `).join('')

    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Toutes les Demandes d'Équipement</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: white; padding: 40px; }
        .header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1a5c2a; }
        .logo { width: 80px; height: 80px; object-fit: contain; }
        .univ-info h1 { font-size: 16px; color: #1a5c2a; font-weight: bold; margin: 0; }
        .univ-info h2 { font-size: 14px; color: #333; font-weight: bold; margin: 5px 0 0 0; }
        .univ-info p { font-size: 12px; color: #666; margin: 2px 0; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin: 30px 0; color: #1a5c2a; }
        .summary { background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 11px; color: #999; }
      </style></head><body>
      <div class="header">
        <img class="logo" src="http://localhost:5173/src/assets/LOGO_UNIV_ORAN_1_Anglais.png" alt="Logo"/>
        <div class="univ-info">
          <h1>جامعة وهران 1 - أحمد بن بلة</h1>
          <h2>Université d'Oran 1 - Ahmed Ben Bella</h2>
          <p>Faculté des Sciences Exactes et Appliquées</p>
        </div>
      </div>
      <div class="title">LISTE DES DEMANDES D'ÉQUIPEMENT À RÉCEPTIONNER</div>
      <div class="summary">
        <strong>Total des demandes:</strong> ${demandesValidees.length}
      </div>
      ${demandesHTML}
      <div class="footer">
        Document généré automatiquement - Université d'Oran 1
      </div>
      <script>window.onload = () => { window.print(); window.onafterprint = () => window.close() }</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        quantite: parseInt(form.quantite),
        prix: form.prix ? parseFloat(form.prix) : null,
        laboratoire_id: form.laboratoire_id ? parseInt(form.laboratoire_id) : null,
        date_acquisition: form.date_acquisition ? new Date(form.date_acquisition).toISOString() : null,
        magasinier_id: userId 
      }
      const created = await createEquipement(payload)
      setEquipements([...equipements, created])
      setShowModal(false)
      setForm(emptyForm)
      if (currentDemandeId) {
        await marquerReceptionnee(currentDemandeId)
        setDemandesValidees(prev => prev.filter(d => d.id !== currentDemandeId))
        setCurrentDemandeId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePrint = (equip) => {
    const etiquettes = Array.from({ length: equip.quantite }, (_, i) => {
      const numero = String(i + 1).padStart(3, '0')
      const codeUnique = `FSEA-${equip.reference}-${numero}`
      return `
        <div class="etiquette">
          <div class="header">
            <img class="logo" src="http://localhost:5173/src/assets/LOGO_UNIV_ORAN_1_Anglais.png" alt="Logo"/>
            <div class="univ-name">
              <span class="arabic">جامعة وهران 1</span><br/>
              <strong>Oran University 1</strong><br/>
              كلية العلوم الدقيقة والتطبيقية<br/>
              <span class="faculty">FACULTY OF EXACT AND APPLIED SCIENCES</span>
            </div>
          </div>
          <hr/>
          <div class="date-bon">
            <span>${equip.date_acquisition ? new Date(equip.date_acquisition).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</span>
            <span><strong>N° BON : ${equip.id}</strong></span>
          </div>
          <div class="affectation">AFFECTATION: ${equip.categorie?.toUpperCase()}</div>
          <div class="designation">${equip.designation}</div>
          <div class="barcode-lines">|||||||||||||||||||||||||||||||</div>
          <div class="barcode-text">${codeUnique}</div>
        </div>
        ${i + 1 < equip.quantite ? '<div class="page-break"></div>' : ''}
      `
    }).join('')

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Étiquettes - ${equip.reference}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: white; }
        .etiquette { width: 320px; border: 2px solid #000; border-radius: 10px; padding: 16px; text-align: center; margin: 30px auto; background: white; }
        .header { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; margin-bottom: 10px; }
        .logo { width: 60px; height: 60px; object-fit: contain; }
        .univ-name { font-size: 11px; text-align: left; line-height: 1.6; }
        .arabic { font-size: 13px; font-weight: bold; color: #1a5c2a; }
        .faculty { font-weight: bold; font-size: 10px; }
        hr { border: none; border-top: 1px solid #ccc; margin-bottom: 10px; }
        .date-bon { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; }
        .affectation { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
        .designation { font-size: 12px; color: #333; margin-bottom: 12px; }
        .barcode-lines { font-size: 36px; letter-spacing: -3px; line-height: 1; color: #000; }
        .barcode-text { font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 4px; color: #cc6600; margin-top: 4px; }
        .page-break { page-break-after: always; }
        @media print { .page-break { page-break-after: always; } }
      </style></head><body>
      ${etiquettes}
      <script>window.onload = () => { window.print(); window.onafterprint = () => window.close() }</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="space-y-6">

      {/* ===== DEMANDES VALIDEES ===== */}
      {demandesValidees.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-700">
                Demandes à réceptionner
                <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  {demandesValidees.length}
                </span>
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrintAllDemandes}
                className="bg-slate-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-slate-700 transition">
                🖨️ Imprimer tout
              </button>
              <button onClick={() => setShowDemandes(!showDemandes)}
                className="text-sm text-slate-400 hover:text-slate-600">
                {showDemandes ? 'Masquer ▲' : 'Afficher ▼'}
              </button>
            </div>
          </div>

          {showDemandes && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Demandeur</th>
                  <th className="pb-3">Équipement</th>
                  <th className="pb-3">Motif</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {demandesValidees.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-green-50 transition">
                    <td className="py-3 text-slate-400 text-xs">
                      {new Date(d.date_demande).toLocaleDateString('fr-DZ')}
                    </td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {TYPE_LABELS[d.type] || d.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 font-medium">
                      {d.demandeur ? `${d.demandeur.prenom} ${d.demandeur.nom}` : '—'}
                    </td>
                    <td className="py-3 text-slate-500">{d.equipement?.designation || '—'}</td>
                    <td className="py-3 text-slate-500 max-w-xs truncate">{d.motif || '—'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handlePrintDemande(d)}
                          className="bg-slate-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-slate-700 transition">
                          🖨️ Imprimer
                        </button>
                        <button onClick={() => handleReceptionner(d)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition">
                          + Réceptionner
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== EQUIPEMENTS ===== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Réception des Équipements</h2>
        <button onClick={() => { setForm(emptyForm); setCurrentDemandeId(null); setShowModal(true) }}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
          + Nouvel Équipement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-gray-100">
              <th className="pb-3">Désignation</th>
              <th className="pb-3">Référence</th>
              <th className="pb-3">Catégorie</th>
              <th className="pb-3">Qté</th>
              <th className="pb-3">État</th>
              <th className="pb-3">Laboratoire</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {equipements.map((eq) => (
              <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-3 text-slate-700 font-medium">{eq.designation}</td>
                <td className="py-3 text-slate-500">{eq.reference}</td>
                <td className="py-3 text-slate-500">{eq.categorie}</td>
                <td className="py-3 text-slate-500">{eq.quantite}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${etatBadge(eq.etat)}`}>
                    {ETAT_LABELS[eq.etat] ?? eq.etat}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{eq.laboratoire?.nom ?? '—'}</td>
                <td className="py-3">
                  <button onClick={() => handlePrint(eq)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition">
                    🖨️ Imprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-700 mb-6">Nouvel Équipement</h2>
            <div className="space-y-4">
              {[
                { label: 'Référence', key: 'reference', type: 'text' },
                { label: 'Désignation', key: 'designation', type: 'text' },
                { label: 'Catégorie', key: 'categorie', type: 'text' },
                { label: 'Quantité', key: 'quantite', type: 'number' },
                { label: 'Prix (DA)', key: 'prix', type: 'number' },
                { label: 'Localisation', key: 'localisation', type: 'text' },
                { label: "Date d'acquisition", key: 'date_acquisition', type: 'date' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                <select value={form.etat} onChange={(e) => setForm({ ...form, etat: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  {ETATS.map(e => <option key={e} value={e}>{ETAT_LABELS[e]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratoire</label>
                <select value={form.laboratoire_id} onChange={(e) => setForm({ ...form, laboratoire_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option value="">— Aucun —</option>
                  {laboratoires.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} ({l.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setCurrentDemandeId(null) }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={handleSave}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Reception