function Sidebar({ telaAtual, setTelaAtual, setLogado }) {
  function BotaoMenu({ nome, tela }) {
    const ativo = telaAtual === tela

    return (
      <button
        onClick={() => setTelaAtual(tela)}
        className={`w-full rounded-xl px-4 py-3 text-left transition ${ativo
            ? 'bg-red-600 font-semibold text-white'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
          }`}
      >
        {nome}
      </button>
    )
  }

  return (
    <aside className="w-64 border-r border-red-900/40 bg-zinc-950 p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-red-500">
          BarberControl
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Gestão de entradas
        </p>
      </div>

      <nav className="space-y-3">
        <BotaoMenu nome="Painel" tela="painel" />
        <BotaoMenu nome="Novo Atendimento" tela="novo" />
        <BotaoMenu nome="Histórico" tela="historico" />
        <BotaoMenu nome="Clientes" tela="clientes" />
        <BotaoMenu nome="Fidelidade" tela="fidelidade" />
        <BotaoMenu nome="Fiado" tela="fiado" />
        <BotaoMenu nome="Saídas" tela="saidas" />
        <BotaoMenu nome="Financeiro" tela="financeiro" />
      </nav>
      <button
        onClick={() => setLogado(false)}
        className="mt-10 w-full rounded-xl border border-zinc-800 px-4 py-3 text-left text-zinc-400 transition hover:border-red-600 hover:text-white"
      >
        Sair
      </button>
    </aside>
  )
}

export default Sidebar