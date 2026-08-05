function Plan() {
  const plano = {
    nome: 'Versão normal',
    status: 'Ativo',
    valor: 50,
    formaPagamento: 'Pix / Manual',
    vencimento: 'Dia 10/mês',
    recursos: [
      'Controle de atendimentos',
      'Histórico mensal',
      'Cadastro de clientes',
      'Controle de fidelidade',
      'Controle de fiados',
      'Controle de saídas',
      'Financeiro mensal',
      'Analytics com rankings',
    ],
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Plano</h2>
        <p className="mt-1 text-zinc-400">
          Informações do plano atual da barbearia.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6 xl:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-400">
                Plano atual
              </p>

              <h3 className="mt-2 text-3xl font-bold">{plano.nome}</h3>

              <p className="mt-2 text-zinc-400">
                Plano inicial para gestão simples da barbearia.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              {plano.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Valor mensal</p>
              <strong className="mt-2 block text-xl">
                {formatCurrency(plano.valor)}
              </strong>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Pagamento</p>
              <strong className="mt-2 block text-xl">
                {plano.formaPagamento}
              </strong>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Vencimento</p>
              <strong className="mt-2 block text-xl">
                {plano.vencimento}
              </strong>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-yellow-900/40 bg-yellow-500/5 p-5">
            <h4 className="font-semibold text-yellow-400">
              Pagamento manual
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Nesta versão MVP, o pagamento do plano é controlado manualmente.
              Futuramente, o sistema poderá receber integração com Pix,
              Mercado Pago ou outro gateway de pagamento.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-5 text-xl font-semibold">Recursos inclusos</h3>

          <div className="space-y-3">
            {plano.recursos.map((recurso) => (
              <div
                key={recurso}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-sm text-emerald-400">
                  ✓
                </span>

                <p className="text-sm text-zinc-300">{recurso}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-xl font-semibold">Observações do plano</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Tipo de versão</p>
            <strong className="mt-2 block">MVP funcional</strong>
            <p className="mt-2 text-sm text-zinc-500">
              Versão inicial para validar uso real dentro da barbearia.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Banco de dados</p>
            <strong className="mt-2 block">LocalStorage</strong>
            <p className="mt-2 text-sm text-zinc-500">
              Os dados ficam salvos no navegador usado. Banco online pode ser
              implementado na próxima fase.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Plan