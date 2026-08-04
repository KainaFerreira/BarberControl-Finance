import { formatCurrency } from '../utils/formatCurrency'

function History({ atendimentos }) {

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Histórico</h2>
        <p className="mt-1 text-zinc-400">
          Lista de entradas registradas na barbearia.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
        <table className="min-w-full text-left">
          <thead className="text-sm text-zinc-400">
            <tr>
              <th className="pb-4">Data</th>
              <th className="pb-4">Hora</th>
              <th className="pb-4">Cliente</th>
              <th className="pb-4">Serviço</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Valor</th>
            </tr>
          </thead>

          <tbody>
            {atendimentos.map((atendimento) => (
              <tr key={atendimento.id} className="border-t border-zinc-800">
                <td className="py-4 text-zinc-300">{atendimento.data}</td>
                <td className="py-4 text-zinc-300">{atendimento.hora}</td>
                <td className="py-4 font-medium">{atendimento.cliente}</td>
                <td className="py-4 text-zinc-300">{atendimento.servico}</td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${atendimento.statusPagamento === 'fiado'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-green-500/10 text-green-400'
                      }`}
                  >
                    {atendimento.statusPagamento === 'fiado' ? 'Fiado' : 'Pago'}
                  </span>
                </td>

                <td className="py-4 text-right font-semibold text-red-500">
                  {formatCurrency(atendimento.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default History