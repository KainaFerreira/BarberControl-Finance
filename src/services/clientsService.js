import { supabase } from './supabaseClient'

export async function buscarClientes(barbershopId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar clientes:', error)
    return []
  }

  return data.map((cliente) => ({
    id: cliente.id,
    nome: cliente.name,
    telefone: cliente.phone || '',
    cpf: cliente.cpf || '',
    dataNascimento: cliente.birth_date || '',
    observacao: cliente.notes || '',
    dataCadastro: cliente.created_at
      ? new Date(cliente.created_at).toLocaleDateString('pt-BR')
      : '',
    dataInicioFidelidade: cliente.loyalty_started_at,
  }))
}

export async function criarCliente(barbershopId, cliente) {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      barbershop_id: barbershopId,
      name: cliente.nome,
      phone: cliente.telefone || null,
      cpf: cliente.cpf || null,
      birth_date: cliente.dataNascimento || null,
      notes: cliente.observacao || null,
      loyalty_started_at: cliente.dataInicioFidelidade || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar cliente:', error)
    throw error
  }

  return {
    id: data.id,
    nome: data.name,
    telefone: data.phone || '',
    cpf: data.cpf || '',
    dataNascimento: data.birth_date || '',
    observacao: data.notes || '',
    dataCadastro: new Date(data.created_at).toLocaleDateString('pt-BR'),
    dataInicioFidelidade: data.loyalty_started_at,
  }
}

export async function atualizarCliente(cliente) {
  const { error } = await supabase
    .from('clients')
    .update({
      name: cliente.nome,
      phone: cliente.telefone || null,
      cpf: cliente.cpf || null,
      birth_date: cliente.dataNascimento || null,
      notes: cliente.observacao || null,
      loyalty_started_at: cliente.dataInicioFidelidade || null,
    })
    .eq('id', cliente.id)

  if (error) {
    console.error('Erro ao atualizar cliente:', error)
    throw error
  }
}

export async function deletarCliente(idCliente) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', idCliente)

  if (error) {
    console.error('Erro ao excluir cliente:', error)
    throw error
  }
}