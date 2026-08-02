import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency'

function Expenses({ saidas, registrarSaida }) {
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [valor, setValor] = useState('')
  const [observacao, setObservacao] = useState('')
  const [erro, setErro] = useState('')

  function salvarSaida() {
    if (!descricao.trim()) {
      setErro('Informe a descrição da saída.')
      return
    }

    if (!categoria) {
      setErro('Selecione uma categoria.')
      return
    }

    if (!valor || Number(valor) <= 0) {
      setErro('Informe um valor válido.')
      return
    }

    const agora = new Date()

    const novaSaida = {
      id: Date.now(),
      descricao: descricao.trim(),
      categoria,
      valor: Number(valor),
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      observacao: observacao.trim(),
    }

    registrarSaida(novaSaida)

    setDescricao('')
    setCategoria('')
    setValor('')
    setObservacao('')
    setErro('')
  }

  const totalSaidas = saidas.reduce((total, saida) => {
    return total + Number(saida.valor || 0)
  }, 0)

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Saídas</h2>
        <p className="mt-1 text-zinc-400">
          Registre e acompanhe os gastos da barbearia.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
          <h3 className="mb-5 text-xl font-semibold">Registrar saída</h3>

          <form className="space-y-5">
            {erro && (
              <div className="rounded-xl border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {erro}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Descrição
              </label>

              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Marmita, energia, produto..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Produtos">Produtos</option>
                <option value="Aluguel">Aluguel</option>
                <option value="Energia">Energia</option>
                <option value="Água">Água</option>
                <option value="Internet">Internet</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Retirada pessoal">Retirada pessoal</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Valor
              </label>

              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 25"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Observação
              </label>

              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Opcional"
                className="min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
              />
            </div>

            <button
              type="button"
              onClick={salvarSaida}
              className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Registrar saída
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Saídas registradas</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Total registrado: {formatCurrency(totalSaidas)}
              </p>
            </div>
          </div>

          {saidas.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">
                Nenhuma saída registrada ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {saidas.map((saida) => (
                <div
                  key={saida.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold">{saida.descricao}</h4>

                      <p className="mt-1 text-sm text-zinc-500">
                        {saida.categoria} • {saida.data} às {saida.hora}
                      </p>

                      {saida.observacao && (
                        <p className="mt-2 text-sm text-zinc-400">
                          {saida.observacao}
                        </p>
                      )}
                    </div>

                    <p className="font-semibold text-red-500">
                      {formatCurrency(saida.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Expenses