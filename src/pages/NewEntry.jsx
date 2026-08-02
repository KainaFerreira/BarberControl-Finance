import { useState } from 'react'

function NewEntry({ registrarAtendimento, clientes }) {
  const [cliente, setCliente] = useState('')
  const [servico, setServico] = useState('')
  const [valor, setValor] = useState('')
  const [statusPagamento, setStatusPagamento] = useState('pago')
  const [erro, setErro] = useState('')

  function salvarAtendimento() {
    const nomeLimpo = cliente.trim()
    const temNomeESobrenome = nomeLimpo.split(' ').filter(Boolean).length >= 2

    if (!temNomeESobrenome) {
      setErro('Informe o nome e sobrenome do cliente.')
      return
    }

    if (!servico) {
      setErro('Selecione um serviço.')
      return
    }

    if (!valor || Number(valor) <= 0) {
      setErro('Informe um valor válido.')
      return
    }

    const agora = new Date()

    const data = agora.toLocaleDateString('pt-BR')
    const hora = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const novoAtendimento = {
      id: Date.now(),
      cliente: nomeLimpo,
      servico,
      valor: Number(valor),
      statusPagamento,
      data,
      hora,
      criadoEm: agora.toISOString(),
    }

    registrarAtendimento(novoAtendimento)

    setCliente('')
    setServico('')
    setValor('')
    setStatusPagamento('pago')
    setErro('')
  }

  const clientesSugeridos = clientes.filter((clienteCadastrado) => {
    const termo = cliente.toLowerCase().trim()

    if (termo.length < 2) {
      return false
    }

    return clienteCadastrado.nome.toLowerCase().includes(termo)
  })

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Novo atendimento</h2>
        <p className="mt-1 text-zinc-400">
          Registre uma nova entrada da barbearia.
        </p>
      </header>

      <div className="max-w-2xl rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
        <form className="space-y-5">
          {erro && (
            <div className="rounded-xl border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {erro}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Nome completo do cliente
            </label>

            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
            />

            {clientesSugeridos.length > 0 && (
              <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950">
                {clientesSugeridos.map((clienteSugerido) => (
                  <button
                    key={clienteSugerido.id}
                    type="button"
                    onClick={() => setCliente(clienteSugerido.nome)}
                    className="block w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    {clienteSugerido.nome}

                    {clienteSugerido.cpf && (
                      <span className="ml-2 text-xs text-zinc-500">
                        CPF cadastrado
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-2 text-xs text-zinc-500">
              Obrigatório informar nome e sobrenome.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Serviço
            </label>

            <select
              value={servico}
              onChange={(e) => setServico(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
            >
              <option value="">Selecione um serviço</option>
              <option value="Cabelo">Cabelo</option>
              <option value="Barba">Barba</option>
              <option value="Cabelo + Barba">Cabelo + Barba</option>
              <option value="Sobrancelha">Sobrancelha</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Status do pagamento
            </label>

            <select
              value={statusPagamento}
              onChange={(e) => setStatusPagamento(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
            >
              <option value="pago">Pago</option>
              <option value="fiado">Fiado</option>
            </select>

            <p className="mt-2 text-xs text-zinc-500">
              Fiado será registrado como atendimento pendente de pagamento.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Valor
            </label>

            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 35"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          <button
            type="button"
            onClick={salvarAtendimento}
            className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            Registrar atendimento
          </button>
        </form>
      </div>
    </>
  )
}

export default NewEntry