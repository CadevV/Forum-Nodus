import pool from "./db/pool.js"

try {
    const resultado = await pool.query("SELECT NOW() AS horario")

    console.log("Conexão funcionando!")
    console.log(resultado.rows[0])
} catch (erro) {
    console.error("Erro ao conectar:", erro.message)
} finally {
    await pool.end()
}