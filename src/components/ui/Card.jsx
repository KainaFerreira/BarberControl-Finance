function Card({ titulo, valor, detalhe, destaque }) {
  return (
    <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{titulo}</p>

      <h3
        className={`mt-3 text-3xl font-bold ${
          destaque ? 'text-red-500' : 'text-white'
        }`}
      >
        {valor}
      </h3>

      <p className="mt-2 text-sm text-zinc-500">{detalhe}</p>
    </div>
  )
}

export default Card