import express from "express";
import cors from 'cors';

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const listaPost = []

let id = 0

app.post('/post', (req, res)=>{
    const {tags,titulo,conteudo} = req.body

    listaPost.push({tags,titulo,conteudo})
    listaPost[id].id = id++

    return res.status(201).json(listaPost[id - 1])
})

app.get('/post', (req, res)=>{
    res.json(listaPost)

    return listaPost
})

app.get('/health', (req,res)=>{
    res.json({"Server": "OK"})
})

app.get('/', (req, res)=>{
    res.json({"backend rodando": `porta ${port}`})
})

app.listen(port, (error)=>{
    if(error){
        console.log("Erro no server")
        return
    }
    console.log(`server rodandando na ${port}`)
})