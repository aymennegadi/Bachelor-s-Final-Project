import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seed...');

    // Nettoyage - supprime tout avant de recréer
  await prisma.signalement.deleteMany()
  await prisma.mouvement.deleteMany()
  await prisma.demande.deleteMany()
  await prisma.equipement.deleteMany()
  await prisma.laboratoire.deleteMany()
  await prisma.utilisateur.deleteMany()
  await prisma.role.deleteMany()

  // ─── 1. ROLES ───────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.upsert({ where: { nom: 'ADMIN' }, update: {}, create: { nom: 'ADMIN' } }),
    prisma.role.upsert({ where: { nom: 'MAGASINIER' }, update: {}, create: { nom: 'MAGASINIER' } }),
    prisma.role.upsert({ where: { nom: 'RESPONSABLE_LOGISTIQUE' }, update: {}, create: { nom: 'RESPONSABLE_LOGISTIQUE' } }),
    prisma.role.upsert({ where: { nom: 'RESPONSABLE_LABO' }, update: {}, create: { nom: 'RESPONSABLE_LABO' } }),
    prisma.role.upsert({ where: { nom: 'PROFESSEUR' }, update: {}, create: { nom: 'PROFESSEUR' } }),
])
  console.log('Rôles créés');

  // ─── 2. UTILISATEURS ────────────────────────────────────
  const hash = (pwd) => bcrypt.hashSync(pwd, 10);

  const admin = await prisma.utilisateur.upsert({
    where: { email: 'admin@univ.dz' },
    update: {},
    create: {
      nom: 'Benali', prenom: 'Karim',
      email: 'admin@univ.dz',
      telephone: '0550000001',
      mot_de_passe: hash('admin123'),
      role_id: roles[0].id,
    },
  });

  const magasinier = await prisma.utilisateur.upsert({
    where: { email: 'magasinier@univ.dz' },
    update: {},
    create: {
      nom: 'Hadj', prenom: 'Sofiane',
      email: 'magasinier@univ.dz',
      telephone: '0550000002',
      mot_de_passe: hash('mag123'),
      role_id: roles[1].id,
    },
  });

  const responsable_log = await prisma.utilisateur.upsert({
    where: { email: 'logistique@univ.dz' },
    update: {},
    create: {
        nom: 'Negadi', prenom: 'Aymen',
        email: 'logistique@univ.dz',
        telephone: '0550000003',
        mot_de_passe: hash('log123'),
        role_id: roles[2].id,
    },
})

const responsable_labo = await prisma.utilisateur.upsert({
    where: { email: 'labo@univ.dz' },
    update: {},
    create: {
        nom: 'Meziane', prenom: 'Sara',
        email: 'labo@univ.dz',
        telephone: '0550000004',
        mot_de_passe: hash('labo123'),
        role_id: roles[3].id,
    },
})

  const professeur = await prisma.utilisateur.upsert({
    where: { email: 'prof@univ.dz' },
    update: {},
    create: {
      nom: 'Khelif', prenom: 'Amine',
      email: 'prof@univ.dz',
      telephone: '0550000005',
      mot_de_passe: hash('prof123'),
      role_id: roles[4].id,
    },
  });
  console.log('✅ Utilisateurs créés');

  // ─── 3. LABORATOIRES ────────────────────────────────────
  const labo1 = await prisma.laboratoire.upsert({
    where: { code: 'INFO-01' },
    update: {},
    create: {
      nom: 'Laboratoire Informatique',
      code: 'INFO-01',
      description: 'Labo principal informatique',
      responsable_id: responsable_labo.id,
    },
  });

  const labo2 = await prisma.laboratoire.upsert({
    where: { code: 'RESEAU-01' },
    update: {},
    create: {
      nom: 'Laboratoire Réseaux',
      code: 'RESEAU-01',
      description: 'Labo réseaux et télécoms',
    },
  });
  console.log('✅ Laboratoires créés');

  // ─── 4. EQUIPEMENTS ─────────────────────────────────────
  const eq1 = await prisma.equipement.upsert({
    where: { reference: 'PC-DELL-001' },
    update: {},
    create: {
      reference: 'PC-DELL-001',
      designation: 'PC Dell Optiplex',
      categorie: 'Informatique',
      etat: 'BON_ETAT',
      quantite: 20,
      prix: 85000,
      localisation: 'Salle A1',
      date_acquisition: new Date('2023-01-15'),
      laboratoire_id: labo1.id,
    },
  });

  const eq2 = await prisma.equipement.upsert({
    where: { reference: 'PROJ-EPSON-001' },
    update: {},
    create: {
      reference: 'PROJ-EPSON-001',
      designation: 'Projecteur Epson EB-X51',
      categorie: 'Audiovisuel',
      etat: 'NEUF',
      quantite: 5,
      prix: 45000,
      localisation: 'Réserve',
      date_acquisition: new Date('2024-03-10'),
      laboratoire_id: labo1.id,
    },
  });

  const eq3 = await prisma.equipement.upsert({
    where: { reference: 'SWITCH-CISCO-001' },
    update: {},
    create: {
      reference: 'SWITCH-CISCO-001',
      designation: 'Switch Cisco Catalyst 2960',
      categorie: 'Réseau',
      etat: 'EN_PANNE',
      quantite: 3,
      prix: 120000,
      localisation: 'Salle Réseau B2',
      date_acquisition: new Date('2022-06-01'),
      laboratoire_id: labo2.id,
    },
  });
  console.log('✅ Équipements créés');

  // ─── 5. DEMANDES ────────────────────────────────────────
  await prisma.demande.createMany({
    data: [
      {
        type: 'ACHAT',
        statut: 'EN_ATTENTE',
        motif: 'Besoin de nouveaux PCs pour le labo',
        demandeur_id: responsable_labo.id,
        equipement_id: eq1.id,
      },
      {
        type: 'REMPLACEMENT',
        statut: 'VALIDEE',
        motif: 'Switch en panne depuis 2 semaines',
        demandeur_id: responsable_log.id,
        equipement_id: eq3.id,
        valideur_id: admin.id,
      },
      {
        type: 'SIGNALEMENT',
        statut: 'EN_ATTENTE',
        motif: 'Projecteur qui chauffe trop',
        demandeur_id: professeur.id,
        equipement_id: eq2.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Demandes créées');

  // ─── 6. MOUVEMENTS ──────────────────────────────────────
  await prisma.mouvement.createMany({
    data: [
      {
        type: 'ENTREE',
        quantite: 20,
        motif: 'Réception commande initiale',
        equipement_id: eq1.id,
        magasinier_id: magasinier.id,
        laboratoire_id: labo1.id,
      },
      {
        type: 'SORTIE',
        quantite: 2,
        motif: 'Transfert vers salle A2',
        equipement_id: eq1.id,
        magasinier_id: magasinier.id,
        laboratoire_id: labo1.id,
      },
      {
        type: 'ENTREE',
        quantite: 3,
        motif: 'Réception switch réseau',
        equipement_id: eq3.id,
        magasinier_id: magasinier.id,
        laboratoire_id: labo2.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Mouvements créés');

  // ─── 7. SIGNALEMENTS ────────────────────────────────────
  await prisma.signalement.createMany({
    data: [
      {
        description: 'Le switch Cisco ne répond plus, voyant rouge allumé',
        equipement_id: eq3.id,
        professeur_id: professeur.id,
      },
      {
        description: 'Projecteur Epson surchauffe après 30 min d\'utilisation',
        equipement_id: eq2.id,
        professeur_id: professeur.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Signalements créés');

  console.log('🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => { console.error('❌ Erreur seed:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());