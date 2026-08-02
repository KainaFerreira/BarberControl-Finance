function getDataAtendimento(atendimento) {
  if (atendimento.criadoEm) {
    return new Date(atendimento.criadoEm).getTime()
  }

  if (typeof atendimento.id === 'number' && atendimento.id > 1000000000000) {
    return atendimento.id
  }

  return null
}

export function calcularFidelidade(
  atendimentos,
  beneficiosUsados = [],
  clientes = []
) {
  const atendimentosValidosParaFidelidade = atendimentos.filter((atendimento) => {
    if (atendimento.statusPagamento === 'fiado') {
      return false
    }

    const cliente = clientes.find((clienteCadastrado) => {
      return (
        clienteCadastrado.nome.toLowerCase() ===
        atendimento.cliente.toLowerCase()
      )
    })

    if (!cliente) {
      return false
    }

    if (!cliente.cpf || cliente.cpf.trim() === '') {
      return false
    }

    if (!cliente.dataInicioFidelidade) {
      return false
    }

    const dataAtendimento = getDataAtendimento(atendimento)
    const dataInicioFidelidade = new Date(
      cliente.dataInicioFidelidade
    ).getTime()

    if (!dataAtendimento) {
      return false
    }

    return dataAtendimento >= dataInicioFidelidade
  })

  const clientesBase = atendimentosValidosParaFidelidade.reduce(
    (lista, atendimento) => {
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
    },
    []
  )

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