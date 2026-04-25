import { useEffect, useMemo, useState } from 'react'
import { useHttpvenda } from '../hooks/useHttpvenda'


type CardProps = {
  title: string
  value: string
}

type Departamento = {
  nome: string
  valor: number
}

type LojaItem = {
  loja: string
  valor: number
  meta: number
  percentualCarregado: number
}

function Card({ title, value }: CardProps) {
  return (
    <div className="bg-secondary p-4 rounded-2xl shadow-lg hover:bg-hover transition min-h-[88px]">
      <p className="text-textSecondary text-xs md:text-sm">{title}</p>
      <h2 className="text-xl md:text-2xl text-textPrimary font-bold mt-1">{value}</h2>
    </div>
  )
}

function Dashboard() {
  const { data, loading, getVenda } = useHttpvenda()
  const [lojaSelecionada, setLojaSelecionada] = useState<any>('')

  useEffect(() => {
    getVenda()
  }, [])

  const formatMoney = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    })

  const formatNumber = (value: number) =>
    value.toLocaleString('pt-BR', {
      maximumFractionDigits: 0,
    })

  const formatPercent = (value: number) =>
    `${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`

  const filiais = useMemo<string[]>(() => {
    return [...new Set(data.map((item) => item.CODFILIAL))].sort()
  }, [data])

