import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'

import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import NewEntry from './pages/NewEntry'
import History from './pages/History'
import Clients from './pages/Clients'
import Loyalty from './pages/Loyalty'
import Debts from './pages/Debts'
import Login from './pages/Login'
import Expenses from './pages/Expenses'
import Finance from './pages/Finance'
import Analytics from './pages/Analytics'
import Plan from './pages/Plan'

import {
  buscarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
} from './services/clientsService'

import {
  buscarAtendimentos,
  criarAtendimento,
  atualizarStatusAtendimento,
} from './services/appointmentsService'

import {
  buscarSaidas,
  criarSaida,
} from './services/expensesService'

import {
  buscarBeneficiosUsados,
  criarBeneficioUsado,
} from './services/benefitsService'

function App() {
  const [telaAtual, setTelaAtual] = useState('painel')
  const [logado, setLogado] = useState(false)
  const [carregandoLogin, setCarregandoLogin] = useState(true)

  const [profile, setProfile] = useState(null)
  const [barbershopId, setBarbershopId] = useState(null)


  const [atendimentos, setAtendimentos] = useState([])
  const [carregandoAtendimentos, setCarregandoAtendimentos] = useState(false)

  const [beneficiosUsados, setBeneficiosUsados] = useState([])
  const [carregandoBeneficios, setCarregandoBeneficios] = useState(false)

  const [clientes, setClientes] = useState([])
  const [carregandoClientes, setCarregandoClientes] = useState(false)

  const [saidas, setSaidas] = useState([])
  const [carregandoSaidas, setCarregandoSaidas] = useState(false)

  async function cadastrarClienteAutomatico(nomeCliente) {
    const nomeLimpo = nomeCliente.trim()

    const clienteJaExiste = clientes.some((cliente) => {
      return cliente.nome.toLowerCase() === nomeLimpo.toLowerCase()
    })

    if (clienteJaExiste) {
      return
    }

    const novoCliente = {
      nome: nomeLimpo,
      telefone: '',
      cpf: '',
      dataNascimento: '',
      observacao: '',
      dataInicioFidelidade: null,
    }

    const clienteCriado = await criarCliente(barbershopId, novoCliente)

    setClientes((clientesAtuais) => [clienteCriado, ...clientesAtuais])
  }

  async function registrarAtendimento(novoAtendimento) {
    const nomeCliente = novoAtendimento.cliente.trim()

    let clienteEncontrado = clientes.find((cliente) => {
      return cliente.nome.toLowerCase() === nomeCliente.toLowerCase()
    })

    if (!clienteEncontrado) {
      const novoCliente = {
        nome: nomeCliente,
        telefone: '',
        cpf: '',
        dataNascimento: '',
        observacao: '',
        dataInicioFidelidade: null,
      }

      clienteEncontrado = await criarCliente(barbershopId, novoCliente)

      setClientes((clientesAtuais) => [
        clienteEncontrado,
        ...clientesAtuais,
      ])
    }

    const atendimentoCriado = await criarAtendimento(
      barbershopId,
      novoAtendimento,
      clienteEncontrado.id
    )

    setAtendimentos((atendimentosAtuais) => [
      atendimentoCriado,
      ...atendimentosAtuais,
    ])

    setTelaAtual('painel')
  }

  async function registrarSaida(novaSaida) {
    const saidaCriada = await criarSaida(barbershopId, novaSaida)

    setSaidas((saidasAtuais) => [
      saidaCriada,
      ...saidasAtuais,
    ])
  }

  async function editarCliente(clienteAtualizado) {
    const clientesAtualizados = clientes.map((cliente) => {
      if (cliente.id !== clienteAtualizado.id) {
        return cliente
      }

      const clienteNaoTinhaCpf = !cliente.cpf || cliente.cpf.trim() === ''

      const clienteAgoraTemCpf =
        clienteAtualizado.cpf && clienteAtualizado.cpf.trim() !== ''

      const deveIniciarFidelidade =
        clienteNaoTinhaCpf && clienteAgoraTemCpf

      return {
        ...clienteAtualizado,
        dataInicioFidelidade: deveIniciarFidelidade
          ? new Date().toISOString()
          : cliente.dataInicioFidelidade ||
          clienteAtualizado.dataInicioFidelidade ||
          null,
      }
    })

    const clienteFinal = clientesAtualizados.find((cliente) => {
      return cliente.id === clienteAtualizado.id
    })

    await atualizarCliente(clienteFinal)

    setClientes(clientesAtualizados)
  }

  async function excluirCliente(idCliente) {
    await deletarCliente(idCliente)

    const clientesAtualizados = clientes.filter((cliente) => {
      return cliente.id !== idCliente
    })

    setClientes(clientesAtualizados)
  }

  async function marcarFiadoComoPago(idAtendimento) {
    await atualizarStatusAtendimento(idAtendimento, 'pago')

    const atendimentosAtualizados = atendimentos.map((atendimento) => {
      if (atendimento.id === idAtendimento) {
        return {
          ...atendimento,
          statusPagamento: 'pago',
        }
      }

      return atendimento
    })

    setAtendimentos(atendimentosAtualizados)
  }

  async function marcarBeneficioComoUsado(nomeCliente) {
    const clienteEncontrado = clientes.find((cliente) => {
      return cliente.nome.toLowerCase() === nomeCliente.toLowerCase()
    })

    if (!clienteEncontrado) {
      alert('Cliente não encontrado.')
      return
    }

    const novoBeneficio = await criarBeneficioUsado(
      barbershopId,
      clienteEncontrado
    )

    setBeneficiosUsados((beneficiosAtuais) => [
      novoBeneficio,
      ...beneficiosAtuais,
    ])
  }

  async function carregarProfile() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Erro ao buscar usuário:', userError)
        setProfile(null)
        setBarbershopId(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role, barbershop_id')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        console.error('Erro ao carregar profile:', error)
        setProfile(null)
        setBarbershopId(null)
        return
      }

      setProfile(data)
      setBarbershopId(data.barbershop_id)

    } catch (error) {
      console.error('Erro inesperado ao carregar profile:', error)
      setProfile(null)
      setBarbershopId(null)
    }
  }

  useEffect(() => {
    async function verificarSessao() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Erro ao verificar sessão:', error)
          setLogado(false)
          return
        }

        const existeSessao = !!data.session

        setLogado(existeSessao)

        if (existeSessao) {
          await carregarProfile()
        }
      } catch (error) {
        console.error('Erro inesperado ao verificar sessão:', error)
        setLogado(false)
      } finally {
        setCarregandoLogin(false)
      }
    }

    verificarSessao()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLogado(!!session)
      setCarregandoLogin(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function carregarClientes() {
      if (!barbershopId) return

      setCarregandoClientes(true)

      const clientesDoBanco = await buscarClientes(barbershopId)

      setClientes(clientesDoBanco)
      setCarregandoClientes(false)
    }

    carregarClientes()
  }, [barbershopId])

  useEffect(() => {
    async function carregarAtendimentos() {
      if (!barbershopId) return

      setCarregandoAtendimentos(true)

      const atendimentosDoBanco = await buscarAtendimentos(barbershopId)

      setAtendimentos(atendimentosDoBanco)
      setCarregandoAtendimentos(false)
    }

    carregarAtendimentos()
  }, [barbershopId])

  useEffect(() => {
    async function carregarSaidas() {
      if (!barbershopId) return

      setCarregandoSaidas(true)

      const saidasDoBanco = await buscarSaidas(barbershopId)

      setSaidas(saidasDoBanco)
      setCarregandoSaidas(false)
    }

    carregarSaidas()
  }, [barbershopId])

  useEffect(() => {
    async function carregarBeneficiosUsados() {
      if (!barbershopId) return

      setCarregandoBeneficios(true)

      const beneficiosDoBanco = await buscarBeneficiosUsados(barbershopId)

      setBeneficiosUsados(beneficiosDoBanco)
      setCarregandoBeneficios(false)
    }

    carregarBeneficiosUsados()
  }, [barbershopId])

  if (carregandoLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Carregando sistema...</p>
      </div>
    )
  }

  if (!logado) {
    return <Login setLogado={setLogado} />
  }

  if (logado && !barbershopId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Carregando dados da barbearia...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          telaAtual={telaAtual}
          setTelaAtual={setTelaAtual}
          setLogado={setLogado}
        />

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          {telaAtual === 'painel' && (
            <Dashboard
              setTelaAtual={setTelaAtual}
              atendimentos={atendimentos}
              beneficiosUsados={beneficiosUsados}
              clientes={clientes}
              saidas={saidas}
            />
          )}

          {telaAtual === 'novo' && (
            <NewEntry
              registrarAtendimento={registrarAtendimento}
              clientes={clientes}
            />
          )}

          {telaAtual === 'historico' && (
            <History atendimentos={atendimentos} />
          )}

          {telaAtual === 'clientes' && (
            <Clients
              clientes={clientes}
              atendimentos={atendimentos}
              editarCliente={editarCliente}
              excluirCliente={excluirCliente}
            />
          )}

          {telaAtual === 'fidelidade' && (
            <Loyalty
              atendimentos={atendimentos}
              beneficiosUsados={beneficiosUsados}
              clientes={clientes}
              marcarBeneficioComoUsado={marcarBeneficioComoUsado}
            />
          )}

          {telaAtual === 'fiado' && (
            <Debts
              atendimentos={atendimentos}
              marcarFiadoComoPago={marcarFiadoComoPago}
            />
          )}

          {telaAtual === 'saidas' && (
            <Expenses
              saidas={saidas}
              registrarSaida={registrarSaida}
            />
          )}

          {telaAtual === 'financeiro' && (
            <Finance
              atendimentos={atendimentos}
              saidas={saidas}
            />
          )}

          {telaAtual === 'analytics' && (
            <Analytics
              atendimentos={atendimentos}
              saidas={saidas}
            />
          )}

          {telaAtual === 'plano' && <Plan />}
        </main>
      </div>
    </div>
  )
}

export default App