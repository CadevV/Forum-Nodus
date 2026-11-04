import "dotenv/config";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { pool } from "./db/db.js";
import bcrypt from "bcrypt";

const app = express();
const port = process.env.PORT || 3000;
const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  }),
);
app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  }),
);

function verificarSecao(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ Erro: "Authenticação" });
  }

  next();
}

const keyHash = 12;

const postValidado = z.object({
  tags: z.string().toLowerCase(),
  titulo: z.string().min(3).max(20),
  conteudo: z.string().min(5).max(200),
});

const schemaId = z.coerce.number().int().min(1);

const userValid = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(20),
  pass: z.string(),
});

const userValidLogin = z.object({
  name: z.string().min(2).max(20),
  pass: z.string(),
});

app.post("/post", verificarSecao, async (req, res) => {
  try {
    const resultado = postValidado.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({ erros: resultado.error.issues });
    }

    const dados = resultado.data;
    const sessao = req.session.userId;

    const consultaNome = await pool.query(
      `SELECT nameuser FROM tbUser WHERE id = $1`,
      [sessao],
    );

    if (consultaNome.rowCount === 0) {
      return res.status(404).json({
        Usuario: "Não encontrado",
      });
    }

    const respostaConsulta = consultaNome.rows[0].nameuser;

    const respostaBanco = await pool.query(
      `
            INSERT INTO tbPost
            (tags, autor, titulo, conteudo, usuario_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
      [dados.tags, respostaConsulta, dados.titulo, dados.conteudo, sessao],
    );

    return res.status(201).json(`Post Criado`);
  } catch (erro) {
    console.log("erro:", erro.message);
    res.status(500).json("ERRO AO TENTAR CRIAR POST");
  }
});

app.get("/post", async (req, res) => {
  try {
    const resposta = await pool.query(`SELECT * FROM tbPost`);

    res.json(resposta.rows);
  } catch (erro) {
    console.log("erro:", erro.message);
    res.status(500).json("ERRO AO TENTAR PROCURAR POST");
  }
});

app.delete("/post/:id", verificarSecao, async (req, res) => {
  try {
    const resultado = schemaId.safeParse(req.params.id);

    if (!resultado.success) {
      return res.status(400).json({ erro: "id inválido" });
    }

    const consulta = await pool.query(
      `SELECT usuario_id FROM tbPost WHERE id = $1`,
      [resultado.data],
    );

    const sessao = req.session.userId;
    if (consulta.rowCount == 0) {
      return res.status(404).json({
        Post: "Inexistente",
      });
    }
    const respostaConsulta = consulta.rows[0].usuario_id;

    if (sessao !== respostaConsulta) {
      return res.status(403).json({
        Erro: "Você não tem permissão para excluir este post",
      });
    }

    const id = resultado.data;

    const consultaDelete = await pool.query(
      `DELETE FROM tbPost WHERE id = $1 AND usuario_id = $2`,
      [id, sessao],
    );

    if (consultaDelete.rowCount === 0) {
      return res.status(404).json({ Post: "Não encontrado" });
    }
    return res.sendStatus(204);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno" });
  }
});

app.post("/cadastrar", async (req, res) => {
  try {
    const resultado = userValid.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ erros: resultado.error.issues });
    }

    const dados = resultado.data;

    const passHash = await bcrypt.hash(dados.pass, keyHash);

    const registroBanco = await pool.query(
      `
            INSERT INTO tbUser (emailUser, nameUser, hashUser)
            VALUES ($1, $2, $3)
            RETURNING id, emailuser, nameuser
            `,
      [dados.email, dados.name, passHash],
    );

    const newUser = registroBanco.rows[0];

    console.log(newUser);

    console.log(`Usuario Criado ${newUser.nameuser}`);
    return res.json(newUser);
  } catch (erro) {
    console.log("erro:", erro.message);
    res.status(500).json("ERRO AO CADASTRAR");
  }
});

app.get("/cadastrar", async (req, res) => {
  try {
    const usuariosCadastrados = await pool.query(
      `
            SELECT id, nameuser FROM tbUser
            `,
    );
    res.status(200).json(usuariosCadastrados.rows);
  } catch (erro) {
    console.log("ERRO", erro.message);
    res.json("ERRO AO PUXAR USUARIO");
  }
});

app.post("/login", async (req, res) => {
  try {
    const resultado = userValidLogin.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({ erros: resultado.error.issues });
    }

    const dados = resultado.data;

    const consulta = await pool.query(
      `SELECT * FROM tbUser WHERE nameuser = $1`,
      [dados.name],
    );

    const usuario = consulta.rows[0];

    if (!usuario) {
      return res.status(401).json({
        erro: "Credenciais inválidas",
      });
    }

    const verificarSenha = await bcrypt.compare(dados.pass, usuario.hashuser);

    if (!verificarSenha) {
      return res.status(401).json({
        erro: "Credenciais inválidas",
      });
    }

    req.session.regenerate((erroSessao) => {
      if (erroSessao) {
        return res.status(500).json({
          Erro: "Criar sessão",
        });
      }

      req.session.userId = usuario.id;

      req.session.save((erroSessao) => {
        if (erroSessao) {
          return res.status(500).json({
            Erro: "Salvar sessão",
          });
        }

        return res.status(200).json({
          id: usuario.id,
          name: usuario.nameuser,
          logado: true,
        });
      });
    });
  } catch (erro) {
    console.log("ERRO", erro.message);

    return res.status(500).json({
      erro: "Erro interno ao realizar login",
    });
  }
});

app.delete("/usuario/:id", verificarSecao, async (req, res) => {
  let client;
  try {
    const resposta = schemaId.safeParse(req.params.id);

    if (!resposta.success) {
      return res.status(400).json("Falha na Requisição");
    }

    const sessao = req.session.userId;
    const id = resposta.data;

    if (id != sessao) {
      return res.status(403).json({
        Erro: "Permissão",
      });
    }

    client = await pool.connect();

    await client.query("BEGIN");
    const consultaPost = await client.query(
      `DELETE FROM tbPost WHERE usuario_id = $1`,
      [sessao],
    );

    const consulta = await client.query(`DELETE FROM tbUser WHERE id = $1`, [
      sessao,
    ]);

    if (consulta.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ Usuario: "Não Encontrado" });
    }

    await client.query("COMMIT");
    
    req.session.destroy((erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({
                erro: "Conta excluída, mas houve erro ao encerrar a sessão"
            })
        }

        res.clearCookie("connect.sid")
        return res.sendStatus(204)
    })
    
  } catch (erro) {
    console.log(erro);
    if (client) {
      await client.query("ROLLBACK");
    }
    return res.status(500).json("Erro no Servidor");
  } finally {
    client?.release();
  }
});

app.get("/usuario/:id", async (req, res) => {
  try {
    const resposta = schemaId.safeParse(req.params.id);

    if (!resposta.success) {
      return res.status(400).json("Falha na Requisição");
    }

    const id = resposta.data;

    const consulta = await pool.query(
      `SELECT nameuser FROM tbUser WHERE id = $1`,
      [id],
    );

    if (consulta.rowCount === 0) {
      return res.status(404).json({ Usuario: "Não encontrado" });
    }

    return res.status(200).json(consulta.rows[0]);
  } catch (erro) {
    console.log(erro);
    return res.status(500).json("Erro no servidor");
  }
});

app.get("/auth/me", verificarSecao, async (req, res) => {
  try {
    const sessao = req.session.userId;

    const consulta = await pool.query(
      `SELECT nameuser, id FROM tbUser WHERE id = $1`,
      [sessao],
    );

    const consultaPosts = await pool.query(
      `SELECT * FROM tbPost WHERE usuario_id = $1`,
      [sessao],
    );

    const respostaConsulta = consultaPosts.rowCount;

    if (consulta.rowCount === 0) {
      return res.status(401).json({
        Usuario: "Não encontrado",
      });
    }
    const usuarioEncontrado = consulta.rows[0];

    return res.status(200).json({
      id: usuarioEncontrado.id,
      name: usuarioEncontrado.nameuser,
      posts: respostaConsulta,
    });
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({
      Erro: "Interno",
    });
  }
});

app.post("/logout", (req, res) => {
  try {
    req.session.destroy((erro) => {
      if (erro) {
        return res.status(500).json({
          Erro: "encerrar Sessão",
        });
      }

      res.clearCookie("connect.sid");
      return res.sendStatus(204);
    });
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({
      Erro: "Interno",
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ Server: "OK" });
});

app.get("/healthBanco", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ Banco: "OK" });
  } catch (erro) {
    console.log({ Erro: erro.message });
    res.status(500).json({ Erro: "Banco" });
  }
});

app.get("/", (req, res) => {
  res.json({ "backend rodando": `porta ${port}` });
});

app.listen(port, (error) => {
  if (error) {
    console.log("Erro no server");
    return;
  }
  console.log(`server rodandando na ${port}`);
});
