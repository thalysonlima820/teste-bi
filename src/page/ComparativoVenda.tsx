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

const getVariationClass = (value: number) =>
  value >= 0 ? 'text-green-400' : 'text-red-400'

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

  const resumo = useMemo(() => {
    const base = lojaSelecionada === 'Todas' ? comparativoPorLoja : lojasFiltradas

    const vendaPeriodo1 = base.reduce((acc, item) => acc + item.vendaPeriodo1, 0)
    const vendaPeriodo2 = base.reduce((acc, item) => acc + item.vendaPeriodo2, 0)
    const nfPeriodo1 = base.reduce((acc, item) => acc + item.nfPeriodo1, 0)
    const nfPeriodo2 = base.reduce((acc, item) => acc + item.nfPeriodo2, 0)

    const ticketPeriodo1 = calcTicketMedio(vendaPeriodo1, nfPeriodo1)
    const ticketPeriodo2 = calcTicketMedio(vendaPeriodo2, nfPeriodo2)

    return {
      vendaPeriodo1,
      vendaPeriodo2,
      nfPeriodo1,
      nfPeriodo2,
      ticketPeriodo1,
      ticketPeriodo2,
      diferencaVenda: vendaPeriodo2 - vendaPeriodo1,
      diferencaNf: nfPeriodo2 - nfPeriodo1,
      diferencaTicket: ticketPeriodo2 - ticketPeriodo1,
      variacaoVenda: calcVariacao(vendaPeriodo2, vendaPeriodo1),
      variacaoNf: calcVariacao(nfPeriodo2, nfPeriodo1),
      variacaoTicket: calcVariacao(ticketPeriodo2, ticketPeriodo1),
    }
  }, [lojaSelecionada, lojasFiltradas])

  const maiorVendaDepartamento = Math.max(
    ...departamentos.flatMap((item) => [item.vendaPeriodo1, item.vendaPeriodo2])
  )

  const maiorNfLoja = Math.max(
    ...lojasFiltradas.flatMap((item) => [item.nfPeriodo1, item.nfPeriodo2])
  )

  return (
    <div className="h-screen bg-primary text-textPrimary px-4 py-3 md:px-6 md:py-4 pl-16 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-5">
          <span className="text-xs uppercase tracking-[0.25em] text-textSecondary">
            Análise comparativa
          </span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-wide">
            COMPARATIVO DE VENDA, TICKET MÉDIO E QT. NF
          </h1>
          <p className="text-sm text-textSecondary">
            Visão consolidada dos dois períodos com detalhamento por loja e departamento.
          </p>
        </div>

        <div className="bg-secondary rounded-2xl p-4 md:p-5 border border-white/10 mb-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Loja</label>
              <select
                value={lojaSelecionada}
                onChange={(e) => setLojaSelecionada(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2.5 outline-none text-sm"
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
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2.5 outline-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 1 - fim</label>
              <input
                type="date"
                value={data1Fim}
                onChange={(e) => setData1Fim(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2.5 outline-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 2 - início</label>
              <input
                type="date"
                value={data2Inicio}
                onChange={(e) => setData2Inicio(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2.5 outline-none text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textSecondary">Período 2 - fim</label>
              <input
                type="date"
                value={data2Fim}
                onChange={(e) => setData2Fim(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2.5 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary rounded-2xl p-4 border border-white/10 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-textSecondary text-xs uppercase tracking-wider">Venda</p>
                <h2 className="text-2xl font-bold mt-1">{formatMoney(resumo.vendaPeriodo2)}</h2>
                <p className="text-xs text-textSecondary mt-2">
                  Período 1: {formatMoney(resumo.vendaPeriodo1)}
                </p>
              </div>
              <div className={`text-right ${getVariationClass(resumo.variacaoVenda)}`}>
                <p className="text-lg font-bold">{formatPercent(resumo.variacaoVenda)}</p>
                <p className="text-xs">
                  {resumo.diferencaVenda >= 0 ? '+' : ''}
                  {formatMoney(resumo.diferencaVenda)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-2xl p-4 border border-white/10 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-textSecondary text-xs uppercase tracking-wider">Ticket Médio</p>
                <h2 className="text-2xl font-bold mt-1">{formatMoney(resumo.ticketPeriodo2)}</h2>
                <p className="text-xs text-textSecondary mt-2">
                  Período 1: {formatMoney(resumo.ticketPeriodo1)}
                </p>
              </div>
              <div className={`text-right ${getVariationClass(resumo.variacaoTicket)}`}>
                <p className="text-lg font-bold">{formatPercent(resumo.variacaoTicket)}</p>
                <p className="text-xs">
                  {resumo.diferencaTicket >= 0 ? '+' : ''}
                  {formatMoney(resumo.diferencaTicket)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-2xl p-4 border border-white/10 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-textSecondary text-xs uppercase tracking-wider">Qt. NF</p>
                <h2 className="text-2xl font-bold mt-1">{formatNumber(resumo.nfPeriodo2)}</h2>
                <p className="text-xs text-textSecondary mt-2">
                  Período 1: {formatNumber(resumo.nfPeriodo1)}
                </p>
              </div>
              <div className={`text-right ${getVariationClass(resumo.variacaoNf)}`}>
                <p className="text-lg font-bold">{formatPercent(resumo.variacaoNf)}</p>
                <p className="text-xs">
                  {resumo.diferencaNf >= 0 ? '+' : ''}
                  {formatNumber(resumo.diferencaNf)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          <div className="bg-secondary rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold">Venda por Departamento</h2>
              <span className="text-xs text-textSecondary">
                {lojaSelecionada === 'Todas' ? 'Todas as lojas' : lojaSelecionada}
              </span>
            </div>

            <div className="space-y-4">
              {departamentos.map((item) => {
                const variacaoVenda = calcVariacao(item.vendaPeriodo2, item.vendaPeriodo1)
                const largura1 = (item.vendaPeriodo1 / maiorVendaDepartamento) * 100
                const largura2 = (item.vendaPeriodo2 / maiorVendaDepartamento) * 100

                return (
                  <div key={item.nome} className="bg-primary/40 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-medium text-sm">{item.nome}</span>
                      <span className={`text-xs font-semibold ${getVariationClass(variacaoVenda)}`}>
                        {formatPercent(variacaoVenda)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-textSecondary mb-1">
                          <span>Período 1</span>
                          <span>{formatMoney(item.vendaPeriodo1)}</span>
                        </div>
                        <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-white/50 rounded-full"
                            style={{ width: `${largura1}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-textSecondary mb-1">
                          <span>Período 2</span>
                          <span>{formatMoney(item.vendaPeriodo2)}</span>
                        </div>
                        <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-accent rounded-full"
                            style={{ width: `${largura2}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-hover/60 rounded-lg px-2 py-2">
                          <p className="text-[10px] text-textSecondary">Ticket P2</p>
                          <p className="text-sm font-semibold">
                            {formatMoney(calcTicketMedio(item.vendaPeriodo2, item.nfPeriodo2))}
                          </p>
                        </div>
                        <div className="bg-hover/60 rounded-lg px-2 py-2">
                          <p className="text-[10px] text-textSecondary">NF P2</p>
                          <p className="text-sm font-semibold">{formatNumber(item.nfPeriodo2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-secondary rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold">Qt. NF por Loja</h2>
              <span className="text-xs text-textSecondary">Período 1 x Período 2</span>
            </div>

            <div className="space-y-3">
              {lojasFiltradas.map((item) => {
                const variacaoNf = calcVariacao(item.nfPeriodo2, item.nfPeriodo1)
                const ticket1 = calcTicketMedio(item.vendaPeriodo1, item.nfPeriodo1)
                const ticket2 = calcTicketMedio(item.vendaPeriodo2, item.nfPeriodo2)
                const largura1 = maiorNfLoja ? (item.nfPeriodo1 / maiorNfLoja) * 100 : 0
                const largura2 = maiorNfLoja ? (item.nfPeriodo2 / maiorNfLoja) * 100 : 0

                return (
                  <div key={item.nome} className="bg-primary/40 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-medium text-sm">{item.nome}</span>
                      <div className="text-right">
                        <p className={`text-xs font-semibold ${getVariationClass(variacaoNf)}`}>
                          {formatPercent(variacaoNf)}
                        </p>
                        <p className="text-[11px] text-textSecondary">
                          Ticket: {formatMoney(ticket1)} → {formatMoney(ticket2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-textSecondary mb-1">
                          <span>Período 1</span>
                          <span>{formatNumber(item.nfPeriodo1)} NF</span>
                        </div>
                        <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-white/50 rounded-full"
                            style={{ width: `${largura1}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-textSecondary mb-1">
                          <span>Período 2</span>
                          <span>{formatNumber(item.nfPeriodo2)} NF</span>
                        </div>
                        <div className="w-full h-2 bg-hover rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-accent rounded-full"
                            style={{ width: `${largura2}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Tabela Comparativa Completa</h2>
            <span className="text-xs text-textSecondary">
              Venda, Ticket Médio e Quantidade de NF
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-textSecondary">
                  <th className="text-left py-3 pr-4 font-medium">Departamento</th>
                  <th className="text-right py-3 px-3 font-medium">Venda P1</th>
                  <th className="text-right py-3 px-3 font-medium">Venda P2</th>
                  <th className="text-right py-3 px-3 font-medium">Var. Venda</th>
                  <th className="text-right py-3 px-3 font-medium">NF P1</th>
                  <th className="text-right py-3 px-3 font-medium">NF P2</th>
                  <th className="text-right py-3 px-3 font-medium">Var. NF</th>
                  <th className="text-right py-3 px-3 font-medium">Ticket P1</th>
                  <th className="text-right py-3 px-3 font-medium">Ticket P2</th>
                  <th className="text-right py-3 pl-3 font-medium">Var. Ticket</th>
                </tr>
              </thead>

              <tbody>
                {departamentos.map((item) => {
                  const variacaoVenda = calcVariacao(item.vendaPeriodo2, item.vendaPeriodo1)
                  const variacaoNf = calcVariacao(item.nfPeriodo2, item.nfPeriodo1)
                  const ticket1 = calcTicketMedio(item.vendaPeriodo1, item.nfPeriodo1)
                  const ticket2 = calcTicketMedio(item.vendaPeriodo2, item.nfPeriodo2)
                  const variacaoTicket = calcVariacao(ticket2, ticket1)

                  return (
                    <tr key={item.nome} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-textPrimary">{item.nome}</td>

                      <td className="py-3 px-3 text-right">{formatMoney(item.vendaPeriodo1)}</td>
                      <td className="py-3 px-3 text-right">{formatMoney(item.vendaPeriodo2)}</td>
                      <td className={`py-3 px-3 text-right font-medium ${getVariationClass(variacaoVenda)}`}>
                        {formatPercent(variacaoVenda)}
                      </td>

                      <td className="py-3 px-3 text-right">{formatNumber(item.nfPeriodo1)}</td>
                      <td className="py-3 px-3 text-right">{formatNumber(item.nfPeriodo2)}</td>
                      <td className={`py-3 px-3 text-right font-medium ${getVariationClass(variacaoNf)}`}>
                        {formatPercent(variacaoNf)}
                      </td>

                      <td className="py-3 px-3 text-right">{formatMoney(ticket1)}</td>
                      <td className="py-3 px-3 text-right">{formatMoney(ticket2)}</td>
                      <td className={`py-3 pl-3 text-right font-medium ${getVariationClass(variacaoTicket)}`}>
                        {formatPercent(variacaoTicket)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>

              <tfoot>
                <tr className="border-t border-white/10 font-semibold">
                  <td className="py-4 pr-4">TOTAL</td>
                  <td className="py-4 px-3 text-right">{formatMoney(resumo.vendaPeriodo1)}</td>
                  <td className="py-4 px-3 text-right">{formatMoney(resumo.vendaPeriodo2)}</td>
                  <td className={`py-4 px-3 text-right ${getVariationClass(resumo.variacaoVenda)}`}>
                    {formatPercent(resumo.variacaoVenda)}
                  </td>
                  <td className="py-4 px-3 text-right">{formatNumber(resumo.nfPeriodo1)}</td>
                  <td className="py-4 px-3 text-right">{formatNumber(resumo.nfPeriodo2)}</td>
                  <td className={`py-4 px-3 text-right ${getVariationClass(resumo.variacaoNf)}`}>
                    {formatPercent(resumo.variacaoNf)}
                  </td>
                  <td className="py-4 px-3 text-right">{formatMoney(resumo.ticketPeriodo1)}</td>
                  <td className="py-4 px-3 text-right">{formatMoney(resumo.ticketPeriodo2)}</td>
                  <td className={`py-4 pl-3 text-right ${getVariationClass(resumo.variacaoTicket)}`}>
                    {formatPercent(resumo.variacaoTicket)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparativoVenda