import express from "express";
import cors from 'cors';
import { string, z, ZodObject } from 'zod';

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const listaPost = []
const listaUsuarios = [
    {
        id: 0,
        email: "adm@adm.com",
        name: "admin",
        pass: "adm123"
    }
]

let idPost = 0
let idUser = 1

const postValidado = z.object({
    user: z.string(),
    tags: z.string().toLowerCase(),
    titulo: z.string().min(3).max(20),
    conteudo: z.string().min(5).max(200)
})

const userValid = z.object({
    email: z.string().email(),
    name: z.union([z.string().min(2).max(10), z.number().max(10)]),
    pass: z.union([z.string(), z.number()])
})

const userValidLogin = z.object({
    name: z.union([z.string().min(2).max(10), z.number().max(10)]),
    pass: z.union([z.string(), z.number()])
})

app.post('/post', (req, res)=>{
    const resultado = postValidado.safeParse(req.body)

    if(!resultado.success){
        return res.status(400).json({erros: resultado.error.issues})
    }
    
    const dados = resultado.data

    const novoPost = {
        id:idPost++,
        ...dados
    }

    listaPost.push(novoPost)

    return res.status(201).json("post criado")
})

app.get('/post', (req, res)=>{
    res.json(listaPost)

    return listaPost
})

app.post("/cadastrar", (req, res)=>{
    const resultado = userValid.safeParse(req.body);
    if(!resultado.success){
        return res.status(400).json({erros: resultado.error.issues})
    }

    const verify = listaUsuarios.find(el => el.email == resultado.data.email || el.name == resultado.data.name)

    if(verify) return res.status(400).json("o email " + resultado.data.email + "ou"+ resultado.data.name + " Já está sendo usado")

    const newUser ={
        id: idUser++,
        ...resultado.data,
        logado: true
    }
    
    listaUsuarios.push(newUser)

    return res.json(listaUsuarios[newUser.id])
})

app.get("/cadastrar", (req, res)=>{
    const listaGet = structuredClone(listaUsuarios)
    listaGet.forEach(element => {
        delete element.pass
    });
    res.json(listaGet)
})

app.post('/login', (req, res) =>{
    const resultado = userValidLogin.safeParse(req.body);

    if(!resultado.success){
        return res.status(400).json({erros: resultado.error.issues})
    }

    const findUser = listaUsuarios.find(el => el.name == resultado.data.name && el.pass == resultado.data.pass)

    if(!findUser){
        return res.status(404).json("Usuario não encontrado ")
    }

    findUser.logado = true

    res.status(200).json(findUser)
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