import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { Pool } from 'pg'

const defaultImages: Record<string, string> = {
  Papagaio: '/papagaio.jpg',
  Arara: '/araras.webp',
  Cacatua: '/cacatuas-aves.jpg',
  Periquito: '/periquito.webp',
  Jandaia: '/jandaia.jpg',
  Agapornis: '/agapornis.jpg'
}

const unavailableImages = new Set(['/arara.png'])

let database: Pool | null = null

function normalizeImageUrl(imageUrl: string) {
  if (!imageUrl) return '/logo.png'
  if (imageUrl.startsWith('/') || imageUrl.startsWith('http')) return imageUrl

  return `/${imageUrl}`
}

function readBackendEnv() {
  try {
    const envPath = fileURLToPath(new URL('../back-end/.env', import.meta.url))
    const envFile = readFileSync(envPath, 'utf8')

    for (const line of envFile.split(/\r?\n/)) {
      const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
      if (!match) continue

      const [, key, rawValue] = match
      process.env[key] ||= rawValue.replace(/^["']|["']$/g, '')
    }
  } catch {
    // Local development can also use environment variables already set in the shell.
  }
}

function getConnectionString() {
  readBackendEnv()

  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  )
}

function getDatabase() {
  const connectionString = getConnectionString()

  if (!connectionString) {
    throw new Error('DATABASE_URL ou POSTGRES_URL nao configurada')
  }

  database ||= new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  return database
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function readBody(req: IncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

function validateSale(sale: any) {
  const requiredFields = [
    'bird_id',
    'bird_name',
    'gender',
    'quantity',
    'buyer_name',
    'cpf',
    'contact',
    'payment_method',
    'status'
  ]

  return requiredFields.filter((field) => sale[field] === undefined || sale[field] === '')
}

function localApiPlugin() {
  return {
    name: 'local-api',
    configureServer(server: any) {
      server.middlewares.use('/api/birds', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') {
          res.setHeader('Allow', 'GET')
          return sendJson(res, 405, { message: 'Metodo nao permitido' })
        }

        try {
          const result = await getDatabase().query('SELECT * FROM birds ORDER BY id')
          const birds = result.rows.map((bird) => ({
            id: bird.id,
            name: bird.name,
            scientific_name: bird.scientific_name,
            type: bird.type,
            price: Number(bird.price || 0),
            legalization_price: Number(bird.legalization_price || 0),
            image_url: normalizeImageUrl(
              unavailableImages.has(bird.image_url)
                ? defaultImages[bird.name]
                : bird.image_url || defaultImages[bird.name] || '/logo.png'
            )
          }))

          return sendJson(res, 200, birds)
        } catch (error) {
          return sendJson(res, 500, {
            message: 'Erro ao buscar passaros',
            detail: error instanceof Error ? error.message : String(error)
          })
        }
      })

      server.middlewares.use('/api/sales', async (req: IncomingMessage, res: ServerResponse) => {
        try {
          if (req.method === 'GET') {
            const result = await getDatabase().query(`
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
            `)

            return sendJson(res, 200, result.rows)
          }

          if (req.method === 'POST') {
            const sale = await readBody(req)
            const missingFields = validateSale(sale)

            if (missingFields.length > 0) {
              return sendJson(res, 400, {
                message: 'Campos obrigatorios ausentes',
                fields: missingFields
              })
            }

            const result = await getDatabase().query(
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
            )

            return sendJson(res, 201, result.rows[0])
          }

          res.setHeader('Allow', 'GET, POST')
          return sendJson(res, 405, { message: 'Metodo nao permitido' })
        } catch (error) {
          return sendJson(res, 500, {
            message: 'Erro ao salvar venda',
            detail: error instanceof Error ? error.message : String(error)
          })
        }
      })

      server.middlewares.use('/api/login', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST')
          return sendJson(res, 405, { message: 'Metodo nao permitido' })
        }

        try {
          const { email, password } = await readBody(req)

          if (!email || !password) {
            return sendJson(res, 400, { message: 'Preencha email e senha' })
          }

          const numbers = /^\d+$/

          if (!numbers.test(password)) {
            return sendJson(res, 400, { message: 'A senha deve conter apenas numeros' })
          }

          const result = await getDatabase().query(
            'SELECT id, email FROM login WHERE email = $1 AND password = $2',
            [email, password]
          )

          if (result.rows.length === 0) {
            return sendJson(res, 401, { message: 'Email ou senha invalidos' })
          }

          return sendJson(res, 200, {
            message: 'Login realizado com sucesso',
            user: result.rows[0]
          })
        } catch (error) {
          return sendJson(res, 500, {
            message: 'Erro interno no servidor',
            detail: error instanceof Error ? error.message : String(error)
          })
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    localApiPlugin(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
