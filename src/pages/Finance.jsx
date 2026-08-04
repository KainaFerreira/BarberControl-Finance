import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency'

function Finance({ atendimentos, saidas }) {
    const hoje = new Date()

    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth())
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear())

    const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ]

    function pertenceAoMes(dataTexto) {
        if (!dataTexto) return false

        const partes = dataTexto.split('/')
        const mes = Number(partes[1]) - 1
        const ano = Number(partes[2])

        return mes === Number(mesSelecionado) && ano === Number(anoSelecionado)
    }

    const atendimentosDoMes = atendimentos.filter((atendimento) => {
        return pertenceAoMes(atendimento.data)
    })

    const atendimentosPagosDoMes = atendimentosDoMes.filter((atendimento) => {
        return atendimento.statusPagamento !== 'fiado'
    })

    const fiadosDoMes = atendimentosDoMes.filter((atendimento) => {
        return atendimento.statusPagamento === 'fiado'
    })

    const saidasDoMes = saidas.filter((saida) => {
        return pertenceAoMes(saida.data)
    })

    const totalEntradas = atendimentosPagosDoMes.reduce((total, atendimento) => {
        return total + Number(atendimento.valor || 0)
    }, 0)

    const totalSaidas = saidasDoMes.reduce((total, saida) => {
        return total + Number(saida.valor || 0)
    }, 0)

    const totalFiado = fiadosDoMes.reduce((total, atendimento) => {
        return total + Number(atendimento.valor || 0)
    }, 0)

    const lucroLiquido = totalEntradas - totalSaidas

    return (
        <>
            <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-bold">Financeiro</h2>
                    <p className="mt-1 text-zinc-400">
                        Acompanhe entradas, saídas e lucro mensal.
                    </p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={mesSelecionado}
                        onChange={(e) => setMesSelecionado(Number(e.target.value))}
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                    >
                        {meses.map((mes, index) => (
                            <option key={mes} value={index}>
                                {mes}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                        className="w-28 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-600"
                    />
                </div>
            </header>

            <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-emerald-900/40 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Entradas pagas</p>
                    <h3 className="mt-3 text-2xl font-bold text-emerald-400">
                        {formatCurrency(totalEntradas)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {atendimentosPagosDoMes.length} atendimento(s)
                    </p>
                </div>

                <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Saídas</p>
                    <h3 className="mt-3 text-2xl font-bold text-red-400">
                        {formatCurrency(totalSaidas)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {saidasDoMes.length} saída(s)
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Lucro líquido</p>
                    <h3 className="mt-3 text-2xl font-bold">
                        {formatCurrency(lucroLiquido)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        Entradas menos saídas
                    </p>
                </div>

                <div className="rounded-2xl border border-yellow-900/40 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Fiado do mês</p>
                    <h3 className="mt-3 text-2xl font-bold text-yellow-400">
                        {formatCurrency(totalFiado)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {fiadosDoMes.length} pendente(s)
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Entradas do mês</h3>

                    {atendimentosPagosDoMes.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhuma entrada paga encontrada neste mês.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {atendimentosPagosDoMes.map((atendimento) => (
                                <div
                                    key={atendimento.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h4 className="font-semibold">{atendimento.cliente}</h4>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                {atendimento.servico} • {atendimento.data} às{' '}
                                                {atendimento.hora}
                                            </p>
                                        </div>

                                        <p className="font-semibold text-emerald-400">
                                            {formatCurrency(atendimento.valor)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Saídas do mês</h3>

                    {saidasDoMes.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhuma saída encontrada neste mês.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {saidasDoMes.map((saida) => (
                                <div
                                    key={saida.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h4 className="font-semibold">{saida.descricao}</h4>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                {saida.categoria} • {saida.data} às {saida.hora}
                                            </p>

                                            {saida.observacao && (
                                                <p className="mt-2 text-sm text-zinc-400">
                                                    {saida.observacao}
                                                </p>
                                            )}
                                        </div>

                                        <p className="font-semibold text-red-400">
                                            {formatCurrency(saida.valor)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Fiados do mês</h3>

                    {fiadosDoMes.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhum fiado encontrado neste mês.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {fiadosDoMes.map((atendimento) => (
                                <div
                                    key={atendimento.id}
                                    className="rounded-xl border border-yellow-900/40 bg-zinc-950 p-5"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h4 className="font-semibold">{atendimento.cliente}</h4>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                {atendimento.servico} • {atendimento.data} às{' '}
                                                {atendimento.hora}
                                            </p>

                                            <p className="mt-2 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                                                Pendente
                                            </p>
                                        </div>

                                        <p className="font-semibold text-yellow-400">
                                            {formatCurrency(atendimento.valor)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Finance