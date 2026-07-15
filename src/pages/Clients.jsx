import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency'

function Clients({
  clientes = [],
  atendimentos = [],
  editarCliente,
  excluirCliente,
}) {

  const [busca, setBusca] = useState('')
  const [clienteEditando, setClienteEditando] = useState(null)

  const clientesComResumo = clientes.map((cliente) => {
    const atendimentosDoCliente = atendimentos.filter((atendimento) => {
      const nomeAtendimento = atendimento.cliente || ''
      const nomeCliente = cliente.nome || ''

      return nomeAtendimento.toLowerCase() === nomeCliente.toLowerCase()
    })

    const totalAtendimentos = atendimentosDoCliente.length

    const totalGasto = atendimentosDoCliente.reduce((total, atendimento) => {
      return total + atendimento.valor
    }, 0)

    const ultimoAtendimento = atendimentosDoCliente[0]
      ? `${atendimentosDoCliente[0].data} ${atendimentosDoCliente[0].hora}`
      : 'Nenhum atendimento registrado'

    return {
      ...cliente,
      totalAtendimentos,
      totalGasto,
      ultimoAtendimento,
    }
  })

  const clientesFiltrados = clientesComResumo.filter((cliente) => {
    const termo = busca.toLowerCase()

    const nome = cliente.nome || ''
    const telefone = cliente.telefone || ''
    const cpf = cliente.cpf || ''

    return (
      nome.toLowerCase().includes(termo) ||
      telefone.toLowerCase().includes(termo) ||
      cpf.toLowerCase().includes(termo)
    )
  })

  function iniciarEdicao(cliente) {
    setClienteEditando({
      ...cliente,
    })
  }

  function cancelarEdicao() {
    setClienteEditando(null)
  }

  function alterarCampoCliente(campo, valor) {
    setClienteEditando({
      ...clienteEditando,
      [campo]: valor,
    })
  }

  function limparCpf(cpf) {
    return cpf.replace(/\D/g, '')
  }

  function salvarEdicao() {
    const nomeLimpo = clienteEditando.nome.trim()
    const cpfLimpo = clienteEditando.cpf.trim()
    const cpfComparacao = limparCpf(cpfLimpo)

    const temNomeESobrenome = nomeLimpo.split(' ').filter(Boolean).length >= 2

    if (!temNomeESobrenome) {
      alert('Informe nome e sobrenome do cliente.')
      return
    }

    if (cpfComparacao) {
      const cpfJaExiste = clientes.some((cliente) => {
        const mesmoCpf = limparCpf(cliente.cpf || '') === cpfComparacao
        const outroCliente = cliente.id !== clienteEditando.id

        return mesmoCpf && outroCliente
      })

      if (cpfJaExiste) {
        alert('Já existe outro cliente cadastrado com esse CPF.')
        return
      }
    }

    editarCliente({
      ...clienteEditando,
      nome: nomeLimpo,
      cpf: cpfLimpo,
    })

    setClienteEditando(null)
  }

  function confirmarExclusao(cliente) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o cliente ${cliente.nome}?`
    )

    if (!confirmou) {
      return
    }

    excluirCliente(cliente.id)

    if (clienteEditando?.id === cliente.id) {
      setClienteEditando(null)
    }
  }

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Clientes</h2>
        <p className="mt-1 text-zinc-400">
          Consulte os clientes registrados automaticamente pelos atendimentos.
        </p>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome, telefone ou CPF..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
        {clientes.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nenhum cliente registrado ainda.
          </p>
        ) : (
          <div className="space-y-4">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{cliente.nome}</h3>

                    {cliente.cpf ? (
                      <span className="mt-2 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        CPF cadastrado — participa da fidelidade
                      </span>
                    ) : (
                      <span className="mt-2 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                        Sem CPF — fora da fidelidade
                      </span>
                    )}

                    <div className="mt-2 space-y-1 text-sm text-zinc-500">
                      <p>
                        Telefone: {cliente.telefone || 'Não informado'}
                      </p>

                      <p>
                        CPF: {cliente.cpf || 'Não informado'}
                      </p>

                      <p>
                        Data de nascimento:{' '}
                        {cliente.dataNascimento || 'Não informada'}
                      </p>

                      <p>
                        {cliente.totalAtendimentos} atendimento(s) registrado(s)
                      </p>

                      <p>
                        Último atendimento: {cliente.ultimoAtendimento}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Total gasto</p>
                    <p className="font-semibold text-red-500">
                      {formatCurrency(cliente.totalGasto)}
                    </p>
                  </div>
                </div>

                {cliente.observacao && (
                  <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    <p className="text-xs text-zinc-500">Observação</p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {cliente.observacao}
                    </p>
                  </div>
                )}

                {clienteEditando?.id === cliente.id && (
                  <div className="mt-5 rounded-xl border border-red-900/40 bg-zinc-900 p-4">
                    <h4 className="mb-4 font-semibold text-white">
                      Editar cliente
                    </h4>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                          Nome completo
                        </label>
                        <input
                          type="text"
                          value={clienteEditando.nome}
                          onChange={(e) => alterarCampoCliente('nome', e.target.value)}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                          Telefone
                        </label>
                        <input
                          type="text"
                          value={clienteEditando.telefone}
                          onChange={(e) => alterarCampoCliente('telefone', e.target.value)}
                          placeholder="Ex: (48) 99999-9999"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                          CPF
                        </label>
                        <input
                          type="text"
                          value={clienteEditando.cpf}
                          onChange={(e) => alterarCampoCliente('cpf', e.target.value)}
                          placeholder="Opcional"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                          Data de nascimento
                        </label>
                        <input
                          type="date"
                          value={clienteEditando.dataNascimento}
                          onChange={(e) =>
                            alterarCampoCliente('dataNascimento', e.target.value)
                          }
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm text-zinc-300">
                          Observação
                        </label>
                        <textarea
                          value={clienteEditando.observacao}
                          onChange={(e) => alterarCampoCliente('observacao', e.target.value)}
                          placeholder="Ex: prefere degradê baixo, paga no fim do mês..."
                          className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={salvarEdicao}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                      >
                        Salvar
                      </button>

                      <button
                        onClick={cancelarEdicao}
                        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-red-600 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => iniciarEdicao(cliente)}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-red-600 hover:text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => confirmarExclusao(cliente)}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-red-600 hover:text-white"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Clients