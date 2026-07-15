function LoyaltyPreview({ clientesFidelidade }) {
  return (
    <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
      <h3 className="mb-4 text-xl font-semibold">Fidelidade</h3>

      {clientesFidelidade.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nenhum cliente com atendimento registrado ainda.
        </p>
      ) : (
        clientesFidelidade.slice(0, 3).map((cliente) => (
          <div key={cliente.nome} className="mb-5">
            <div className="mb-2 flex justify-between">
              <span>{cliente.nome}</span>

              <span
                className={
                  cliente.temCorteGratis ? 'text-red-500' : 'text-zinc-400'
                }
              >
                {cliente.cortes}/10
              </span>
            </div>

            <div className="h-3 rounded-full bg-zinc-800">
              <div
                className="h-3 rounded-full bg-red-600"
                style={{
                  width: `${Math.min(cliente.cortes * 10, 100)}%`,
                }}
              ></div>
            </div>

            {cliente.temCorteGratis >= 10 && (
              <p className="mt-2 text-sm text-red-400">
                Corte grátis disponível
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default LoyaltyPreview