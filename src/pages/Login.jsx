import { useState } from 'react'

function Login({ setLogado }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function entrar(e) {
    e.preventDefault()

    if (!email.trim()) {
      setErro('Informe o e-mail para acessar.')
      return
    }

    if (!senha.trim()) {
      setErro('Informe a senha para acessar.')
      return
    }

    setErro('')
    setLogado(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-red-900/40 bg-zinc-900 shadow-2xl md:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-red-950 via-zinc-950 to-zinc-900 p-10 md:flex md:flex-col md:justify-between">
          <div>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-black">
              B
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              BarberControl
            </h1>

            <p className="mt-4 max-w-sm text-zinc-300">
              Gestão simples para atendimentos, clientes, fiados, saídas,
              fidelidade e relatórios da barbearia.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <strong className="block text-2xl">100%</strong>
              <span className="text-sm text-zinc-400">focado no uso real</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <strong className="block text-2xl">MVP</strong>
              <span className="text-sm text-zinc-400">validado na prática</span>
            </div>
          </div>
        </section>

        <section className="p-8 md:p-10">
          <div className="mb-8 md:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl font-black">
              B
            </div>

            <h1 className="text-3xl font-bold">BarberControl</h1>

            <p className="mt-2 text-zinc-400">
              Acesse o painel da barbearia.
            </p>
          </div>

          <div className="hidden md:block">
            <h2 className="text-3xl font-bold">Entrar no sistema</h2>

            <p className="mt-2 text-zinc-400">
              Acesse para gerenciar a barbearia.
            </p>
          </div>

          <form onSubmit={entrar} className="mt-8 space-y-5">
            {erro && (
              <div className="rounded-xl border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {erro}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="barbearia@email.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-yellow-900/40 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-300">
              Login demonstrativo: por enquanto, qualquer e-mail e senha
              preenchidos liberam o acesso.
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-600">
            BarberControl • Sistema de gestão para barbearias
          </p>
        </section>
      </div>
    </div>
  )
}

export default Login