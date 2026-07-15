import Card from '../components/ui/Card'
import LastEntries from '../components/dashboard/LastEntries'
import LoyaltyPreview from '../components/dashboard/LoyaltyPreview'
import { calcularFidelidade } from '../services/loyaltyService'
import { formatCurrency } from '../utils/formatCurrency'

function Dashboard({
  setTelaAtual,
  atendimentos,
  beneficiosUsados,
  clientes,
}) {

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

        <button
          onClick={() => setTelaAtual('novo')}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          + Novo
        </button>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          titulo="Entradas hoje"
          valor={formatCurrency(entradasHoje)}
          detalhe={`${atendimentosPagosHoje.length} atendimento(s) pago(s)`}
          destaque
        />

        <Card
          titulo="Entradas no mês"
          valor={formatCurrency(entradasMes)}
          detalhe="Somente pagamentos recebidos"
        />

        <Card
          titulo="Fiado em aberto"
          valor={formatCurrency(totalFiadoEmAberto)}
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