import { Pool } from "pg";

const defaultImages = {
  Papagaio: "/papagaio.jpg",
  Arara: "/araras.webp",
  Cacatua: "/cacatuas-aves.jpg",
  Periquito: "/periquito.webp",
  Jandaia: "/jandaia.jpg",
  Agapornis: "/agapornis.jpg"
};

const unavailableImages = new Set(["/arara.png"]);

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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Método não permitido" });
  }

  if (!getConnectionString()) {
    return res.status(500).json({
      message: "Variável do banco não configurada!",
      expected: "DATABASE_URL ou POSTGRES_URL"
    });
  }

  try {
    const result = await database.query("SELECT * FROM birds ORDER BY id");

    const birds = result.rows.map((bird) => ({
      id: bird.id,
      name: bird.name,
      scientific_name: bird.scientific_name,
      type: bird.type,
      price: Number(bird.price || 0),
      legalization_price: Number(bird.legalization_price || 0),
      image_url: unavailableImages.has(bird.image_url)
        ? defaultImages[bird.name]
        : bird.image_url || defaultImages[bird.name] || "/logo.png"
    }));

    return res.status(200).json(birds);
  } catch (error) {
    console.error("Erro ao buscar pássaros:", error);
    return res.status(500).json({ message: "Erro ao buscar pássaros" });
  }
}
