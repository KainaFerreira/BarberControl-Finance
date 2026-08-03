import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency'

function Analytics({ atendimentos, saidas }) {
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

    function encontrarMaisFrequente(lista, campo) {
        if (lista.length === 0) return null

        const contagem = lista.reduce((resultado, item) => {
            const chave = item[campo]

            if (!chave) return resultado

            resultado[chave] = (resultado[chave] || 0) + 1

            return resultado
        }, {})

        const itemMaisFrequente = Object.entries(contagem).sort((a, b) => {
            return b[1] - a[1]
        })[0]

        return {
            nome: itemMaisFrequente[0],
            total: itemMaisFrequente[1],
        }
    }

    function gerarRankingAtendimentos(lista, campo) {
        const agrupado = lista.reduce((resultado, atendimento) => {
            const chave = atendimento[campo]

            if (!chave) return resultado

            if (!resultado[chave]) {
                resultado[chave] = {
                    nome: chave,
                    quantidade: 0,
                    total: 0,
                }
            }

            resultado[chave].quantidade += 1
            resultado[chave].total += Number(atendimento.valor || 0)

            return resultado
        }, {})

        return Object.values(agrupado).sort((a, b) => {
            return b.quantidade - a.quantidade
        })
    }

    function gerarRankingSaidas(lista) {
        const agrupado = lista.reduce((resultado, saida) => {
            const categoria = saida.categoria || 'Sem categoria'

            if (!resultado[categoria]) {
                resultado[categoria] = {
                    nome: categoria,
                    quantidade: 0,
                    total: 0,
                }
            }

            resultado[categoria].quantidade += 1
            resultado[categoria].total += Number(saida.valor || 0)

            return resultado
        }, {})

        return Object.values(agrupado).sort((a, b) => {
            return b.total - a.total
        })
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

    const totalFaturado = atendimentosPagosDoMes.reduce((total, atendimento) => {
        return total + Number(atendimento.valor || 0)
    }, 0)

    const totalFiado = fiadosDoMes.reduce((total, atendimento) => {
        return total + Number(atendimento.valor || 0)
    }, 0)

    const totalSaidas = saidasDoMes.reduce((total, saida) => {
        return total + Number(saida.valor || 0)
    }, 0)

    const lucroLiquido = totalFaturado - totalSaidas

    const clienteMaisFrequente = encontrarMaisFrequente(
        atendimentosDoMes,
        'cliente'
    )

    const servicoMaisFeito = encontrarMaisFrequente(
        atendimentosDoMes,
        'servico'
    )

    const categoriaMaisGasta = encontrarMaisFrequente(
        saidasDoMes,
        'categoria'
    )

    const ticketMedio =
        atendimentosPagosDoMes.length > 0
            ? totalFaturado / atendimentosPagosDoMes.length
            : 0

    const rankingClientes = gerarRankingAtendimentos(
        atendimentosDoMes,
        'cliente'
    )

    const rankingServicos = gerarRankingAtendimentos(
        atendimentosDoMes,
        'servico'
    )

    const rankingSaidas = gerarRankingSaidas(saidasDoMes)

    const maioresGastos = [...saidasDoMes].sort((a, b) => {
        return Number(b.valor || 0) - Number(a.valor || 0)
    })

    return (
        <>
            <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-bold">Analytics</h2>
                    <p className="mt-1 text-zinc-400">
                        Veja os principais indicadores da barbearia.
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

                    <button
                        onClick={() => window.print()}
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                        Gerar PDF
                    </button>
                </div>
            </header>

            <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Total faturado</p>
                    <h3 className="mt-3 text-2xl font-bold text-emerald-400">
                        {formatCurrency(totalFaturado)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        Somente atendimentos pagos
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Lucro líquido</p>
                    <h3 className="mt-3 text-2xl font-bold">
                        {formatCurrency(lucroLiquido)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        Faturamento menos saídas
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Ticket médio</p>
                    <h3 className="mt-3 text-2xl font-bold text-blue-400">
                        {formatCurrency(ticketMedio)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        Média por atendimento pago
                    </p>
                </div>

                <div className="rounded-2xl border border-yellow-900/40 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Fiado em aberto</p>
                    <h3 className="mt-3 text-2xl font-bold text-yellow-400">
                        {formatCurrency(totalFiado)}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {fiadosDoMes.length} pendente(s)
                    </p>
                </div>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Atendimentos no mês</p>
                    <h3 className="mt-3 text-2xl font-bold">
                        {atendimentosDoMes.length}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        Pagos e fiados somados
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Cliente mais frequente</p>
                    <h3 className="mt-3 text-2xl font-bold">
                        {clienteMaisFrequente ? clienteMaisFrequente.nome : '-'}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {clienteMaisFrequente
                            ? `${clienteMaisFrequente.total} atendimento(s)`
                            : 'Sem dados no período'}
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Serviço mais feito</p>
                    <h3 className="mt-3 text-2xl font-bold">
                        {servicoMaisFeito ? servicoMaisFeito.nome : '-'}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {servicoMaisFeito
                            ? `${servicoMaisFeito.total} vez(es)`
                            : 'Sem dados no período'}
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <p className="text-sm text-zinc-400">Categoria com mais gastos</p>
                    <h3 className="mt-3 text-2xl font-bold">
                        {categoriaMaisGasta ? categoriaMaisGasta.nome : '-'}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {categoriaMaisGasta
                            ? `${categoriaMaisGasta.total} saída(s)`
                            : 'Sem saídas no período'}
                    </p>
                </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-5 text-xl font-semibold">Resumo do período</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <p className="text-sm text-zinc-500">Entradas pagas</p>
                        <strong className="mt-2 block text-lg text-emerald-400">
                            {formatCurrency(totalFaturado)}
                        </strong>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <p className="text-sm text-zinc-500">Saídas registradas</p>
                        <strong className="mt-2 block text-lg text-red-400">
                            {formatCurrency(totalSaidas)}
                        </strong>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <p className="text-sm text-zinc-500">Resultado líquido</p>
                        <strong className="mt-2 block text-lg">
                            {formatCurrency(lucroLiquido)}
                        </strong>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <p className="text-sm text-zinc-500">Atendimentos pagos</p>
                        <strong className="mt-2 block text-lg">
                            {atendimentosPagosDoMes.length}
                        </strong>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <p className="text-sm text-zinc-500">Atendimentos fiados</p>
                        <strong className="mt-2 block text-lg text-yellow-400">
                            {fiadosDoMes.length}
                        </strong>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                        <p className="text-sm text-zinc-500">Total de saídas</p>
                        <strong className="mt-2 block text-lg">
                            {saidasDoMes.length}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Ranking de clientes</h3>

                    {rankingClientes.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhum cliente encontrado neste período.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {rankingClientes.map((cliente, index) => (
                                <div
                                    key={cliente.nome}
                                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {index + 1}. {cliente.nome}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {cliente.quantidade} atendimento(s)
                                        </p>
                                    </div>

                                    <strong className="text-emerald-400">
                                        {formatCurrency(cliente.total)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Ranking de serviços</h3>

                    {rankingServicos.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhum serviço encontrado neste período.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {rankingServicos.map((servico, index) => (
                                <div
                                    key={servico.nome}
                                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {index + 1}. {servico.nome}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {servico.quantidade} vez(es)
                                        </p>
                                    </div>

                                    <strong className="text-emerald-400">
                                        {formatCurrency(servico.total)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Gastos por categoria</h3>

                    {rankingSaidas.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhuma saída encontrada neste período.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {rankingSaidas.map((categoria, index) => (
                                <div
                                    key={categoria.nome}
                                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {index + 1}. {categoria.nome}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {categoria.quantidade} saída(s)
                                        </p>
                                    </div>

                                    <strong className="text-red-400">
                                        {formatCurrency(categoria.total)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h3 className="mb-5 text-xl font-semibold">Maiores gastos</h3>

                    {maioresGastos.length === 0 ? (
                        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
                            Nenhum gasto encontrado neste período.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {maioresGastos.map((saida, index) => (
                                <div
                                    key={saida.id}
                                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {index + 1}. {saida.descricao}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            {saida.categoria} • {saida.data}
                                        </p>
                                    </div>

                                    <strong className="text-red-400">
                                        {formatCurrency(saida.valor)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Analytics