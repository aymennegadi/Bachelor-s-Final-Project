import { configDotenv } from "dotenv"
import express from "express"
import db from "./lib/prisma.js"
import authRoutes from './routes/authRoutes.js'
import cors from "cors"
import adminRoutes from './routes/adminRoutes.js'
import magasinierRoutes from './routes/magasinierRoutes.js'
import laboRoutes from './routes/laboRoutes.js'
import logistiqueRoutes from './routes/logistiqueRoutes.js'
import professorRoutes from './routes/professorRoutes.js'

configDotenv()
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'API actifs Logistique OK' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/magasinier', magasinierRoutes)
app.use('/api/labo', laboRoutes)
app.use('/api/logistique', logistiqueRoutes)
app.use('/api/professor', professorRoutes)

const PORT = process.env.PORT || "5000"
app.listen(PORT, () => {
    console.log(`le serveur demarre sur le port ${PORT}`)
})