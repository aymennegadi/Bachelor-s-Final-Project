export const ADMIN_NAVLINKS = [
    { id: 1, name: "Dashboard", path: "/admin" },
    { id: 2, name: "Gestion Utilisateurs", path: "/admin/utilisateurs" },
    { id: 3, name: "Gestion Laboratoires", path: "/admin/laboratoires" },
    { id: 4, name: "Paramètres", path: "/admin/parametres" }
]

export const LOGISTIQUE_NAVLINKS = [
    { id: 1, name: "Dashboard", path: "/users" },
    { id: 2, name: "Inventaire Global", path: "/users/inventaire" },
    { id: 3, name: "Suivi Matériel", path: "/users/suivi" },
    { id: 4, name: "Demandes à valider", path: "/users/demandes" },
    { id: 5, name: "Paramètres", path: "/users/parametres" }
]

export const MAGASINIER_NAVLINKS = [
    { id: 1, name: "Dashboard", path: "/users" },
    { id: 2, name: "Réception Équipements", path: "/users/reception" },
    { id: 3, name: "Fiches Matériel", path: "/users/fiches" },
    { id: 4, name: "Entrées / Sorties", path: "/users/mouvements" },
    { id: 5, name: "Demandes Emprunt", path: "/users/demandes-emprunt" },
    { id: 6, name: "Signalements", path: "/users/signalements" },
    { id: 7, name: "Paramètres", path: "/users/parametres" }
]

export const LABO_NAVLINKS = [
    { id: 1, name: "Dashboard", path: "/users" },
    { id: 2, name: "Mes Équipements", path: "/users/equipements" },
    { id: 3, name: "Disponibilité & État", path: "/users/disponibilite" },
    { id: 4, name: "Mes Demandes", path: "/users/mes-demandes" },
    { id: 5, name: "Demandes de Salle", path: "/users/demandes-labo" },
    { id: 6, name: "Paramètres", path: "/users/parametres" }
]

export const PROF_NAVLINKS = [
    { id: 1, name: "Dashboard", path: "/users" },
    { id: 2, name: "Demander Équipement", path: "/users/demander-equipement" },
    { id: 3, name: "Demander Salle", path: "/users/demander-salle" },
    { id: 4, name: "Signaler Équipement", path: "/users/signaler-equipement" },
    { id: 5, name: "Historique", path: "/users/historique" },
    { id: 6, name: "Paramètres", path: "/users/parametres" }
]

// ===== STATS =====

export const ADMIN_STATS = [
  { id: 1, title: "Total Utilisateurs",    value: 3, icon: "Users",     color: "bg-blue-100 text-blue-600" },
  { id: 2, title: "Total Laboratoires",    value: 5, icon: "Building2", color: "bg-green-100 text-green-600" },
  { id: 3, title: "Utilisateurs Actifs",   value: 3, icon: "UserCheck", color: "bg-green-100 text-green-600" },
  { id: 4, title: "Utilisateurs Inactifs", value: 0, icon: "UserX",     color: "bg-red-100 text-red-600" },
]

export const LOGISTIQUE_STATS = [
  { id: 1, title: "Total Équipements",     value: 245, icon: "Package",      color: "bg-blue-100 text-blue-600" },
  { id: 2, title: "En Maintenance",        value: 12,  icon: "Wrench",       color: "bg-orange-100 text-orange-600" },
  { id: 3, title: "Demandes en attente",   value: 5,   icon: "Clock",        color: "bg-yellow-100 text-yellow-600" },
  { id: 4, title: "Réformés",              value: 3,   icon: "PackageX",     color: "bg-red-100 text-red-600" },
]

export const MAGASINIER_STATS = [
  { id: 1, title: "Équipements reçus",     value: 18,  icon: "PackageCheck", color: "bg-green-100 text-green-600" },
  { id: 2, title: "Sorties du jour",       value: 7,   icon: "PackageMinus", color: "bg-red-100 text-red-600" },
  { id: 3, title: "Stock Total",           value: 245, icon: "Warehouse",    color: "bg-blue-100 text-blue-600" },
  { id: 4, title: "En attente réception",  value: 4,   icon: "Clock",        color: "bg-yellow-100 text-yellow-600" },
]

export const LABO_STATS = [
  { id: 1, title: "Mes Équipements", value: 32, icon: "Microscope",    color: "bg-blue-100 text-blue-600" },
  { id: 2, title: "Disponibles",     value: 25, icon: "CheckCircle",   color: "bg-green-100 text-green-600" },
  { id: 3, title: "En panne",        value: 4,  icon: "AlertTriangle", color: "bg-red-100 text-red-600" },
  { id: 4, title: "Mes Demandes",    value: 3,  icon: "ClipboardList", color: "bg-purple-100 text-purple-600" },
]

export const PROF_STATS = [
  { id: 1, title: "Équipements affectés", value: 8,  icon: "Monitor",       color: "bg-blue-100 text-blue-600" },
  { id: 2, title: "Disponibles",          value: 6,  icon: "CheckCircle",   color: "bg-green-100 text-green-600" },
  { id: 3, title: "Mes Demandes",         value: 2,  icon: "ClipboardList", color: "bg-purple-100 text-purple-600" },
  { id: 4, title: "En attente",           value: 1,  icon: "Clock",         color: "bg-yellow-100 text-yellow-600" },
]

// ===== DONNÉES =====

