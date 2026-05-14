import { Pool } from "pg";

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

const database = new Pool({
  connectionString: getConnectionString(),
  ssl: {
    rejectUnauthorized: false
  }
});

function parseBody(body) {
  if (!body) return {};
  return typeof body === "string" ? JSON.parse(body) : body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Metodo nao permitido" });
  }

  if (!getConnectionString()) {
    return res.status(500).json({
      message: "Variavel do banco nao configurada!",
      expected: "DATABASE_URL ou POSTGRES_URL"
    });
  }

  try {
    const { email, password } = parseBody(req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Preencha email e senha" });
    }

    const numbers = /^\d+$/;

    if (!numbers.test(password)) {
      return res.status(400).json({ message: "A senha deve conter apenas numeros" });
    }

    const result = await database.query(
      "SELECT id, email FROM login WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email ou senha invalidos" });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return res.status(500).json({
      message: "Erro interno no servidor",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}
