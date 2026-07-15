export function calcularFidelidade(
  atendimentos,
  beneficiosUsados = [],
  clientes = []
) {
  const clientesComCpf = clientes.filter((cliente) => {
    return cliente.cpf && cliente.cpf.trim() !== ''
  })

  const atendimentosPagos = atendimentos.filter((atendimento) => {
    const clienteTemCpf = clientesComCpf.some((cliente) => {
      return cliente.nome.toLowerCase() === atendimento.cliente.toLowerCase()
    })

    return atendimento.statusPagamento !== 'fiado' && clienteTemCpf
  })

  const clientesBase = atendimentosPagos.reduce((lista, atendimento) => {
    const clienteExistente = lista.find((cliente) => {
      return cliente.nome === atendimento.cliente
    })

    if (clienteExistente) {
      clienteExistente.totalCortesPagos += 1
    } else {
      lista.push({
        id: atendimento.cliente,
        nome: atendimento.cliente,
        totalCortesPagos: 1,
      })
    }

    return lista
  }, [])

  const clientesFidelidade = clientesBase.map((cliente) => {
    const beneficiosUsadosDoCliente = beneficiosUsados.filter((beneficio) => {
      return beneficio.cliente === cliente.nome
    }).length

    const cortesValidos =
      cliente.totalCortesPagos - beneficiosUsadosDoCliente * 10

    return {
      ...cliente,
      cortes: Math.max(cortesValidos, 0),
      temCorteGratis: cortesValidos >= 10,
      beneficiosUsados: beneficiosUsadosDoCliente,
    }
  })

  return clientesFidelidade
}