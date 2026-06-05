import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../lib/prisma.js'

export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body

    // 1. Chercher l'utilisateur par email
    const utilisateur = await db.utilisateur.findUnique({
      where: { email },
      include: { role: true }
    })

    // 2. Vérifier si l'utilisateur existe
    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // 3. Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe)
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // 4. Créer le token JWT
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role.nom },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    )

    // 5. Retourner le token et les infos
    res.json({
      token,
      role: utilisateur.role.nom.toLowerCase().toWellFormed()
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { userId, ancien_mot_de_passe, nouveau_mot_de_passe } = req.body

    const utilisateur = await db.utilisateur.findUnique({
      where: { id: parseInt(userId) }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    const valide = await bcrypt.compare(ancien_mot_de_passe, utilisateur.mot_de_passe)

    if (!valide) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" })
    }

    const hash = await bcrypt.hash(nouveau_mot_de_passe, 10)

    await db.utilisateur.update({
      where: { id: parseInt(userId) },
      data: { mot_de_passe: hash }
    })

    res.json({ message: "Mot de passe modifié avec succès" })
  } catch (error) {
    console.error("Erreur changePassword:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const utilisateur = await db.utilisateur.findUnique({
      where: { id: parseInt(userId) },
      include: { role: true }
    })

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json({
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      username: utilisateur.username,
      email: utilisateur.email,
      role: utilisateur.role.nom
    })
  } catch (error) {
    console.error("Erreur getProfile:", error.message)
    res.status(500).json({ message: "Erreur serveur" })
  }
}