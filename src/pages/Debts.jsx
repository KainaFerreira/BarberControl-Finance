import { formatCurrency } from '../utils/formatCurrency'

function Debts({ atendimentos, marcarFiadoComoPago }) {
  const fiados = atendimentos.filter((atendimento) => {
    return atendimento.statusPagamento === 'fiado'
  })

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Fiado</h2>
        <p className="mt-1 text-zinc-400">
          Controle os atendimentos que ficaram pendentes de pagamento.
        </p>
      </header>

      <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
        {fiados.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">
              Nenhum fiado registrado ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {fiados.map((fiado) => (
              <div
                key={fiado.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{fiado.cliente}</h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {fiado.servico} • {fiado.data} às {fiado.hora}
                    </p>

                    <span className="mt-3 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                      Pagamento pendente
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-zinc-500">Valor em aberto</p>
                    <p className="font-semibold text-red-500">
                      {formatCurrency(fiado.valor)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => marcarFiadoComoPago(fiado.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                  >
                    Marcar como pago
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

export default Debts