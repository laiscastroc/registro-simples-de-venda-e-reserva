const API_URL = '/api'

function normalizeImageUrl(imageUrl: string) {
  if (!imageUrl) return '/logo.png'
  if (imageUrl.startsWith('/') || imageUrl.startsWith('http')) return imageUrl

  return `/${imageUrl}`
}

//busca todos os pássaros 
export async function getBirds() {
  const response = await fetch(`${API_URL}/birds`)

  if (!response.ok) {
    const details = await response.text()
    throw new Error(details || "Erro ao buscar pássaros")
  }

  const birds = await response.json()

  return birds.map((bird: any) => ({
    ...bird,
    image_url: normalizeImageUrl(bird.image_url)
  }))
}

//envia os dados pro back, converte em json e salva a venda
export const createSale = async(sale: any) => {
    const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(sale)
    })

    //teste para verificar se está retornando id ou não, fiz porque tive problema de erro para salvar
    const responseText = await res.text()

    if (!res.ok) {
      throw new Error(responseText || "Erro ao salvar venda")
    }

    const savedSale = responseText ? JSON.parse(responseText) : null

    if (!savedSale?.id) {
      throw new Error("API ok, mas não retornou o ID da venda.")
    }
    return savedSale
}

//pegar todos as vendas 
export const getSale = async() => {
    const res = await fetch(`${API_URL}/sales`)

    if (!res.ok) {
      const details = await res.text()
      throw new Error(details || "Erro ao buscar vendas")
    }

    return res.json()
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const responseText = await res.text()
  let data: any = {}

  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    data = {
      message: responseText || 'Sem retorno válido!'
    }
  }

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao realizar login!')
  }
  return data
}
