import { useEffect, useMemo, useState } from 'react'
import { useHttpvenda } from '../hooks/useHttpvenda'
import type { GetVendaMesAtual } from '../interface/GetVendaMesAtual'

const formatMoney = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })

const formatNumber = (value: number) =>
  value.toLocaleString('pt-BR', {
    maximumFractionDigits: 0,
  })

const formatPercent = (value: number) => {
  const sinal = value > 0 ? '+' : ''
  return `${sinal}${value.toFixed(1)}%`
}

const calcVariacao = (atual: number, anterior: number) => {
  if (anterior === 0) return atual > 0 ? 100 : 0
  return ((atual - anterior) / anterior) * 100
}

const calcTicketMedio = (venda: number, nf: number) => {
  if (!nf) return 0
  return venda / nf
}

type CardComparativoProps = {
  titulo: string
  subtitulo: string
  dados: {
    nome: string
    valor1: number
    valor2: number
  }[]
  maxValor: number
  formatadorValor?: (value: number) => string
}

function CardComparativoBarras({
  titulo,
  subtitulo,
  dados,
  maxValor,
  formatadorValor,
}: CardComparativoProps) {
  return (
    <div className="bg-secondary p-3 rounded-2xl flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 gap-3">
        <h2 className="text-textSecondary text-sm">{titulo}</h2>
        <span className="text-[11px] text-textSecondary">{subtitulo}</span>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex items-end gap-3 h-full min-w-[620px]">
          {dados.map((item) => {
            const altura1 = maxValor > 0 ? (item.valor1 / maxValor) * 150 : 0
            const altura2 = maxValor > 0 ? (item.valor2 / maxValor) * 150 : 0
            const variacao = calcVariacao(item.valor2, item.valor1)

            return (
              <div
                key={item.nome}
                className="flex flex-col items-center justify-end h-full min-w-[72px]"
                title={
                  formatadorValor
                    ? `P1: ${formatadorValor(item.valor1)} | P2: ${formatadorValor(item.valor2)}`
                    : undefined
                }
              >
                <div
                  className={`text-[10px] mb-1 font-semibold ${
                    variacao >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatPercent(variacao)}
                </div>

                <div className="flex items-end gap-1 h-[170px]">
                  <div className="flex flex-col items-center justify-end">
                    <div className="text-[9px] text-textSecondary mb-1">P1</div>
                    <div
                      className="w-4 rounded-t-md bg-white/60 transition-all"
                      style={{ height: `${altura1}px` }}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-end">
                    <div className="text-[9px] text-textSecondary mb-1">P2</div>
                    <div
                      className="w-4 rounded-t-md bg-accent transition-all"
                      style={{ height: `${altura2}px` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-textSecondary mt-2 text-center leading-tight">
                  {item.nome}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CardComparativoHorizontal({
  titulo,
  subtitulo,
  dados,
  maxValor,
  formatadorValor,
}: CardComparativoProps) {
  return (
    <div className="bg-secondary p-3 rounded-2xl flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-2 gap-3">
        <h2 className="text-textSecondary text-sm">{titulo}</h2>
        <span className="text-[11px] text-textSecondary">{subtitulo}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {dados.map((item) => {
          const pct1 = maxValor > 0 ? (item.valor1 / maxValor) * 100 : 0
          const pct2 = maxValor > 0 ? (item.valor2 / maxValor) * 100 : 0
          const variacao = calcVariacao(item.valor2, item.valor1)

          return (
            <div key={item.nome} className="bg-primary/35 rounded-xl p-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="truncate">{item.nome}</span>
                <span
                  className={`font-semibold ${
                    variacao >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatPercent(variacao)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] w-6 text-textSecondary">P1</span>
                <div className="flex-1 bg-hover rounded-full h-2">
                  <div
                    className="bg-white/60 h-2 rounded-full"
                    style={{ width: `${pct1}%` }}
                  />
                </div>
                {formatadorValor && (
                  <span className="text-[10px] w-16 text-right">
                    {formatadorValor(item.valor1)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] w-6 text-textSecondary">P2</span>
                <div className="flex-1 bg-hover rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${pct2}%` }}
                  />
                </div>
                {formatadorValor && (
                  <span className="text-[10px] w-16 text-right">
                    {formatadorValor(item.valor2)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const agruparPorFilial = (dados: GetVendaMesAtual[]) => {
  const mapa = new Map<
    string,
    { nome: string; venda: number; nf: number }
  >()

  dados.forEach((item) => {
    const chave = item.CODFILIAL
    const atual = mapa.get(chave) || {
      nome: `Filial ${item.CODFILIAL}`,
      venda: 0,
      nf: 0,
    }

    atual.venda += Number(item.VENDA || 0)
    atual.nf += Number(item.NUMVENDAS || 0)

    mapa.set(chave, atual)
  })

  return Array.from(mapa.values()).sort((a, b) => b.venda - a.venda)
}

const agruparPorDepartamento = (dados: GetVendaMesAtual[], filial?: string) => {
  const mapa = new Map<
    string,
    { nome: string; valor: number }
  >()

  dados
    .filter((item) => {
      if (!filial || filial === 'Todas') return true
      return item.CODFILIAL === filial
    })
    .forEach((item) => {
      const chave = item.DEPARTAMENTO || 'Sem departamento'
      const atual = mapa.get(chave) || {
        nome: chave,
        valor: 0,
      }

      atual.valor += Number(item.VENDA || 0)
      mapa.set(chave, atual)
    })

  return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor)
}

const ComparativoVenda = () => {
  const [lojaSelecionada, setLojaSelecionada] = useState('Todas')
  const [data1Inicio, setData1Inicio] = useState('2026-03-01')
  const [data1Fim, setData1Fim] = useState('2026-03-15')
  const [data2Inicio, setData2Inicio] = useState('2026-03-16')
  const [data2Fim, setData2Fim] = useState('2026-03-31')

  const periodo1 = useHttpvenda()
  const periodo2 = useHttpvenda()

  useEffect(() => {
    if (data1Inicio && data1Fim) {
      periodo1.getVendaData(data1Inicio, data1Fim)
    }
  }, [data1Inicio, data1Fim])

  useEffect(() => {
    if (data2Inicio && data2Fim) {
      periodo2.getVendaData(data2Inicio, data2Fim)
    }
  }, [data2Inicio, data2Fim])

  const loading = periodo1.loading || periodo2.loading

  const lojasPeriodo1 = useMemo(() => agruparPorFilial(periodo1.data), [periodo1.data])
  const lojasPeriodo2 = useMemo(() => agruparPorFilial(periodo2.data), [periodo2.data])

  const opcoesLoja = useMemo(() => {
    const mapa = new Map<string, string>()

    lojasPeriodo1.forEach((item) => mapa.set(item.nome.replace('Filial ', ''), item.nome))
    lojasPeriodo2.forEach((item) => mapa.set(item.nome.replace('Filial ', ''), item.nome))

    return Array.from(mapa.entries()).map(([value, label]) => ({
      value,
      label,
    }))
  }, [lojasPeriodo1, lojasPeriodo2])

  const dadosVenda = useMemo(() => {
    const mapa = new Map<
      string,
      { nome: string; valor1: number; valor2: number }
    >()

    lojasPeriodo1.forEach((item) => {
      mapa.set(item.nome, {
        nome: item.nome,
        valor1: item.venda,
        valor2: 0,
      })
    })

    lojasPeriodo2.forEach((item) => {
      const atual = mapa.get(item.nome) || {
        nome: item.nome,
        valor1: 0,
        valor2: 0,
      }

      atual.valor2 = item.venda
      mapa.set(item.nome, atual)
    })

    let lista = Array.from(mapa.values()).sort((a, b) => b.valor2 - a.valor2)

    if (lojaSelecionada !== 'Todas') {
      lista = lista.filter((item) => item.nome === `Filial ${lojaSelecionada}`)
    }

    return lista
  }, [lojasPeriodo1, lojasPeriodo2, lojaSelecionada])

  const dadosNf = useMemo(() => {
    const mapa = new Map<
      string,
      { nome: string; valor1: number; valor2: number }
    >()

    lojasPeriodo1.forEach((item) => {
      mapa.set(item.nome, {
        nome: item.nome,
        valor1: item.nf,
        valor2: 0,
      })
    })

    lojasPeriodo2.forEach((item) => {
      const atual = mapa.get(item.nome) || {
        nome: item.nome,
        valor1: 0,
        valor2: 0,
      }

      atual.valor2 = item.nf
      mapa.set(item.nome, atual)
    })

    let lista = Array.from(mapa.values()).sort((a, b) => b.valor2 - a.valor2)

    if (lojaSelecionada !== 'Todas') {
      lista = lista.filter((item) => item.nome === `Filial ${lojaSelecionada}`)
    }

    return lista
  }, [lojasPeriodo1, lojasPeriodo2, lojaSelecionada])

  const dadosTicket = useMemo(() => {
    const mapa = new Map<
      string,
      { nome: string; valor1: number; valor2: number }
    >()

    const nomes = new Set([
      ...lojasPeriodo1.map((item) => item.nome),
      ...lojasPeriodo2.map((item) => item.nome),
    ])

    nomes.forEach((nome) => {
      const p1 = lojasPeriodo1.find((item) => item.nome === nome)
      const p2 = lojasPeriodo2.find((item) => item.nome === nome)

      mapa.set(nome, {
        nome,
        valor1: calcTicketMedio(p1?.venda || 0, p1?.nf || 0),
        valor2: calcTicketMedio(p2?.venda || 0, p2?.nf || 0),
      })
    })

    let lista = Array.from(mapa.values()).sort((a, b) => b.valor2 - a.valor2)

    if (lojaSelecionada !== 'Todas') {
      lista = lista.filter((item) => item.nome === `Filial ${lojaSelecionada}`)
    }

    return lista
  }, [lojasPeriodo1, lojasPeriodo2, lojaSelecionada])

  const graficoDepartamentos = useMemo(() => {
    const dep1 = agruparPorDepartamento(
      periodo1.data,
      lojaSelecionada === 'Todas' ? undefined : lojaSelecionada
    )
    const dep2 = agruparPorDepartamento(
      periodo2.data,
      lojaSelecionada === 'Todas' ? undefined : lojaSelecionada
    )

    const mapa = new Map<
      string,
      { nome: string; valor1: number; valor2: number }
    >()

    dep1.forEach((item) => {
      mapa.set(item.nome, {
        nome: item.nome,
        valor1: item.valor,
        valor2: 0,
      })
    })

    dep2.forEach((item) => {
      const atual = mapa.get(item.nome) || {
        nome: item.nome,
        valor1: 0,
        valor2: 0,
      }

      atual.valor2 = item.valor
      mapa.set(item.nome, atual)
    })

    return Array.from(mapa.values()).sort((a, b) => b.valor2 - a.valor2)
  }, [periodo1.data, periodo2.data, lojaSelecionada])

  const maxVenda = Math.max(...dadosVenda.flatMap((item) => [item.valor1, item.valor2]), 1)
  const maxTicket = Math.max(...dadosTicket.flatMap((item) => [item.valor1, item.valor2]), 1)
  const maxNf = Math.max(...dadosNf.flatMap((item) => [item.valor1, item.valor2]), 1)
  const maxDepartamento = Math.max(
    ...graficoDepartamentos.flatMap((item) => [item.valor1, item.valor2]),
    1
  )

  return (
    <div className="h-screen bg-primary text-textPrimary px-4 py-3 md:px-6 md:py-4 overflow-hidden pl-16">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-wide">
              COMPARATIVO GERAL
            </h1>
            <p className="text-sm text-textSecondary mt-1">
              Gráficos de venda, ticket médio, quantidade de NF e departamento
            </p>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs text-textSecondary">
            <span>{data1Inicio} até {data1Fim}</span>
            <span className="text-white/30">vs</span>
            <span>{data2Inicio} até {data2Fim}</span>
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-3 border border-white/10 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Loja</label>
              <select
                value={lojaSelecionada}
                onChange={(e) => setLojaSelecionada(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              >
                <option value="Todas">Todas as lojas</option>
                {opcoesLoja.map((loja) => (
                  <option key={loja.value} value={loja.value}>
                    {loja.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 1 - início</label>
              <input
                type="date"
                value={data1Inicio}
                onChange={(e) => setData1Inicio(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 1 - fim</label>
              <input
                type="date"
                value={data1Fim}
                onChange={(e) => setData1Fim(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 2 - início</label>
              <input
                type="date"
                value={data2Inicio}
                onChange={(e) => setData2Inicio(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 2 - fim</label>
              <input
                type="date"
                value={data2Fim}
                onChange={(e) => setData2Fim(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
          <CardComparativoHorizontal
            titulo="Comparativo de Venda"
            subtitulo={lojaSelecionada === 'Todas' ? 'Todas as lojas' : `Filial ${lojaSelecionada}`}
            dados={dadosVenda}
            maxValor={maxVenda}
            formatadorValor={formatMoney}
          />

          <CardComparativoBarras
            titulo="Comparativo de Ticket Médio"
            subtitulo={lojaSelecionada === 'Todas' ? 'Todas as lojas' : `Filial ${lojaSelecionada}`}
            dados={dadosTicket}
            maxValor={maxTicket}
            formatadorValor={formatMoney}
          />

          <CardComparativoBarras
            titulo="Comparativo de Qt. NF"
            subtitulo={lojaSelecionada === 'Todas' ? 'Todas as lojas' : `Filial ${lojaSelecionada}`}
            dados={dadosNf}
            maxValor={maxNf}
            formatadorValor={formatNumber}
          />

          <CardComparativoBarras
            titulo="Comparativo por Departamento"
            subtitulo={lojaSelecionada === 'Todas' ? 'Todas as lojas' : `Filial ${lojaSelecionada}`}
            dados={graficoDepartamentos}
            maxValor={maxDepartamento}
            formatadorValor={formatMoney}
          />
        </div>

        {loading && (
          <div className="mt-3 text-sm text-textSecondary">
            Carregando dados...
          </div>
        )}
      </div>
    </div>
  )
}

export default ComparativoVenda