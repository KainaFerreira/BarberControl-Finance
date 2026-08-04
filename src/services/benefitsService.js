import { supabase } from './supabaseClient'

export async function buscarBeneficiosUsados(barbershopId) {
  const { data, error } = await supabase
    .from('benefits_used')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .order('used_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar benefícios usados:', error)
    return []
  }

  return data.map((beneficio) => ({
    id: beneficio.id,
    clienteId: beneficio.client_id,
    cliente: beneficio.client_name,
    dataUso: beneficio.used_at
      ? new Date(beneficio.used_at).toLocaleDateString('pt-BR')
      : '',
    horaUso: beneficio.used_at
      ? new Date(beneficio.used_at).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
    criadoEm: beneficio.used_at,
  }))
}

export async function criarBeneficioUsado(barbershopId, cliente) {
  const { data, error } = await supabase
    .from('benefits_used')
    .insert({
      barbershop_id: barbershopId,
      client_id: cliente.id,
      client_name: cliente.nome,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar benefício usado:', error)
    throw error
  }

  return {
    id: data.id,
    clienteId: data.client_id,
    cliente: data.client_name,
    dataUso: data.used_at
      ? new Date(data.used_at).toLocaleDateString('pt-BR')
      : '',
    horaUso: data.used_at
      ? new Date(data.used_at).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
    criadoEm: data.used_at,
  }
}