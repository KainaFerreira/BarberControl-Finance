import { calcularFidelidade } from '../services/loyaltyService'

function Loyalty({
  atendimentos,
  beneficiosUsados,
  clientes,
  marcarBeneficioComoUsado,
}) {

  const clientesFidelidade = calcularFidelidade(
    atendimentos,
    beneficiosUsados,
    clientes
  )

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Fidelidade</h2>
        <p className="mt-1 text-zinc-400">
          Acompanhe a contagem dos cortes e os benefícios disponíveis.
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
        <h3 className="font-semibold text-red-400">
          Regra da fidelidade
        </h3>

        <p className="mt-2 text-sm text-zinc-300">
          Apenas clientes com CPF cadastrado participam da promoção de 10 cortes.
          Clientes sem CPF continuam aparecendo no histórico e no cadastro, mas não
          entram na contagem da fidelidade.
        </p>
      </div>

      <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
        {clientesFidelidade.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nenhum cliente com CPF cadastrado possui cortes pagos para fidelidade.
          </p>
        ) : (
          <div className="space-y-6">
            {clientesFidelidade.map((cliente) => {
              const porcentagem = Math.min(cliente.cortes * 10, 100)

              return (
                <div
                  key={cliente.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{cliente.nome}</h3>

                      <p className="text-sm text-zinc-500">
                        {cliente.cortes}/10 cortes pagos
                      </p>

                      {cliente.beneficiosUsados > 0 && (
                        <p className="mt-1 text-xs text-zinc-600">
                          {cliente.beneficiosUsados} benefício(s) já usado(s)
                        </p>
                      )}
                    </div>

                    {cliente.temCorteGratis && (
                      <button
                        onClick={() =>
                          marcarBeneficioComoUsado(cliente.nome)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                      >
                        Marcar como usado
                      </button>
                    )}
                  </div>

                  <div className="h-3 rounded-full bg-zinc-800">
                    <div
                      className="h-3 rounded-full bg-red-600"
                      style={{ width: `${porcentagem}%` }}
                    ></div>
                  </div>

                  {cliente.temCorteGratis && (
                    <p className="mt-3 text-sm text-red-400">
                      Este cliente possui corte grátis disponível.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Loyalty