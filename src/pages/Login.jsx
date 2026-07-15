import { useState } from 'react'

function Login({ setLogado }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function entrar() {
    if (!email.trim() || !senha.trim()) {
      alert('Informe e-mail e senha para entrar.')
      return
    }

    setLogado(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-red-900/40 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-red-500">
            BarberControl
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Acesse o painel da sua barbearia
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
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
              placeholder="Digite qualquer senha"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          <button
            type="button"
            onClick={entrar}
            className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">
            Protótipo demonstrativo: qualquer e-mail e senha liberam o acesso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login