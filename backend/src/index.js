import express from "express";
import cors from 'cors';

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/health', (req,res)=>{
    res.json({"Server": "OK"})
})

app.get('/', (req, res)=>{
    res.json({"backend rodando": `porta ${port}`})
})

app.listen(port, ()=>{
    console.log(`server rodandando na ${port}`)
})