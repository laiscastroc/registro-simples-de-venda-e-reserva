export interface Sale {
    id?: number
    bird_id: number
    bird_name: string
    gender: string
    quantity: number
    buyer_name: string
    cpf: string
    contact: string
    payment_method: string
    status: "VENDA" | "RESERVA"
    created_at?: string
    price?: number
}
