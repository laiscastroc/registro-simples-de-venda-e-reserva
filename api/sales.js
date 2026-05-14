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

function validateSale(sale) {
  const requiredFields = [
    "bird_id",
    "bird_name",
    "gender",
    "quantity",
    "buyer_name",
    "cpf",
    "contact",
    "payment_method",
    "status"
  ];

  return requiredFields.filter((field) => sale[field] === undefined || sale[field] === "");
}

export default async function handler(req, res) {
  if (!getConnectionString()) {
    return res.status(500).json({
      message: "Variável do banco não configurada!",
      expected: "DATABASE_URL ou POSTGRES_URL"
    });
  }

  if (req.method === "GET") {
    try {
      const result = await database.query(`
        SELECT
          s.id,
          s.bird_id,
          s.bird_name,
          s.gender,
          s.quantity,
          s.buyer_name,
          s.cpf,
          s.contact,
          s.payment_method,
          s.status,
          s.created_at,
          COALESCE(b.price, 0) AS price
        FROM sales s
        LEFT JOIN birds b ON b.id = s.bird_id
        ORDER BY s.created_at DESC, s.id DESC
      `);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      return res.status(500).json({ message: "Erro ao buscar vendas" });
    }
  }

  if (req.method === "POST") {
    try {
      const sale = parseBody(req.body);
      const missingFields = validateSale(sale);

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Campos obrigatórios ausentes!",
          fields: missingFields
        });
      }

      const result = await database.query(
        `
        INSERT INTO sales (
          bird_id,
          bird_name,
          gender,
          quantity,
          buyer_name,
          cpf,
          contact,
          payment_method,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
          sale.bird_id,
          sale.bird_name,
          sale.gender,
          sale.quantity,
          sale.buyer_name,
          sale.cpf,
          sale.contact,
          sale.payment_method,
          sale.status
        ]
      );

      if (!result.rows[0]) {
        return res.status(500).json({ message: "Venda não inserida!" });
      }

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
      return res.status(500).json({
        message: "Erro ao salvar venda",
        detail: error.message
      });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Método não permitido" });
}
