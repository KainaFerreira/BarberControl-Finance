function Sidebar({ telaAtual, setTelaAtual, setLogado }) {
  function BotaoMenu({ nome, tela }) {
    const ativo = telaAtual === tela

    return (
      <button
        onClick={() => setTelaAtual(tela)}
        className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
          ativo
            ? 'bg-red-600 text-white'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
        }`}
      >
        {nome}
      </button>
    )
  }

  return (
    <aside className="w-full border-b border-zinc-800 bg-zinc-950 p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-4 lg:mb-8 lg:block">
        <div>
          <h1 className="text-xl font-bold lg:text-2xl">BarberControl</h1>
          <p className="mt-1 text-xs text-zinc-500 lg:text-sm">
            Gestão para barbearias
          </p>
        </div>

        {setLogado && (
          <button
            onClick={() => setLogado(false)}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-red-600 hover:text-white lg:hidden"
          >
            Sair
          </button>
        )}
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        <BotaoMenu nome="Painel" tela="painel" />
        <BotaoMenu nome="Novo Atendimento" tela="novo" />
        <BotaoMenu nome="Histórico" tela="historico" />
        <BotaoMenu nome="Clientes" tela="clientes" />
        <BotaoMenu nome="Fidelidade" tela="fidelidade" />
        <BotaoMenu nome="Fiados" tela="fiado" />
        <BotaoMenu nome="Saídas" tela="saidas" />
        <BotaoMenu nome="Financeiro" tela="financeiro" />
        <BotaoMenu nome="Analytics" tela="analytics" />
        <BotaoMenu nome="Plano" tela="plano" />
      </nav>

      {setLogado && (
        <button
          onClick={() => setLogado(false)}
          className="mt-8 hidden w-full rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 hover:border-red-600 hover:text-white lg:block"
        >
          Sair
        </button>
      )}
    </aside>
  )
}

export default Sidebar