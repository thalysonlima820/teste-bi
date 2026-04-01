import { useMemo, useState } from 'react'

type DepartamentoComparativo = {
  nome: string
  vendaPeriodo1: number
  vendaPeriodo2: number
  nfPeriodo1: number
  nfPeriodo2: number
}

type LojaComparativo = {
  nome: string
  vendaPeriodo1: number
  vendaPeriodo2: number
  nfPeriodo1: number
  nfPeriodo2: number
}

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

const ComparativoVenda = () => {
  const [lojaSelecionada, setLojaSelecionada] = useState('Todas')
  const [data1Inicio, setData1Inicio] = useState('2026-03-01')
  const [data1Fim, setData1Fim] = useState('2026-03-15')
  const [data2Inicio, setData2Inicio] = useState('2026-03-16')
  const [data2Fim, setData2Fim] = useState('2026-03-31')

  const comparativoPorLoja: LojaComparativo[] = [
    { nome: 'Loja Centro', vendaPeriodo1: 420000, vendaPeriodo2: 455000, nfPeriodo1: 8450, nfPeriodo2: 9020 },
    { nome: 'Loja Norte', vendaPeriodo1: 315000, vendaPeriodo2: 298000, nfPeriodo1: 7010, nfPeriodo2: 6740 },
    { nome: 'Loja Sul', vendaPeriodo1: 280000, vendaPeriodo2: 301000, nfPeriodo1: 6120, nfPeriodo2: 6550 },
    { nome: 'Loja Leste', vendaPeriodo1: 260000, vendaPeriodo2: 272000, nfPeriodo1: 5750, nfPeriodo2: 5960 },
    { nome: 'Loja Oeste', vendaPeriodo1: 230000, vendaPeriodo2: 219000, nfPeriodo1: 5200, nfPeriodo2: 4930 },
    { nome: 'Loja Shopping', vendaPeriodo1: 390000, vendaPeriodo2: 421000, nfPeriodo1: 7880, nfPeriodo2: 8360 },
    { nome: 'Loja Atacado', vendaPeriodo1: 510000, vendaPeriodo2: 548000, nfPeriodo1: 6400, nfPeriodo2: 6810 },
    { nome: 'Loja Filial 8', vendaPeriodo1: 205000, vendaPeriodo2: 214000, nfPeriodo1: 4680, nfPeriodo2: 4890 },
  ]

  const comparativoPorDepartamentoBase: Record<string, DepartamentoComparativo[]> = {
    Todas: [
      { nome: 'Mercearia', vendaPeriodo1: 390000, vendaPeriodo2: 420000, nfPeriodo1: 7600, nfPeriodo2: 8120 },
      { nome: 'Açougue', vendaPeriodo1: 280000, vendaPeriodo2: 301000, nfPeriodo1: 4300, nfPeriodo2: 4560 },
      { nome: 'Hortifruti', vendaPeriodo1: 190000, vendaPeriodo2: 205000, nfPeriodo1: 3950, nfPeriodo2: 4180 },
      { nome: 'Padaria', vendaPeriodo1: 240000, vendaPeriodo2: 258000, nfPeriodo1: 6100, nfPeriodo2: 6450 },
      { nome: 'Bebidas', vendaPeriodo1: 170000, vendaPeriodo2: 189000, nfPeriodo1: 2800, nfPeriodo2: 3010 },
      { nome: 'Limpeza', vendaPeriodo1: 130000, vendaPeriodo2: 136000, nfPeriodo1: 2400, nfPeriodo2: 2490 },
      { nome: 'Perfumaria', vendaPeriodo1: 118000, vendaPeriodo2: 121000, nfPeriodo1: 2050, nfPeriodo2: 2110 },
    ],
    'Loja Centro': [
      { nome: 'Mercearia', vendaPeriodo1: 82000, vendaPeriodo2: 90000, nfPeriodo1: 1620, nfPeriodo2: 1750 },
      { nome: 'Açougue', vendaPeriodo1: 61000, vendaPeriodo2: 65500, nfPeriodo1: 930, nfPeriodo2: 980 },
      { nome: 'Hortifruti', vendaPeriodo1: 39000, vendaPeriodo2: 41000, nfPeriodo1: 820, nfPeriodo2: 860 },
      { nome: 'Padaria', vendaPeriodo1: 54000, vendaPeriodo2: 58500, nfPeriodo1: 1450, nfPeriodo2: 1520 },
      { nome: 'Bebidas', vendaPeriodo1: 47000, vendaPeriodo2: 52000, nfPeriodo1: 720, nfPeriodo2: 790 },
      { nome: 'Limpeza', vendaPeriodo1: 24000, vendaPeriodo2: 25500, nfPeriodo1: 480, nfPeriodo2: 510 },
      { nome: 'Perfumaria', vendaPeriodo1: 21000, vendaPeriodo2: 22500, nfPeriodo1: 390, nfPeriodo2: 420 },
    ],
    'Loja Norte': [
      { nome: 'Mercearia', vendaPeriodo1: 65000, vendaPeriodo2: 62000, nfPeriodo1: 1450, nfPeriodo2: 1370 },
      { nome: 'Açougue', vendaPeriodo1: 49000, vendaPeriodo2: 46000, nfPeriodo1: 800, nfPeriodo2: 740 },
      { nome: 'Hortifruti', vendaPeriodo1: 31000, vendaPeriodo2: 29500, nfPeriodo1: 680, nfPeriodo2: 640 },
      { nome: 'Padaria', vendaPeriodo1: 43000, vendaPeriodo2: 41500, nfPeriodo1: 1210, nfPeriodo2: 1150 },
      { nome: 'Bebidas', vendaPeriodo1: 38000, vendaPeriodo2: 35000, nfPeriodo1: 620, nfPeriodo2: 580 },
      { nome: 'Limpeza', vendaPeriodo1: 22000, vendaPeriodo2: 21000, nfPeriodo1: 430, nfPeriodo2: 400 },
      { nome: 'Perfumaria', vendaPeriodo1: 17000, vendaPeriodo2: 16500, nfPeriodo1: 320, nfPeriodo2: 300 },
    ],
    'Loja Sul': [
      { nome: 'Mercearia', vendaPeriodo1: 58000, vendaPeriodo2: 62500, nfPeriodo1: 1260, nfPeriodo2: 1340 },
      { nome: 'Açougue', vendaPeriodo1: 45000, vendaPeriodo2: 47500, nfPeriodo1: 740, nfPeriodo2: 780 },
      { nome: 'Hortifruti', vendaPeriodo1: 29000, vendaPeriodo2: 32000, nfPeriodo1: 620, nfPeriodo2: 680 },
      { nome: 'Padaria', vendaPeriodo1: 39000, vendaPeriodo2: 42000, nfPeriodo1: 1080, nfPeriodo2: 1160 },
      { nome: 'Bebidas', vendaPeriodo1: 34000, vendaPeriodo2: 36000, nfPeriodo1: 560, nfPeriodo2: 590 },
      { nome: 'Limpeza', vendaPeriodo1: 19500, vendaPeriodo2: 20500, nfPeriodo1: 390, nfPeriodo2: 405 },
      { nome: 'Perfumaria', vendaPeriodo1: 14500, vendaPeriodo2: 16000, nfPeriodo1: 280, nfPeriodo2: 305 },
    ],
    'Loja Leste': [
      { nome: 'Mercearia', vendaPeriodo1: 54000, vendaPeriodo2: 56500, nfPeriodo1: 1180, nfPeriodo2: 1220 },
      { nome: 'Açougue', vendaPeriodo1: 41000, vendaPeriodo2: 42500, nfPeriodo1: 690, nfPeriodo2: 710 },
      { nome: 'Hortifruti', vendaPeriodo1: 28000, vendaPeriodo2: 29500, nfPeriodo1: 600, nfPeriodo2: 620 },
      { nome: 'Padaria', vendaPeriodo1: 37000, vendaPeriodo2: 39000, nfPeriodo1: 1010, nfPeriodo2: 1050 },
      { nome: 'Bebidas', vendaPeriodo1: 31500, vendaPeriodo2: 33000, nfPeriodo1: 530, nfPeriodo2: 545 },
      { nome: 'Limpeza', vendaPeriodo1: 18000, vendaPeriodo2: 18800, nfPeriodo1: 360, nfPeriodo2: 372 },
      { nome: 'Perfumaria', vendaPeriodo1: 13500, vendaPeriodo2: 14700, nfPeriodo1: 260, nfPeriodo2: 280 },
    ],
    'Loja Oeste': [
      { nome: 'Mercearia', vendaPeriodo1: 48000, vendaPeriodo2: 45500, nfPeriodo1: 1110, nfPeriodo2: 1030 },
      { nome: 'Açougue', vendaPeriodo1: 36000, vendaPeriodo2: 34500, nfPeriodo1: 620, nfPeriodo2: 590 },
      { nome: 'Hortifruti', vendaPeriodo1: 25000, vendaPeriodo2: 23500, nfPeriodo1: 560, nfPeriodo2: 520 },
      { nome: 'Padaria', vendaPeriodo1: 33000, vendaPeriodo2: 32000, nfPeriodo1: 950, nfPeriodo2: 900 },
      { nome: 'Bebidas', vendaPeriodo1: 30000, vendaPeriodo2: 28600, nfPeriodo1: 500, nfPeriodo2: 470 },
      { nome: 'Limpeza', vendaPeriodo1: 16500, vendaPeriodo2: 15800, nfPeriodo1: 340, nfPeriodo2: 320 },
      { nome: 'Perfumaria', vendaPeriodo1: 11500, vendaPeriodo2: 11100, nfPeriodo1: 230, nfPeriodo2: 215 },
    ],
    'Loja Shopping': [
      { nome: 'Mercearia', vendaPeriodo1: 76000, vendaPeriodo2: 81000, nfPeriodo1: 1500, nfPeriodo2: 1580 },
      { nome: 'Açougue', vendaPeriodo1: 55000, vendaPeriodo2: 58500, nfPeriodo1: 880, nfPeriodo2: 920 },
      { nome: 'Hortifruti', vendaPeriodo1: 36000, vendaPeriodo2: 38200, nfPeriodo1: 740, nfPeriodo2: 780 },
      { nome: 'Padaria', vendaPeriodo1: 51000, vendaPeriodo2: 54500, nfPeriodo1: 1380, nfPeriodo2: 1450 },
      { nome: 'Bebidas', vendaPeriodo1: 46000, vendaPeriodo2: 49800, nfPeriodo1: 700, nfPeriodo2: 760 },
      { nome: 'Limpeza', vendaPeriodo1: 23000, vendaPeriodo2: 24200, nfPeriodo1: 450, nfPeriodo2: 470 },
      { nome: 'Perfumaria', vendaPeriodo1: 19000, vendaPeriodo2: 20800, nfPeriodo1: 360, nfPeriodo2: 390 },
    ],
    'Loja Atacado': [
      { nome: 'Mercearia', vendaPeriodo1: 98000, vendaPeriodo2: 106000, nfPeriodo1: 1250, nfPeriodo2: 1320 },
      { nome: 'Açougue', vendaPeriodo1: 71000, vendaPeriodo2: 77000, nfPeriodo1: 920, nfPeriodo2: 980 },
      { nome: 'Hortifruti', vendaPeriodo1: 42000, vendaPeriodo2: 44800, nfPeriodo1: 570, nfPeriodo2: 600 },
      { nome: 'Padaria', vendaPeriodo1: 47000, vendaPeriodo2: 49300, nfPeriodo1: 900, nfPeriodo2: 940 },
      { nome: 'Bebidas', vendaPeriodo1: 64000, vendaPeriodo2: 70000, nfPeriodo1: 770, nfPeriodo2: 830 },
      { nome: 'Limpeza', vendaPeriodo1: 30000, vendaPeriodo2: 31500, nfPeriodo1: 410, nfPeriodo2: 430 },
      { nome: 'Perfumaria', vendaPeriodo1: 18000, vendaPeriodo2: 19100, nfPeriodo1: 230, nfPeriodo2: 250 },
    ],
    'Loja Filial 8': [
      { nome: 'Mercearia', vendaPeriodo1: 45000, vendaPeriodo2: 47000, nfPeriodo1: 1230, nfPeriodo2: 1290 },
      { nome: 'Açougue', vendaPeriodo1: 33000, vendaPeriodo2: 35000, nfPeriodo1: 720, nfPeriodo2: 760 },
      { nome: 'Hortifruti', vendaPeriodo1: 20000, vendaPeriodo2: 21500, nfPeriodo1: 520, nfPeriodo2: 560 },
      { nome: 'Padaria', vendaPeriodo1: 26000, vendaPeriodo2: 27800, nfPeriodo1: 850, nfPeriodo2: 900 },
      { nome: 'Bebidas', vendaPeriodo1: 24500, vendaPeriodo2: 25800, nfPeriodo1: 420, nfPeriodo2: 450 },
      { nome: 'Limpeza', vendaPeriodo1: 14500, vendaPeriodo2: 15100, nfPeriodo1: 310, nfPeriodo2: 325 },
      { nome: 'Perfumaria', vendaPeriodo1: 11500, vendaPeriodo2: 12800, nfPeriodo1: 210, nfPeriodo2: 235 },
    ],
  }

  const lojasFiltradas = useMemo(() => {
    if (lojaSelecionada === 'Todas') return comparativoPorLoja
    return comparativoPorLoja.filter((item) => item.nome === lojaSelecionada)
  }, [lojaSelecionada])

  const departamentos = useMemo(() => {
    return comparativoPorDepartamentoBase[lojaSelecionada] || comparativoPorDepartamentoBase.Todas
  }, [lojaSelecionada])

  const graficoLojas = useMemo(() => {
    return lojasFiltradas.map((item) => ({
      nome: item.nome,
      venda1: item.vendaPeriodo1,
      venda2: item.vendaPeriodo2,
      nf1: item.nfPeriodo1,
      nf2: item.nfPeriodo2,
      ticket1: calcTicketMedio(item.vendaPeriodo1, item.nfPeriodo1),
      ticket2: calcTicketMedio(item.vendaPeriodo2, item.nfPeriodo2),
    }))
  }, [lojasFiltradas])

  const graficoDepartamentos = useMemo(() => {
    return departamentos.map((item) => ({
      nome: item.nome,
      valor1: item.vendaPeriodo1,
      valor2: item.vendaPeriodo2,
    }))
  }, [departamentos])

  const maxVenda = Math.max(...graficoLojas.flatMap((item) => [item.venda1, item.venda2]), 1)
  const maxNf = Math.max(...graficoLojas.flatMap((item) => [item.nf1, item.nf2]), 1)
  const maxTicket = Math.max(...graficoLojas.flatMap((item) => [item.ticket1, item.ticket2]), 1)
  const maxDepartamento = Math.max(...graficoDepartamentos.flatMap((item) => [item.valor1, item.valor2]), 1)

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
                {comparativoPorLoja.map((loja) => (
                  <option key={loja.nome} value={loja.nome}>
                    {loja.nome}
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
          <div className="bg-secondary p-3 rounded-2xl flex flex-col min-h-0">
            <h2 className="text-textSecondary text-sm mb-2">Comparativo de Venda</h2>

            <div className="space-y-2 overflow-y-auto pr-1">
              {graficoLojas.map((item) => {
                const pct1 = (item.venda1 / maxVenda) * 100
                const pct2 = (item.venda2 / maxVenda) * 100
                const variacao = calcVariacao(item.venda2, item.venda1)

                return (
                  <div key={item.nome} className="bg-primary/35 rounded-xl p-2.5">
                    <div className="flex justify-between items-center gap-3 mb-2">
                      <span className="text-xs text-textPrimary truncate">{item.nome}</span>
                      <span className={`text-[11px] font-semibold ${variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(variacao)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[10px] text-textSecondary mb-1">
                          <span>P1</span>
                          <span>{formatMoney(item.venda1)}</span>
                        </div>
                        <div className="w-full bg-hover rounded-full h-2">
                          <div className="bg-white/60 h-2 rounded-full" style={{ width: `${pct1}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-textSecondary mb-1">
                          <span>P2</span>
                          <span>{formatMoney(item.venda2)}</span>
                        </div>
                        <div className="w-full bg-hover rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: `${pct2}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl flex flex-col min-h-0">
            <h2 className="text-textSecondary text-sm mb-2">Comparativo de Ticket Médio</h2>

            <div className="space-y-2 overflow-y-auto pr-1">
              {graficoLojas.map((item) => {
                const pct1 = (item.ticket1 / maxTicket) * 100
                const pct2 = (item.ticket2 / maxTicket) * 100
                const variacao = calcVariacao(item.ticket2, item.ticket1)

                return (
                  <div key={item.nome} className="bg-primary/35 rounded-xl p-2.5">
                    <div className="flex justify-between items-center gap-3 mb-2">
                      <span className="text-xs text-textPrimary truncate">{item.nome}</span>
                      <span className={`text-[11px] font-semibold ${variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(variacao)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[10px] text-textSecondary mb-1">
                          <span>P1</span>
                          <span>{formatMoney(item.ticket1)}</span>
                        </div>
                        <div className="w-full bg-hover rounded-full h-2">
                          <div className="bg-white/60 h-2 rounded-full" style={{ width: `${pct1}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-textSecondary mb-1">
                          <span>P2</span>
                          <span>{formatMoney(item.ticket2)}</span>
                        </div>
                        <div className="w-full bg-hover rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: `${pct2}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl flex flex-col min-h-0">
            <h2 className="text-textSecondary text-sm mb-2">Comparativo de Qt. NF</h2>

            <div className="space-y-2 overflow-y-auto pr-1">
              {graficoLojas.map((item) => {
                const pct1 = (item.nf1 / maxNf) * 100
                const pct2 = (item.nf2 / maxNf) * 100
                const variacao = calcVariacao(item.nf2, item.nf1)

                return (
                  <div key={item.nome} className="bg-primary/35 rounded-xl p-2.5">
                    <div className="flex justify-between items-center gap-3 mb-2">
                      <span className="text-xs text-textPrimary truncate">{item.nome}</span>
                      <span className={`text-[11px] font-semibold ${variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(variacao)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[10px] text-textSecondary mb-1">
                          <span>P1</span>
                          <span>{formatNumber(item.nf1)}</span>
                        </div>
                        <div className="w-full bg-hover rounded-full h-2">
                          <div className="bg-white/60 h-2 rounded-full" style={{ width: `${pct1}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-textSecondary mb-1">
                          <span>P2</span>
                          <span>{formatNumber(item.nf2)}</span>
                        </div>
                        <div className="w-full bg-hover rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: `${pct2}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2 gap-3">
              <h2 className="text-textSecondary text-sm">
                Comparativo por Departamento
              </h2>
              <span className="text-[11px] text-textSecondary">
                {lojaSelecionada}
              </span>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex items-end gap-3 h-full min-w-[620px]">
                {graficoDepartamentos.map((dep) => {
                  const altura1 = (dep.valor1 / maxDepartamento) * 150
                  const altura2 = (dep.valor2 / maxDepartamento) * 150
                  const variacao = calcVariacao(dep.valor2, dep.valor1)

                  return (
                    <div
                      key={dep.nome}
                      className="flex flex-col items-center justify-end h-full min-w-[72px]"
                    >
                      <div className={`text-[10px] mb-1 font-semibold ${variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(variacao)}
                      </div>

                      <div className="flex items-end gap-1 h-[170px]">
                        <div className="flex flex-col items-center justify-end">
                          <div className="text-[9px] text-textSecondary mb-1">
                            P1
                          </div>
                          <div
                            className="w-4 rounded-t-md bg-white/60"
                            style={{ height: `${altura1}px` }}
                          />
                        </div>

                        <div className="flex flex-col items-center justify-end">
                          <div className="text-[9px] text-textSecondary mb-1">
                            P2
                          </div>
                          <div
                            className="w-4 rounded-t-md bg-accent"
                            style={{ height: `${altura2}px` }}
                          />
                        </div>
                      </div>

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

export default ComparativoVenda