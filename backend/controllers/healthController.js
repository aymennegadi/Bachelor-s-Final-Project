export const healthController = (req, res)=>{
    res.status(200).json({
        status: 200,
        message: "OK"
    })
}