useEffect(() => {
  if (filiais.length > 0 && !lojaSelecionada) {
    setLojaSelecionada(filiais[0])
  }
}, [filiais, lojaSelecionada])

  const resumo = useMemo(() => {
    const totalVenda = data.reduce((acc, item) => acc + Number(item.VENDA || 0), 0)
    const totalCusto = data.reduce((acc, item) => acc + Number(item.CUSTO || 0), 0)
    const totalLucro = data.reduce((acc, item) => acc + Number(item.LUCRO || 0), 0)
    const totalNumVendas = data.reduce((acc, item) => acc + Number(item.NUMVENDAS || 0), 0)

    const mapaMetaPorFilial = new Map<string, number>()
    data.forEach((item) => {
      const filial = item.CODFILIAL
      const metaAtual = mapaMetaPorFilial.get(filial) || 0
      if (metaAtual === 0) {
        mapaMetaPorFilial.set(filial, Number(item.META || 0))
      }
    })

    const totalMeta = Array.from(mapaMetaPorFilial.values()).reduce((acc, value) => acc + value, 0)

    const ticketMedio = totalNumVendas > 0 ? totalVenda / totalNumVendas : 0
    const margem = totalVenda > 0 ? (totalLucro / totalVenda) * 100 : 0
    const percentualMeta = totalMeta > 0 ? (totalVenda / totalMeta) * 100 : 0

    return {
      totalVenda,
      totalCusto,
      totalLucro,
      totalNumVendas,
      totalMeta,
      ticketMedio,
      margem,
      percentualMeta,
    }
  }, [data])

  const vendasPorLoja = useMemo<LojaItem[]>(() => {
    const mapa = new Map<string, LojaItem>()

    data.forEach((item) => {
      const filial = item.CODFILIAL
      const atual = mapa.get(filial) || {
        loja: filial,
        valor: 0,
        meta: Number(item.META || 0),
        percentualCarregado: 0,
      }

      atual.valor += Number(item.VENDA || 0)
      atual.meta = Number(item.META || atual.meta || 0)
      atual.percentualCarregado =
        atual.meta > 0 ? (atual.valor / atual.meta) * 100 : 0

      mapa.set(filial, atual)
    })

    return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor)
  }, [data])

  const departamentosGerais = useMemo<Departamento[]>(() => {
    const mapa = new Map<string, number>()

    data.forEach((item) => {
      const nome = item.DEPARTAMENTO || 'Sem departamento'
      mapa.set(nome, (mapa.get(nome) || 0) + Number(item.VENDA || 0))
    })

    return Array.from(mapa.entries())
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [data])

  const departamentosLoja = useMemo<Departamento[]>(() => {
    const mapa = new Map<string, number>()

    data
      .filter((item) => item.CODFILIAL === lojaSelecionada)
      .forEach((item) => {
        const nome = item.DEPARTAMENTO || 'Sem departamento'
        mapa.set(nome, (mapa.get(nome) || 0) + Number(item.VENDA || 0))
      })

    return Array.from(mapa.entries())
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [data, lojaSelecionada])

  const maiorVendaLoja = Math.max(...vendasPorLoja.map((item) => item.valor), 0)
  const maiorVendaDepartamentoGeral = Math.max(...departamentosGerais.map((item) => item.valor), 0)
  const maiorVendaDepartamentoLoja = Math.max(...departamentosLoja.map((item) => item.valor), 0)

  const percentualMetaCircle = Math.min(Math.max(resumo.percentualMeta, 0), 100)
  const circumference = 289
  const dashOffset = circumference - (circumference * percentualMetaCircle) / 100

  return (
    <div className="h-screen bg-primary text-textPrimary px-4 py-3 md:px-6 md:py-4 overflow-hidden pl-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-5 tracking-wide">
          VISÃO GERAL
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-4">
          <Card title="Venda Total" value={loading ? 'Carregando...' : formatMoney(resumo.totalVenda)} />
          <Card title="Custo" value={loading ? 'Carregando...' : formatMoney(resumo.totalCusto)} />
          <Card title="Ticket médio" value={loading ? 'Carregando...' : formatMoney(resumo.ticketMedio)} />
          <Card title="Qt. NF" value={loading ? 'Carregando...' : formatNumber(resumo.totalNumVendas)} />
          <Card title="Margem" value={loading ? 'Carregando...' : formatPercent(resumo.margem)} />
          <Card title="Lucro" value={loading ? 'Carregando...' : formatMoney(resumo.totalLucro)} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary p-3 rounded-2xl h-[260px] flex flex-col">
            <h2 className="mb-2 text-textSecondary text-sm">
              Vendas por Loja
            </h2>

            <div className="space-y-2 overflow-y-auto pr-1">
              {vendasPorLoja.map((item) => {
                const largura = maiorVendaLoja > 0 ? (item.valor / maiorVendaLoja) * 100 : 0

                return (
                  <div key={item.loja}>
                    <div className="flex justify-between text-xs mb-1 gap-3">
                      <span className="text-textPrimary truncate">Filial {item.loja}</span>
                      <span className="text-textSecondary">
                        {formatPercent(item.percentualCarregado)}
                      </span>
                    </div>

                    <div className="w-full bg-hover rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${largura}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] mt-1 text-textSecondary gap-2">
                      <span>{formatMoney(item.valor)}</span>
                      <span>Meta: {formatMoney(item.meta)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl xl:col-span-2 h-[260px] flex flex-col">
            <h2 className="mb-2 text-textSecondary text-sm">
              Venda por Departamento Geral
            </h2>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex items-end gap-3 h-full min-w-[560px]">
                {departamentosGerais.map((dep) => {
                  const altura =
                    maiorVendaDepartamentoGeral > 0
                      ? Math.max((dep.valor / maiorVendaDepartamentoGeral) * 170, 8)
                      : 8

                  return (
                    <div
                      key={dep.nome}
                      className="flex flex-col items-center justify-end h-full min-w-[58px]"
                    >
                      <div className="text-[10px] text-textSecondary mb-1">
                        {formatNumber(dep.valor)}
                      </div>

                      <div
                        className="w-7 rounded-t-lg bg-accent/90"
                        style={{ height: `${altura}px` }}
                      />

                      <div className="text-[10px] text-textSecondary mt-2 text-center leading-tight">
                        {dep.nome}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-secondary p-3 rounded-2xl h-[260px] flex flex-col">
            <h2 className="text-textSecondary mb-2 text-sm">Meta Geral de Venda</h2>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#2a2a4a"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#e94560"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-textPrimary">
                    {formatPercent(resumo.percentualMeta)}
                  </span>
                
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-textSecondary">Meta: {formatMoney(resumo.totalMeta)}</p>
              <p className="text-sm font-semibold text-textPrimary">
                Venda: {formatMoney(resumo.totalVenda)}
              </p>
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl xl:col-span-2 h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-2 gap-3">
              <h2 className="text-textSecondary text-sm">
                Venda por Departamento - Filial {lojaSelecionada || '-'}
              </h2>

              <select
                value={lojaSelecionada}
                onChange={(e) => setLojaSelecionada(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-lg px-3 py-1.5 outline-none text-xs w-[150px]"
              >
                {filiais.map((loja) => (
                  <option key={loja} value={loja}>
                    Filial {loja}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex items-end gap-3 h-full min-w-[560px]">
                {departamentosLoja.map((dep) => {
                  const altura =
                    maiorVendaDepartamentoLoja > 0
                      ? Math.max((dep.valor / maiorVendaDepartamentoLoja) * 170, 8)
                      : 8

                  return (
                    <div
                      key={dep.nome}
                      className="flex flex-col items-center justify-end h-full min-w-[58px]"
                    >
                      <div className="text-[10px] text-textSecondary mb-1">
                        {formatNumber(dep.valor)}
                      </div>

                      <div
                        className="w-7 rounded-t-lg bg-accent/90"
                        style={{ height: `${altura}px` }}
                      />

                      <div className="text-[10px] text-textSecondary mt-2 text-center leading-tight">
                        {dep.nome}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard