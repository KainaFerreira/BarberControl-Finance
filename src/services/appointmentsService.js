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

export async function buscarAtendimentos(barbershopId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar atendimentos:', error)
    return []
  }

  return data.map((atendimento) => ({
    id: atendimento.id,
    cliente: atendimento.client_name,
    clienteId: atendimento.client_id,
    servico: atendimento.service,
    valor: Number(atendimento.amount || 0),
    statusPagamento:
      atendimento.payment_status === 'pending' ? 'fiado' : 'pago',
    data: formatarDataParaBR(atendimento.appointment_date),
    hora: formatarHora(atendimento.appointment_time),
    criadoEm: atendimento.created_at,
  }))
}

export async function criarAtendimento(barbershopId, atendimento, clienteId) {
  const agora = new Date()

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      barbershop_id: barbershopId,
      client_id: clienteId || null,
      client_name: atendimento.cliente,
      service: atendimento.servico,
      amount: atendimento.valor,
      payment_status:
        atendimento.statusPagamento === 'fiado' ? 'pending' : 'paid',
      appointment_date: agora.toISOString().slice(0, 10),
      appointment_time: agora.toTimeString().slice(0, 8),
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar atendimento:', error)
    throw error
  }

  return {
    id: data.id,
    cliente: data.client_name,
    clienteId: data.client_id,
    servico: data.service,
    valor: Number(data.amount || 0),
    statusPagamento: data.payment_status === 'pending' ? 'fiado' : 'pago',
    data: formatarDataParaBR(data.appointment_date),
    hora: formatarHora(data.appointment_time),
    criadoEm: data.created_at,
  }
}

export async function atualizarStatusAtendimento(idAtendimento, statusPagamento) {
  const { error } = await supabase
    .from('appointments')
    .update({
      payment_status: statusPagamento === 'fiado' ? 'pending' : 'paid',
    })
    .eq('id', idAtendimento)

  if (error) {
    console.error('Erro ao atualizar atendimento:', error)
    throw error
  }
}