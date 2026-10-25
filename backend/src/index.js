import 'dotenv/config';
import express from "express";
import cors from 'cors';
import { string, z, ZodObject } from 'zod';
import { pool } from "./db/db.js"
import bcrypt from 'bcrypt'
import { tr } from 'zod/v4/locales';

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

const keyHash = 12

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

app.post("/cadastrar", async (req, res)=>{
    try {
        const resultado = userValid.safeParse(req.body);
        if(!resultado.success){
            return res.status(400).json({erros: resultado.error.issues})
        }

        const dados = resultado.data

        const passHash = await bcrypt.hash(dados.pass, keyHash)

        const registroBanco = await pool.query(
            `
            INSERT INTO tbUser (emailUser, nameUser, hashUser)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [dados.email, dados.name, passHash]
        )

        const newUser = registroBanco.rows[0]

        console.log(newUser)

        console.log(`Usuario Criado ${newUser.nameuser}`)
        return res.json(newUser)
    } catch (erro){
        console.log("erro:", erro.message)
        res.status(500).json("ERRO AO CADASTRAR")
    }
})

app.get("/cadastrar", async (req, res)=>{
    try{
        const usuariosCadastrados = await pool.query(
            `
            SELECT id, emailuser, nameuser FROM tbUser
            `
        )
        res.status(200).json(usuariosCadastrados.rows[0])
    } catch (erro) {
        console.log("ERRO", erro.message)
        res.json("ERRO AO PUXAR USUARIO")
    }

})

app.post('/login', async (req, res) =>{
    try {
        const resultado = userValidLogin.safeParse(req.body);

        if(!resultado.success){
            return res.status(400).json({erros: resultado.error.issues})
        }

        const dados = resultado.data

        const consulta = await pool.query(
            `SELECT * FROM tbUser WHERE nameuser = $1`,
            [dados.name]
        )

        const usuario = consulta.rows[0]
        
        if(!usuario){
            return res.status(401).json({
                erro: "Credenciais inválidas"
            })
        }

        const verificarSenha = await bcrypt.compare(dados.pass, usuario.hashuser)

        if (!verificarSenha) {
            return res.status(401).json({
                erro: "Credenciais inválidas"
            })
        }

        return res.status(200).json({
            id: usuario.id,
            name: usuario.nameuser,
            logado: true
        })

    } catch (erro) {
        console.log("ERRO", erro.message)

        return res.status(500).json({
            erro: "Erro interno ao realizar login"
        })
    }
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