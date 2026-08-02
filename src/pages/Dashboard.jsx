import { useState } from 'react'

import Card from '../components/ui/Card'
import PrivateValue from '../components/ui/PrivateValue'
import LastEntries from '../components/dashboard/LastEntries'
import LoyaltyPreview from '../components/dashboard/LoyaltyPreview'
import { calcularFidelidade } from '../services/loyaltyService'
import { formatCurrency } from '../utils/formatCurrency'

function Dashboard({
  setTelaAtual,
  atendimentos,
  beneficiosUsados,
  clientes,
  saidas,
}) {

  const [mostrarValores, setMostrarValores] = useState(false)
  const hoje = new Date().toLocaleDateString('pt-BR')
  const mesAtual = new Date().getMonth()
  const anoAtual = new Date().getFullYear()

  const atendimentosHoje = atendimentos.filter((item) => item.data === hoje)
  const atendimentosPagosHoje = atendimentosHoje.filter((item) => {
    return item.statusPagamento !== 'fiado'
  })

  const entradasHoje = atendimentosPagosHoje.reduce((total, item) => {
    return total + item.valor
  }, 0)

  const fiadosEmAberto = atendimentos.filter((item) => {
    return item.statusPagamento === 'fiado'
  })

  const totalFiadoEmAberto = fiadosEmAberto.reduce((total, item) => {
    return total + item.valor
  }, 0)

  const entradasMes = atendimentos
    .filter((item) => {
      const partes = item.data.split('/')
      const mes = Number(partes[1]) - 1
      const ano = Number(partes[2])

      const estaNoMesAtual = mes === mesAtual && ano === anoAtual
      const estaPago = item.statusPagamento !== 'fiado'

      return estaNoMesAtual && estaPago
    })
    .reduce((total, item) => {
      return total + item.valor
    }, 0)

  const saidasMes = saidas
    .filter((saida) => {
      const partes = saida.data.split('/')
      const mes = Number(partes[1]) - 1
      const ano = Number(partes[2])

      return mes === mesAtual && ano === anoAtual
    })
    .reduce((total, saida) => {
      return total + Number(saida.valor || 0)
    }, 0)

  const lucroMes = entradasMes - saidasMes

  const clientesUnicos = [...new Set(atendimentos.map((item) => item.cliente))]

  const atendimentosPagos = atendimentos.filter((item) => {
    return item.statusPagamento !== 'fiado'
  })

  const clientesFidelidade = calcularFidelidade(
    atendimentos,
    beneficiosUsados,
    clientes
  )

  const cortesGratisDisponiveis = clientesFidelidade.filter(
    (cliente) => cliente.temCorteGratis
  ).length

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Painel</h2>
          <p className="mt-1 text-zinc-400">
            Resumo das entradas e atendimentos da barbearia.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setMostrarValores(!mostrarValores)}
            className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-300 hover:border-red-600 hover:text-white"
          >
            {mostrarValores ? 'Ocultar valores' : 'Mostrar valores'}
          </button>

          <button
            onClick={() => setTelaAtual('novo')}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            + Novo
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card
          titulo="Entradas hoje"
          valor={
            <PrivateValue
              value={formatCurrency(entradasHoje)}
              show={mostrarValores}
            />
          }
          detalhe={`${atendimentosPagosHoje.length} atendimento(s) pago(s)`}
          destaque
        />

        <Card
          titulo="Entradas no mês"
          valor={
            <PrivateValue
              value={formatCurrency(entradasMes)}
              show={mostrarValores}
            />
          }
          detalhe="Somente pagamentos recebidos"
        />

        <Card
          titulo="Saídas no mês"
          valor={
            <PrivateValue
              value={formatCurrency(saidasMes)}
              show={mostrarValores}
            />
          }
          detalhe="Gastos registrados"
        />

        <Card
          titulo="Lucro do mês"
          valor={
            <PrivateValue
              value={formatCurrency(lucroMes)}
              show={mostrarValores}
            />
          }
          detalhe="Entradas menos saídas"
          destaque
        />

        <Card
          titulo="Fiado em aberto"
          valor={
            <PrivateValue
              value={formatCurrency(totalFiadoEmAberto)}
              show={mostrarValores}
            />
          }
          detalhe={`${fiadosEmAberto.length} pagamento(s) pendente(s)`}
        />

        <Card
          titulo="Cortes grátis"
          valor={cortesGratisDisponiveis}
          detalhe="Benefícios disponíveis"
          destaque
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LastEntries
          atendimentos={atendimentos}
          formatCurrency={formatCurrency}
        />

        <LoyaltyPreview clientesFidelidade={clientesFidelidade} />
      </section>
    </>
  )
}

export default Dashboard