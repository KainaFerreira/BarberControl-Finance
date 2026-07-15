function LastEntries({ atendimentos, formatCurrency }) {
  const ultimosAtendimentos = atendimentos.slice(0, 3)

  return (
    <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
      <h3 className="mb-4 text-xl font-semibold">Últimos atendimentos</h3>

      <div className="space-y-4">
        {ultimosAtendimentos.map((atendimento, index) => (
          <div
            key={atendimento.id}
            className={`flex items-center justify-between ${
              index !== ultimosAtendimentos.length - 1
                ? 'border-b border-zinc-800 pb-3'
                : ''
            }`}
          >
            <div>
              <p className="font-medium">{atendimento.cliente}</p>
              <p className="text-sm text-zinc-500">
                {atendimento.servico} • {atendimento.data} {atendimento.hora}
              </p>
            </div>

            <p className="font-semibold text-red-500">
              {formatCurrency(atendimento.valor)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LastEntries