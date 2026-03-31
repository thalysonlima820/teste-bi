
import { useMemo, useState } from 'react'

type CardProps = {
  title: string
  value: string
}

type Departamento = {
  nome: string
  valor: number
}

type LojaData = Record<string, Departamento[]>

function Card({ title, value }: CardProps) {
  return (
    <div className="bg-secondary p-4 rounded-2xl shadow-lg hover:bg-hover transition min-h-[88px]">
      <p className="text-textSecondary text-xs md:text-sm">{title}</p>
      <h2 className="text-xl md:text-2xl text-textPrimary font-bold mt-1">{value}</h2>
    </div>
  )
}

function Dashboard() {
  const [lojaSelecionada, setLojaSelecionada] = useState<string>('Loja Centro')

  const departamentosPorLoja: LojaData = {
    'Loja Centro': [
      { nome: 'Mercearia', valor: 160 },
      { nome: 'Açougue', valor: 130 },
      { nome: 'Hortifruti', valor: 110 },
      { nome: 'Padaria', valor: 145 },
      { nome: 'Bebidas', valor: 95 },
      { nome: 'Limpeza', valor: 85 },
      { nome: 'Perfumaria', valor: 90 },
    ],
    'Loja Norte': [
      { nome: 'Mercearia', valor: 150 },
      { nome: 'Açougue', valor: 120 },
      { nome: 'Hortifruti', valor: 100 },
      { nome: 'Padaria', valor: 140 },
      { nome: 'Bebidas', valor: 105 },
      { nome: 'Limpeza', valor: 88 },
      { nome: 'Perfumaria', valor: 80 },
    ],
    'Loja Sul': [
      { nome: 'Mercearia', valor: 140 },
      { nome: 'Açougue', valor: 115 },
      { nome: 'Hortifruti', valor: 98 },
      { nome: 'Padaria', valor: 130 },
      { nome: 'Bebidas', valor: 100 },
      { nome: 'Limpeza', valor: 78 },
      { nome: 'Perfumaria', valor: 82 },
    ],
    'Loja Leste': [
      { nome: 'Mercearia', valor: 145 },
      { nome: 'Açougue', valor: 118 },
      { nome: 'Hortifruti', valor: 104 },
      { nome: 'Padaria', valor: 132 },
      { nome: 'Bebidas', valor: 96 },
      { nome: 'Limpeza', valor: 74 },
      { nome: 'Perfumaria', valor: 79 },
    ],
    'Loja Oeste': [
      { nome: 'Mercearia', valor: 135 },
      { nome: 'Açougue', valor: 108 },
      { nome: 'Hortifruti', valor: 92 },
      { nome: 'Padaria', valor: 125 },
      { nome: 'Bebidas', valor: 90 },
      { nome: 'Limpeza', valor: 70 },
      { nome: 'Perfumaria', valor: 75 },
    ],
    'Loja Shopping': [
      { nome: 'Mercearia', valor: 170 },
      { nome: 'Açougue', valor: 126 },
      { nome: 'Hortifruti', valor: 108 },
      { nome: 'Padaria', valor: 150 },
      { nome: 'Bebidas', valor: 115 },
      { nome: 'Limpeza', valor: 84 },
      { nome: 'Perfumaria', valor: 97 },
    ],
    'Loja Atacado': [
      { nome: 'Mercearia', valor: 180 },
      { nome: 'Açougue', valor: 140 },
      { nome: 'Hortifruti', valor: 112 },
      { nome: 'Padaria', valor: 135 },
      { nome: 'Bebidas', valor: 120 },
      { nome: 'Limpeza', valor: 92 },
      { nome: 'Perfumaria', valor: 86 },
    ],
    'Loja Filial 8': [
      { nome: 'Mercearia', valor: 138 },
      { nome: 'Açougue', valor: 111 },
      { nome: 'Hortifruti', valor: 94 },
      { nome: 'Padaria', valor: 120 },
      { nome: 'Bebidas', valor: 88 },
      { nome: 'Limpeza', valor: 72 },
      { nome: 'Perfumaria', valor: 76 },
    ],
  }

  const vendasPorLoja = [
    { loja: 'Loja Centro', valor: 90 },
    { loja: 'Loja Norte', valor: 75 },
    { loja: 'Loja Sul', valor: 65 },
    { loja: 'Loja Leste', valor: 55 },
    { loja: 'Loja Oeste', valor: 45 },
    { loja: 'Loja Shopping', valor: 70 },
    { loja: 'Loja Atacado', valor: 80 },
    { loja: 'Loja Filial 8', valor: 60 },
  ]

  const departamentosGerais: Departamento[] = [
    { nome: 'Mercearia', valor: 160 },
    { nome: 'Açougue', valor: 130 },
    { nome: 'Hortifruti', valor: 110 },
    { nome: 'Padaria', valor: 145 },
    { nome: 'Bebidas', valor: 95 },
    { nome: 'Limpeza', valor: 85 },
    { nome: 'Perfumaria', valor: 90 },
  ]

  const departamentos = useMemo<Departamento[]>(() => {
    return departamentosPorLoja[lojaSelecionada] || []
  }, [lojaSelecionada])

  return (
    <div className="h-screen bg-primary text-textPrimary px-4 py-3 md:px-6 md:py-4 overflow-hidden pl-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-5 tracking-wide">
          VISÃO GERAL
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <Card title="Venda Total" value="R$ 275.847.435" />
          <Card title="Custo" value="R$ 175.847.435" />
          <Card title="Ticket medio" value="7.543" />
          <Card title="Qt. NF" value="18.484" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary p-3 rounded-2xl h-[260px] flex flex-col">
            <h2 className="mb-2 text-textSecondary text-sm">
              Vendas por Loja
            </h2>

            <div className="space-y-2 overflow-y-auto pr-1">
              {vendasPorLoja.map((item) => (
                <div key={item.loja}>
                  <div className="flex justify-between text-xs mb-1 gap-3">
                    <span className="text-textPrimary truncate">{item.loja}</span>
                    <span className="text-textSecondary">{item.valor}%</span>
                  </div>

                  <div className="w-full bg-hover rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${item.valor}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl xl:col-span-2 h-[260px] flex flex-col">
            <h2 className="mb-2 text-textSecondary text-sm">
              Venda por Departamento Geral
            </h2>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex items-end gap-3 h-full min-w-[560px]">
                {departamentosGerais.map((dep) => (
                  <div
                    key={dep.nome}
                    className="flex flex-col items-center justify-end h-full min-w-[58px]"
                  >
                    <div className="text-[10px] text-textSecondary mb-1">
                      {dep.valor}k
                    </div>

                    <div
                      className="w-7 rounded-t-lg bg-accent/90"
                      style={{ height: `${dep.valor * 0.8}px` }}
                    />

                    <div className="text-[10px] text-textSecondary mt-2 text-center leading-tight">
                      {dep.nome}
                    </div>
                  </div>
                ))}
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
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * 78) / 100}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-textPrimary">78%</span>
                  <span className="text-[11px] text-textSecondary mt-1">da meta</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-textSecondary">Meta: R$ 320.000</p>
              <p className="text-sm font-semibold text-textPrimary">Venda: R$ 249.600</p>
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-2xl xl:col-span-2 h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-2 gap-3">
              <h2 className="text-textSecondary text-sm">
                Venda por Departamento - {lojaSelecionada}
              </h2>

              <select
                value={lojaSelecionada}
                onChange={(e) => setLojaSelecionada(e.target.value)}
                className="bg-hover text-textPrimary border border-white/10 rounded-lg px-3 py-1.5 outline-none text-xs w-[150px]"
              >
                {Object.keys(departamentosPorLoja).map((loja) => (
                  <option key={loja} value={loja}>
                    {loja}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex items-end gap-3 h-full min-w-[560px]">
                {departamentos.map((dep) => (
                  <div
                    key={dep.nome}
                    className="flex flex-col items-center justify-end h-full min-w-[58px]"
                  >
                    <div className="text-[10px] text-textSecondary mb-1">
                      {dep.valor}k
                    </div>

                    <div
                      className="w-7 rounded-t-lg bg-accent/90"
                      style={{ height: `${dep.valor * 0.8}px` }}
                    />

                    <div className="text-[10px] text-textSecondary mt-2 text-center leading-tight">
                      {dep.nome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard