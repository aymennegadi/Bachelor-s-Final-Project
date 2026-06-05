import axios from "axios"

const apiUrl = "http://localhost:5000"

export const login = async (email, mot_de_passe) => {
    const response = await axios.post(`${apiUrl}/api/auth/login`, { 
        email, 
        mot_de_passe 
    })
    return response.data
}