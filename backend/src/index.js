import express from "express";
import cors from 'cors';
import { z } from 'zod';

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const listaPost = []

let id = 0

const postValidado = z.object({
    tags: z.string().lowercase(),
    titulo: z.string().min(3).max(20),
    conteudo: z.string().min(5).max(200)
})

app.post('/post', (req, res)=>{
    const resultado = postValidado.safeParse(req.body)

    if(!resultado.success){
        return res.status(400).json({erros: resultado.error.issues})
    }
    
    const dados = resultado.data

    const novoPost = {
        id:id++,
        ...dados
    }

    listaPost.push(novoPost)

    return res.status(201).json("post criado")
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