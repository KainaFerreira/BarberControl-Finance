import { supabase } from './supabaseClient'

function formatarDataParaBR(dataISO) {
  if (!dataISO) return ''

  const [ano, mes, dia] = dataISO.split('-')

  return `${dia}/${mes}/${ano}`
}

function formatarHora(horaTexto) {
  if (!horaTexto) return ''

  return horaTexto.slice(0, 5)
}

export async function buscarSaidas(barbershopId) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar saídas:', error)
    return []
  }

  return data.map((saida) => ({
    id: saida.id,
    descricao: saida.description,
    categoria: saida.category,
    valor: Number(saida.amount || 0),
    data: formatarDataParaBR(saida.expense_date),
    hora: formatarHora(saida.expense_time),
    observacao: saida.notes || '',
    criadoEm: saida.created_at,
  }))
}

export async function criarSaida(barbershopId, saida) {
  const agora = new Date()

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      barbershop_id: barbershopId,
      description: saida.descricao,
      category: saida.categoria,
      amount: saida.valor,
      expense_date: agora.toISOString().slice(0, 10),
      expense_time: agora.toTimeString().slice(0, 8),
      notes: saida.observacao || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar saída:', error)
    throw error
  }

  return {
    id: data.id,
    descricao: data.description,
    categoria: data.category,
    valor: Number(data.amount || 0),
    data: formatarDataParaBR(data.expense_date),
    hora: formatarHora(data.expense_time),
    observacao: data.notes || '',
    criadoEm: data.created_at,
  }
}