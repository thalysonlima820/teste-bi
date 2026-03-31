import { useMemo, useState } from 'react'

type DepartamentoComparativo = {
  nome: string
  periodo1: number
  periodo2: number
}

type LojaComparativo = {
  nome: string
  periodo1: number
  periodo2: number
}

const formatMoney = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
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

const ComparativoVenda = () => {
  const [lojaSelecionada, setLojaSelecionada] = useState('Todas')
  const [data1Inicio, setData1Inicio] = useState('2026-03-01')
  const [data1Fim, setData1Fim] = useState('2026-03-15')
  const [data2Inicio, setData2Inicio] = useState('2026-03-16')
  const [data2Fim, setData2Fim] = useState('2026-03-31')

  const comparativoPorLoja: LojaComparativo[] = [
    { nome: 'Loja Centro', periodo1: 420000, periodo2: 455000 },
    { nome: 'Loja Norte', periodo1: 315000, periodo2: 298000 },
    { nome: 'Loja Sul', periodo1: 280000, periodo2: 301000 },
    { nome: 'Loja Leste', periodo1: 260000, periodo2: 272000 },
    { nome: 'Loja Oeste', periodo1: 230000, periodo2: 219000 },
    { nome: 'Loja Shopping', periodo1: 390000, periodo2: 421000 },
    { nome: 'Loja Atacado', periodo1: 510000, periodo2: 548000 },
    { nome: 'Loja Filial 8', periodo1: 205000, periodo2: 214000 },
  ]

  const comparativoPorDepartamentoBase: Record<string, DepartamentoComparativo[]> = {
    Todas: [
      { nome: 'Mercearia', periodo1: 390000, periodo2: 420000 },
      { nome: 'Açougue', periodo1: 280000, periodo2: 301000 },
      { nome: 'Hortifruti', periodo1: 190000, periodo2: 205000 },
      { nome: 'Padaria', periodo1: 240000, periodo2: 258000 },
      { nome: 'Bebidas', periodo1: 170000, periodo2: 189000 },
      { nome: 'Limpeza', periodo1: 130000, periodo2: 136000 },
      { nome: 'Perfumaria', periodo1: 118000, periodo2: 121000 },
    ],
    'Loja Centro': [
      { nome: 'Mercearia', periodo1: 82000, periodo2: 90000 },
      { nome: 'Açougue', periodo1: 61000, periodo2: 65500 },
      { nome: 'Hortifruti', periodo1: 39000, periodo2: 41000 },
      { nome: 'Padaria', periodo1: 54000, periodo2: 58500 },
      { nome: 'Bebidas', periodo1: 47000, periodo2: 52000 },
      { nome: 'Limpeza', periodo1: 24000, periodo2: 25500 },
      { nome: 'Perfumaria', periodo1: 21000, periodo2: 22500 },
    ],
    'Loja Norte': [
      { nome: 'Mercearia', periodo1: 65000, periodo2: 62000 },
      { nome: 'Açougue', periodo1: 49000, periodo2: 46000 },
      { nome: 'Hortifruti', periodo1: 31000, periodo2: 29500 },
      { nome: 'Padaria', periodo1: 43000, periodo2: 41500 },
      { nome: 'Bebidas', periodo1: 38000, periodo2: 35000 },
      { nome: 'Limpeza', periodo1: 22000, periodo2: 21000 },
      { nome: 'Perfumaria', periodo1: 17000, periodo2: 16500 },
    ],
    'Loja Sul': [
      { nome: 'Mercearia', periodo1: 58000, periodo2: 62500 },
      { nome: 'Açougue', periodo1: 45000, periodo2: 47500 },
      { nome: 'Hortifruti', periodo1: 29000, periodo2: 32000 },
      { nome: 'Padaria', periodo1: 39000, periodo2: 42000 },
      { nome: 'Bebidas', periodo1: 34000, periodo2: 36000 },
      { nome: 'Limpeza', periodo1: 19500, periodo2: 20500 },
      { nome: 'Perfumaria', periodo1: 14500, periodo2: 16000 },
    ],
    'Loja Leste': [
      { nome: 'Mercearia', periodo1: 54000, periodo2: 56500 },
      { nome: 'Açougue', periodo1: 41000, periodo2: 42500 },
      { nome: 'Hortifruti', periodo1: 28000, periodo2: 29500 },
      { nome: 'Padaria', periodo1: 37000, periodo2: 39000 },
      { nome: 'Bebidas', periodo1: 31500, periodo2: 33000 },
      { nome: 'Limpeza', periodo1: 18000, periodo2: 18800 },
      { nome: 'Perfumaria', periodo1: 13500, periodo2: 14700 },
    ],
    'Loja Oeste': [
      { nome: 'Mercearia', periodo1: 48000, periodo2: 45500 },
      { nome: 'Açougue', periodo1: 36000, periodo2: 34500 },
      { nome: 'Hortifruti', periodo1: 25000, periodo2: 23500 },
      { nome: 'Padaria', periodo1: 33000, periodo2: 32000 },
      { nome: 'Bebidas', periodo1: 30000, periodo2: 28600 },
      { nome: 'Limpeza', periodo1: 16500, periodo2: 15800 },
      { nome: 'Perfumaria', periodo1: 11500, periodo2: 11100 },
    ],
    'Loja Shopping': [
      { nome: 'Mercearia', periodo1: 76000, periodo2: 81000 },
      { nome: 'Açougue', periodo1: 55000, periodo2: 58500 },
      { nome: 'Hortifruti', periodo1: 36000, periodo2: 38200 },
      { nome: 'Padaria', periodo1: 51000, periodo2: 54500 },
      { nome: 'Bebidas', periodo1: 46000, periodo2: 49800 },
      { nome: 'Limpeza', periodo1: 23000, periodo2: 24200 },
      { nome: 'Perfumaria', periodo1: 19000, periodo2: 20800 },
    ],
    'Loja Atacado': [
      { nome: 'Mercearia', periodo1: 98000, periodo2: 106000 },
      { nome: 'Açougue', periodo1: 71000, periodo2: 77000 },
      { nome: 'Hortifruti', periodo1: 42000, periodo2: 44800 },
      { nome: 'Padaria', periodo1: 47000, periodo2: 49300 },
      { nome: 'Bebidas', periodo1: 64000, periodo2: 70000 },
      { nome: 'Limpeza', periodo1: 30000, periodo2: 31500 },
      { nome: 'Perfumaria', periodo1: 18000, periodo2: 19100 },
    ],
    'Loja Filial 8': [
      { nome: 'Mercearia', periodo1: 45000, periodo2: 47000 },
      { nome: 'Açougue', periodo1: 33000, periodo2: 35000 },
      { nome: 'Hortifruti', periodo1: 20000, periodo2: 21500 },
      { nome: 'Padaria', periodo1: 26000, periodo2: 27800 },
      { nome: 'Bebidas', periodo1: 24500, periodo2: 25800 },
      { nome: 'Limpeza', periodo1: 14500, periodo2: 15100 },
      { nome: 'Perfumaria', periodo1: 11500, periodo2: 12800 },
    ],
  }

  const departamentos = useMemo(() => {
    return comparativoPorDepartamentoBase[lojaSelecionada] || comparativoPorDepartamentoBase.Todas
  }, [lojaSelecionada])

  const lojasFiltradas = useMemo(() => {
    if (lojaSelecionada === 'Todas') return comparativoPorLoja
    return comparativoPorLoja.filter((item) => item.nome === lojaSelecionada)
  }, [lojaSelecionada])

  const resumo = useMemo(() => {
    const base = lojaSelecionada === 'Todas' ? comparativoPorLoja : lojasFiltradas

    const totalPeriodo1 = base.reduce((acc, item) => acc + item.periodo1, 0)
    const totalPeriodo2 = base.reduce((acc, item) => acc + item.periodo2, 0)
    const diferenca = totalPeriodo2 - totalPeriodo1
    const variacao = calcVariacao(totalPeriodo2, totalPeriodo1)

    return {
      totalPeriodo1,
      totalPeriodo2,
      diferenca,
      variacao,
    }
  }, [lojaSelecionada, lojasFiltradas])

  const maiorValorDepartamento = Math.max(
    ...departamentos.flatMap((item) => [item.periodo1, item.periodo2])
  )

  return (
    <div className="h-screen bg-primary text-textPrimary px-4 py-3 md:px-6 md:py-4 pl-16 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-5 tracking-wide">
          COMPARATIVO DE VENDA
        </h1>

        <div className="bg-secondary rounded-2xl p-4 md:p-5 border border-white/10 mb-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <div className="bg-secondary p-4 rounded-2xl shadow-lg">
            <p className="text-textSecondary text-xs md:text-sm">Venda Período 1</p>
            <h2 className="text-xl md:text-2xl text-textPrimary font-bold mt-1">
              {formatMoney(resumo.totalPeriodo1)}
            </h2>
            <p className="text-xs text-textSecondary mt-2">
              {data1Inicio} até {data1Fim}
            </p>
          </div>

          <div className="bg-secondary p-4 rounded-2xl shadow-lg">
            <p className="text-textSecondary text-xs md:text-sm">Venda Período 2</p>
            <h2 className="text-xl md:text-2xl text-textPrimary font-bold mt-1">
              {formatMoney(resumo.totalPeriodo2)}
            </h2>
            <p className="text-xs text-textSecondary mt-2">
              {data2Inicio} até {data2Fim}
            </p>
          </div>

          <div className="bg-secondary p-4 rounded-2xl shadow-lg">
            <p className="text-textSecondary text-xs md:text-sm">Diferença</p>
            <h2
              className={`text-xl md:text-2xl font-bold mt-1 ${
                resumo.diferenca >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {resumo.diferenca >= 0 ? '+' : ''}
              {formatMoney(resumo.diferenca)}
            </h2>
            <p className="text-xs text-textSecondary mt-2">
              Resultado entre os períodos
            </p>
          </div>

          <div className="bg-secondary p-4 rounded-2xl shadow-lg">
            <p className="text-textSecondary text-xs md:text-sm">Variação %</p>
            <h2
              className={`text-xl md:text-2xl font-bold mt-1 ${
                resumo.variacao >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercent(resumo.variacao)}
            </h2>
            <p className="text-xs text-textSecondary mt-2">
              Crescimento ou queda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          <div className="bg-secondary rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold">Comparativo por Departamento</h2>
              <span className="text-xs text-textSecondary">
                {lojaSelecionada === 'Todas' ? 'Todas as lojas' : lojaSelecionada}
              </span>
            </div>

            <div className="space-y-4">
              {departamentos.map((item) => {
                const variacao = calcVariacao(item.periodo2, item.periodo1)
                const largura1 = (item.periodo1 / maiorValorDepartamento) * 100
                const largura2 = (item.periodo2 / maiorValorDepartamento) * 100

                return (
                  <div key={item.nome} className="bg-primary/40 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-medium text-sm">{item.nome}</span>
                      <span
                        className={`text-xs font-semibold ${
                          variacao >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {formatPercent(variacao)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-textSecondary mb-1">
                          <span>Período 1</span>
                          <span>{formatMoney(item.periodo1)}</span>
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
                          <span>{formatMoney(item.periodo2)}</span>
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

          <div className="bg-secondary rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold">Comparativo por Loja</h2>
              <span className="text-xs text-textSecondary">
                Período 1 x Período 2
              </span>
            </div>

            <div className="space-y-3">
              {lojasFiltradas.map((item) => {
                const variacao = calcVariacao(item.periodo2, item.periodo1)
                const diferenca = item.periodo2 - item.periodo1
                const max = Math.max(item.periodo1, item.periodo2)
                const largura1 = (item.periodo1 / max) * 100
                const largura2 = (item.periodo2 / max) * 100

                return (
                  <div key={item.nome} className="bg-primary/40 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-medium text-sm">{item.nome}</span>
                      <div className="text-right">
                        <p
                          className={`text-xs font-semibold ${
                            variacao >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {formatPercent(variacao)}
                        </p>
                        <p className="text-[11px] text-textSecondary">
                          {diferenca >= 0 ? '+' : ''}
                          {formatMoney(diferenca)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-textSecondary mb-1">
                          <span>Período 1</span>
                          <span>{formatMoney(item.periodo1)}</span>
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
                          <span>{formatMoney(item.periodo2)}</span>
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
          <h2 className="text-lg font-semibold mb-4">Tabela Resumida por Departamento</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-textSecondary">
                  <th className="text-left py-3 pr-4 font-medium">Departamento</th>
                  <th className="text-right py-3 px-4 font-medium">Período 1</th>
                  <th className="text-right py-3 px-4 font-medium">Período 2</th>
                  <th className="text-right py-3 px-4 font-medium">Diferença</th>
                  <th className="text-right py-3 pl-4 font-medium">Variação</th>
                </tr>
              </thead>
              <tbody>
                {departamentos.map((item) => {
                  const diferenca = item.periodo2 - item.periodo1
                  const variacao = calcVariacao(item.periodo2, item.periodo1)

                  return (
                    <tr key={item.nome} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-textPrimary">{item.nome}</td>
                      <td className="py-3 px-4 text-right text-textPrimary">
                        {formatMoney(item.periodo1)}
                      </td>
                      <td className="py-3 px-4 text-right text-textPrimary">
                        {formatMoney(item.periodo2)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-medium ${
                          diferenca >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {diferenca >= 0 ? '+' : ''}
                        {formatMoney(diferenca)}
                      </td>
                      <td
                        className={`py-3 pl-4 text-right font-medium ${
                          variacao >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {formatPercent(variacao)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparativoVenda