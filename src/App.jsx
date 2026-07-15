import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Dashboard from '../src/pages/Dashboard'
import NewEntry from '../src/pages/NewEntry'
import History from '../src/pages/History'
import Clients from '../src/pages/Clients'
import Loyalty from '../src/pages/Loyalty'
import Debts from '../src/pages/Debts'
import Login from './pages/Login'

import { useLocalStorage } from './hooks/useLocalStorage'
import {
  atendimentosIniciais,
  beneficiosUsadosIniciais,
  clientesIniciais,
} from './data/initialData'

function App() {
  const [telaAtual, setTelaAtual] = useState('painel')
  const [logado, setLogado] = useState(false)

  const [atendimentos, setAtendimentos] = useLocalStorage(
    'barbercontrol_atendimentos',
    atendimentosIniciais
  )

  const [beneficiosUsados, setBeneficiosUsados] = useLocalStorage(
    'barbercontrol_beneficios_usados',
    beneficiosUsadosIniciais
  )

  const [clientes, setClientes] = useLocalStorage(
    'barbercontrol_clientes',
    clientesIniciais
  )

  function cadastrarClienteAutomatico(nomeCliente) {
    const nomeLimpo = nomeCliente.trim()

    const clienteJaExiste = clientes.some((cliente) => {
      return cliente.nome.toLowerCase() === nomeLimpo.toLowerCase()
    })

    if (clienteJaExiste) {
      return
    }

    const novoCliente = {
      id: Date.now(),
      nome: nomeLimpo,
      telefone: '',
      cpf: '',
      dataNascimento: '',
      observacao: '',
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
    }

    setClientes([novoCliente, ...clientes])
  }

  function registrarAtendimento(novoAtendimento) {
    cadastrarClienteAutomatico(novoAtendimento.cliente)

    setAtendimentos([novoAtendimento, ...atendimentos])
    setTelaAtual('painel')
  }

  function editarCliente(clienteAtualizado) {
    const clientesAtualizados = clientes.map((cliente) => {
      if (cliente.id === clienteAtualizado.id) {
        return clienteAtualizado
      }

      return cliente
    })

    setClientes(clientesAtualizados)
  }

  function excluirCliente(idCliente) {
    const clientesAtualizados = clientes.filter((cliente) => {
      return cliente.id !== idCliente
    })

    setClientes(clientesAtualizados)
  }

  function marcarFiadoComoPago(idAtendimento) {
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

  function marcarBeneficioComoUsado(nomeCliente) {
    const novoBeneficio = {
      id: Date.now(),
      cliente: nomeCliente,
      dataUso: new Date().toLocaleDateString('pt-BR'),
      horaUso: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setBeneficiosUsados([novoBeneficio, ...beneficiosUsados])
  }

  if (!logado) {
    return <Login setLogado={setLogado} />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar
          telaAtual={telaAtual}
          setTelaAtual={setTelaAtual}
          setLogado={setLogado}
        />

        <main className="flex-1 p-8">
          {telaAtual === 'painel' && (
            <Dashboard
              setTelaAtual={setTelaAtual}
              atendimentos={atendimentos}
              beneficiosUsados={beneficiosUsados}
              clientes={clientes}
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
        </main>
      </div>
    </div>
  )
}

export default App