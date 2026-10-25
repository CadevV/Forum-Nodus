import 'dotenv/config';
import express from "express";
import cors from 'cors';
import { string, z, ZodObject } from 'zod';
import { pool } from "./db/db.js"
import { da } from 'zod/v4/locales';

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const listaUsuarios = [
    {
        id: 0,
        email: "adm@adm.com",
        name: "admin",
        pass: "adm123"
    }
]

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

app.post('/post', async (req, res)=>{
    try {
        const resultado = postValidado.safeParse(req.body)

        if(!resultado.success){
            return res.status(400).json({erros: resultado.error.issues})
        }
        
        const dados = resultado.data

        const respostaBanco = await pool.query(
            `
            INSERT INTO tbPost
            (tags, autor, titulo, conteudo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [dados.tags, dados.user, dados.titulo, dados.conteudo]
        )

        return res.status(201).json(`Post Criado`)
    } catch (erro){
        console.log("erro:", erro.message)
        res.status(500).json("ERRO AO TENTAR CRIAR POST")
    }

})

app.get('/post', async(req, res)=>{
    try{
        const resposta = await pool.query(
            `SELECT * FROM tbPost`
        )     
        
        res.json(resposta.rows)
    } catch (erro) {
        console.log("erro:", erro.message)
        res.status(500).json("ERRO AO TENTAR PROCURAR POST")
    }

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

    const postResposta = {...listaUsuarios[newUser.id]}

    delete postResposta.pass

    console.log(`Usuario Criado ${listaUsuarios[newUser.id].name.toUpperCase()}`)
    return res.json(postResposta)
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

    const postReposta = {...findUser}

    delete postReposta.pass

    res.status(200).json(postReposta)
})

app.get('/health', (req,res)=>{
    res.status(200).json({"Server": "OK"})
})

app.get('/healthBanco', async (req, res) => {
    try {
        await pool.query('SELECT 1')
        res.status(200).json({"Banco": "OK"})
    } catch (erro) {
        console.log({"Erro": erro.message})
        res.status(500).json({"Erro": "Banco"})
    }
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
    console.log(process.env.PGHOST)
})