export const ADMIN_RECENT_USERS = [
  { id: 1, nom: "Berkaoui Bilal",    role: "Magasinier",               date: "12/03/2026", statut: "Actif" },
  { id: 2, nom: "Negadi Aymen",      role: "Responsable Logistique",   date: "10/03/2026", statut: "Actif" },
  { id: 3, nom: "Bendehina Malek",   role: "Responsable Laboratoire",  date: "08/03/2026", statut: "Actif" },
]

export const USERS_LIST = [
  { id: 1, nom: "Berkaoui Bilal",  username: "berkaoui.bilal",  role: "Magasinier",               statut: "Actif" },
  { id: 2, nom: "Negadi Aymen",    username: "negadi.aymen",    role: "Responsable Logistique",   statut: "Actif" },
  { id: 3, nom: "Bendehina Malek", username: "bendehina.malek", role: "Responsable Laboratoire",  statut: "Actif" },
]

export const LABS_LIST = [
  { id: 1, nom: "Laboratoire Informatique", code: "LAB-INFO-01", responsable: "Bendehina Malek", capacite: 30 },
  { id: 2, nom: "Laboratoire Réseaux",      code: "LAB-RES-02",  responsable: "Bendehina Malek", capacite: 25 },
  { id: 3, nom: "Laboratoire Électronique", code: "LAB-ELEC-03", responsable: "Bendehina Malek", capacite: 20 },
  { id: 4, nom: "Laboratoire Électronique", code: "LAB-INFO-04", responsable: "Bendehina Malek", capacite: 15 },
  { id: 5, nom: "Laboratoire Réseaux",      code: "LAB-INFO-05", responsable: "Bendehina Malek", capacite: 25 },
]

export const EQUIPEMENTS_LIST = [
  { id: 1, nom: "Ordinateur Dell",  reference: "REF-001", categorie: "Informatique", quantite: 10, etat: "Neuf",      date: "01/03/2026" },
  { id: 2, nom: "Projecteur Epson", reference: "REF-002", categorie: "Audiovisuel",  quantite: 3,  etat: "Bon état",  date: "05/03/2026" },
  { id: 3, nom: "Oscilloscope",     reference: "REF-003", categorie: "Électronique", quantite: 5,  etat: "Neuf",      date: "10/03/2026" },
]

export const MOUVEMENTS_LIST = [
  { id: 1, equipement: "Ordinateur Dell",  type: "Entrée", quantite: 10, laboratoire: "Laboratoire Informatique", date: "01/03/2026" },
  { id: 2, equipement: "Projecteur Epson", type: "Sortie", quantite: 1,  laboratoire: "Laboratoire Réseaux",      date: "05/03/2026" },
  { id: 3, equipement: "Oscilloscope",     type: "Entrée", quantite: 5,  laboratoire: "Laboratoire Électronique", date: "10/03/2026" },
]

export const SUIVI_LIST = [
  { id: 1, nom: "Ordinateur Dell",  reference: "REF-001", etat: "Bon état", localisation: "Laboratoire Informatique", affectation: "Berkaoui Bilal" },
  { id: 2, nom: "Projecteur Epson", reference: "REF-002", etat: "Moyen",    localisation: "Laboratoire Réseaux",      affectation: "Negadi Aymen" },
  { id: 3, nom: "Oscilloscope",     reference: "REF-003", etat: "Neuf",     localisation: "Laboratoire Électronique", affectation: "Bendehina Malek" },
]

export const DEMANDES_LIST = [
  { id: 1, equipement: "Imprimante HP", type: "Achat",        demandeur: "Bendehina Malek", date: "01/04/2026", statut: "En attente" },
  { id: 2, equipement: "Oscilloscope",  type: "Remplacement", demandeur: "Berkaoui Bilal",  date: "02/04/2026", statut: "En attente" },
  { id: 3, equipement: "Chaise bureau", type: "Réforme",      demandeur: "Negadi Aymen",    date: "03/04/2026", statut: "En attente" },
]

export const LABO_EQUIPEMENTS_LIST = [
  { id: 1, nom: "Ordinateur Dell",  reference: "REF-001", quantite: 10, etat: "Bon état", disponible: true },
  { id: 2, nom: "Projecteur Epson", reference: "REF-002", quantite: 3,  etat: "Moyen",    disponible: false },
  { id: 3, nom: "Oscilloscope",     reference: "REF-003", quantite: 5,  etat: "Neuf",     disponible: true },
]

export const MES_DEMANDES_LIST = [
  { id: 1, equipement: "Imprimante HP", type: "Achat",        date: "01/04/2026", statut: "En attente" },
  { id: 2, equipement: "Oscilloscope",  type: "Remplacement", date: "02/04/2026", statut: "Validée" },
  { id: 3, equipement: "Chaise bureau", type: "Réforme",      date: "03/04/2026", statut: "Refusée" },
]

export const PROF_EQUIPEMENTS_LIST = [
  { id: 1, nom: "Ordinateur Portable", reference: "PROF-001", quantite: 1, etat: "Bon état", disponible: true },
  { id: 2, nom: "Vidéoprojecteur",      reference: "PROF-002", quantite: 1, etat: "Neuf",     disponible: true },
  { id: 3, nom: "Tableau Blanc",        reference: "PROF-003", quantite: 1, etat: "Moyen",    disponible: false },
  { id: 4, nom: "Système Audio",        reference: "PROF-004", quantite: 1, etat: "Bon état", disponible: true },
]

export const PROF_DEMANDES_LIST = [
  { id: 1, equipement: "Microscope", type: "Achat",        date: "01/04/2026", statut: "En attente" },
  { id: 2, equipement: "Ordinateur", type: "Remplacement", date: "02/04/2026", statut: "Validée" },
]