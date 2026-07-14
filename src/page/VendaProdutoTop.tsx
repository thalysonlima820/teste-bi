import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Filter,
  PackageSearch,
  Search,
  TrendingUp,
} from "lucide-react";

import { useHttpvenda } from "../hooks/useHttpvenda";

const DIAS_SEMANA = [
  { chave: "SEGUNDA", titulo: "Segunda-feira" },
  { chave: "TERCA", titulo: "Terça-feira" },
  { chave: "QUARTA", titulo: "Quarta-feira" },
  { chave: "QUINTA", titulo: "Quinta-feira" },
  { chave: "SEXTA", titulo: "Sexta-feira" },
  { chave: "SABADO", titulo: "Sábado" },
  { chave: "DOMINGO", titulo: "Domingo" },
];

const normalizarTexto = (texto: string) =>
  String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const identificarDia = (dia: string) => {
  const diaNormalizado = normalizarTexto(dia);

  if (diaNormalizado.startsWith("SEG")) return "SEGUNDA";
  if (diaNormalizado.startsWith("TER")) return "TERCA";
  if (diaNormalizado.startsWith("QUA")) return "QUARTA";
  if (diaNormalizado.startsWith("QUI")) return "QUINTA";
  if (diaNormalizado.startsWith("SEX")) return "SEXTA";
  if (diaNormalizado.startsWith("SAB")) return "SABADO";
  if (diaNormalizado.startsWith("DOM")) return "DOMINGO";

  return diaNormalizado;
};

const formatDateInput = (date: Date) => {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
};

const hoje = new Date();

const primeiroDiaMes = formatDateInput(
  new Date(hoje.getFullYear(), hoje.getMonth(), 1),
);

const dataAtual = formatDateInput(hoje);

const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatNumber = (value: number, casas = 0) =>
  Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

const VendaProdutoTop = () => {
  const { getProdutoVenda, dataProduto, loading } = useHttpvenda();

  const [dataInicio, setDataInicio] = useState(primeiroDiaMes);
  const [dataFim, setDataFim] = useState(dataAtual);

  const [departamentoSelecionado, setDepartamentoSelecionado] =
    useState("Todos");

  const [secaoSelecionada, setSecaoSelecionada] = useState("Todas");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [erro, setErro] = useState("");

  const pesquisar = async () => {
    if (!dataInicio || !dataFim) {
      setErro("Informe a data inicial e a data final.");
      return;
    }

    if (dataInicio > dataFim) {
      setErro("A data inicial não pode ser maior que a data final.");
      return;
    }

    try {
      setErro("");
      await getProdutoVenda(dataInicio, dataFim);
    } catch (error) {
      console.error("Erro ao pesquisar produtos:", error);
      setErro("Não foi possível carregar os produtos.");
    }
  };

  useEffect(() => {
    pesquisar();
    // Executa somente quando a página é aberta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const departamentos = useMemo(() => {
    const mapa = new Map<string, string>();

    dataProduto.forEach((produto) => {
      mapa.set(
        String(produto.CODEPTO),
        `${produto.CODEPTO} - ${produto.DEPARTAMENTO}`,
      );
    });

    return Array.from(mapa.entries())
      .map(([codigo, nome]) => ({
        codigo,
        nome,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [dataProduto]);

  const secoes = useMemo(() => {
    const mapa = new Map<string, string>();

    dataProduto
      .filter((produto) => {
        if (departamentoSelecionado === "Todos") return true;

        return String(produto.CODEPTO) === departamentoSelecionado;
      })
      .forEach((produto) => {
        mapa.set(
          String(produto.CODSEC),
          `${produto.CODSEC} - ${produto.SECAO}`,
        );
      });

    return Array.from(mapa.entries())
      .map(([codigo, nome]) => ({
        codigo,
        nome,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [dataProduto, departamentoSelecionado]);

  const categorias = useMemo(() => {
    const mapa = new Map<string, string>();

    dataProduto
      .filter((produto) => {
        const correspondeDepartamento =
          departamentoSelecionado === "Todos" ||
          String(produto.CODEPTO) === departamentoSelecionado;

        const correspondeSecao =
          secaoSelecionada === "Todas" ||
          String(produto.CODSEC) === secaoSelecionada;

        return correspondeDepartamento && correspondeSecao;
      })
      .forEach((produto) => {
        mapa.set(
          String(produto.CODCATEGORIA),
          `${produto.CODCATEGORIA} - ${produto.CATEGORIA}`,
        );
      });

    return Array.from(mapa.entries())
      .map(([codigo, nome]) => ({
        codigo,
        nome,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [dataProduto, departamentoSelecionado, secaoSelecionada]);

  const produtosFiltrados = useMemo(() => {
    return dataProduto.filter((produto) => {
      const correspondeDepartamento =
        departamentoSelecionado === "Todos" ||
        String(produto.CODEPTO) === departamentoSelecionado;

      const correspondeSecao =
        secaoSelecionada === "Todas" ||
        String(produto.CODSEC) === secaoSelecionada;

      const correspondeCategoria =
        categoriaSelecionada === "Todas" ||
        String(produto.CODCATEGORIA) === categoriaSelecionada;

      return (
        correspondeDepartamento &&
        correspondeSecao &&
        correspondeCategoria
      );
    });
  }, [
    dataProduto,
    departamentoSelecionado,
    secaoSelecionada,
    categoriaSelecionada,
  ]);

  const produtosPorDia = useMemo(() => {
    return DIAS_SEMANA.map((dia) => {
      const produtos = produtosFiltrados
        .filter(
          (produto) => identificarDia(produto.DIA_SEMANA) === dia.chave,
        )
        .sort((a, b) => {
          const posicaoA = Number(a.POSICAO || 999999);
          const posicaoB = Number(b.POSICAO || 999999);

          return posicaoA - posicaoB;
        });

      return {
        ...dia,
        produtos,
      };
    });
  }, [produtosFiltrados]);

  const resumo = useMemo(() => {
    const quantidadeTotal = produtosFiltrados.reduce(
      (total, produto) => total + Number(produto.QT_TOTAL || 0),
      0,
    );

    const valorTotal = produtosFiltrados.reduce(
      (total, produto) => total + Number(produto.VALOR_TOTAL || 0),
      0,
    );

    const produtosUnicos = new Set(
      produtosFiltrados.map((produto) => produto.CODPROD),
    ).size;

    return {
      quantidadeTotal,
      valorTotal,
      produtosUnicos,
      registros: produtosFiltrados.length,
    };
  }, [produtosFiltrados]);

  const limparFiltros = () => {
    setDepartamentoSelecionado("Todos");
    setSecaoSelecionada("Todas");
    setCategoriaSelecionada("Todas");
  };

  return (
    <div className="h-screen bg-primary text-textPrimary overflow-hidden pl-16">
      <div className="h-full px-4 py-4 md:px-6 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-accent/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="text-accent" size={23} />
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-wide">
              VENDA DE PRODUTOS
            </h1>

            <p className="text-sm text-textSecondary">
              Ranking médio de venda por dia da semana
            </p>
          </div>
        </div>

        <div className="bg-secondary rounded-2xl p-4 border border-white/10 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={17} className="text-accent" />

            <h2 className="text-sm font-semibold text-textPrimary">
              Filtros
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-textSecondary">
                Data inicial
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
                />

                <input
                  type="date"
                  value={dataInicio}
                  onChange={(event) => setDataInicio(event.target.value)}
                  className="w-full bg-hover text-textPrimary border border-white/10 rounded-xl py-2 pl-10 pr-3 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-textSecondary">
                Data final
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
                />

                <input
                  type="date"
                  value={dataFim}
                  onChange={(event) => setDataFim(event.target.value)}
                  className="w-full bg-hover text-textPrimary border border-white/10 rounded-xl py-2 pl-10 pr-3 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-textSecondary">
                Departamento
              </label>

              <select
                value={departamentoSelecionado}
                onChange={(event) => {
                  setDepartamentoSelecionado(event.target.value);
                  setSecaoSelecionada("Todas");
                  setCategoriaSelecionada("Todas");
                }}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              >
                <option value="Todos">Todos os departamentos</option>

                {departamentos.map((departamento) => (
                  <option
                    key={departamento.codigo}
                    value={departamento.codigo}
                  >
                    {departamento.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-textSecondary">
                Seção
              </label>

              <select
                value={secaoSelecionada}
                onChange={(event) => {
                  setSecaoSelecionada(event.target.value);
                  setCategoriaSelecionada("Todas");
                }}
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              >
                <option value="Todas">Todas as seções</option>

                {secoes.map((secao) => (
                  <option key={secao.codigo} value={secao.codigo}>
                    {secao.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-textSecondary">
                Categoria
              </label>

              <select
                value={categoriaSelecionada}
                onChange={(event) =>
                  setCategoriaSelecionada(event.target.value)
                }
                className="bg-hover text-textPrimary border border-white/10 rounded-xl px-3 py-2 outline-none text-sm"
              >
                <option value="Todas">Todas as categorias</option>

                {categorias.map((categoria) => (
                  <option
                    key={categoria.codigo}
                    value={categoria.codigo}
                  >
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={pesquisar}
                disabled={loading}
                className="flex-1 bg-accent hover:opacity-90 disabled:opacity-50 text-white rounded-xl px-4 py-2 text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Search size={17} />

                {loading ? "Pesquisando..." : "Pesquisar"}
              </button>

              <button
                type="button"
                onClick={limparFiltros}
                className="bg-hover hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm transition"
                title="Limpar filtros"
              >
                Limpar
              </button>
            </div>
          </div>

          {erro && <p className="text-sm text-red-400 mt-3">{erro}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-secondary rounded-2xl p-3 border border-white/10">
            <p className="text-xs text-textSecondary">Produtos</p>
            <p className="text-xl font-bold mt-1">
              {formatNumber(resumo.produtosUnicos)}
            </p>
          </div>

          <div className="bg-secondary rounded-2xl p-3 border border-white/10">
            <p className="text-xs text-textSecondary">Registros</p>
            <p className="text-xl font-bold mt-1">
              {formatNumber(resumo.registros)}
            </p>
          </div>

          <div className="bg-secondary rounded-2xl p-3 border border-white/10">
            <p className="text-xs text-textSecondary">Quantidade vendida</p>
            <p className="text-xl font-bold mt-1">
              {formatNumber(resumo.quantidadeTotal, 2)}
            </p>
          </div>

          <div className="bg-secondary rounded-2xl p-3 border border-white/10">
            <p className="text-xs text-textSecondary">Valor vendido</p>
            <p className="text-xl font-bold mt-1">
              {formatMoney(resumo.valorTotal)}
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-2">
          <div className="grid grid-cols-7 gap-3 h-full min-w-[1750px]">
            {produtosPorDia.map((dia) => (
              <div
                key={dia.chave}
                className="bg-secondary rounded-2xl border border-white/10 flex flex-col min-h-0 overflow-hidden"
              >
                <div className="px-3 py-3 border-b border-white/10 bg-hover/40">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-sm text-textPrimary">
                      {dia.titulo}
                    </h2>

                    <span className="bg-accent/20 text-accent rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      {dia.produtos.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {dia.produtos.length === 0 && (
                    <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center px-4">
                      <PackageSearch
                        size={32}
                        className="text-textSecondary mb-2"
                      />

                      <p className="text-xs text-textSecondary">
                        Nenhum produto encontrado
                      </p>
                    </div>
                  )}

                  {dia.produtos.map((produto, index) => (
                    <div
                      key={`${dia.chave}-${produto.CODPROD}-${index}`}
                      className="bg-primary/40 hover:bg-hover rounded-xl p-3 border border-white/5 transition"
                    >
                      <div className="flex items-start gap-2">
                        <div className="min-w-7 h-7 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                          {produto.POSICAO || index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs font-semibold text-textPrimary leading-tight line-clamp-2"
                            title={produto.PRODUTO}
                          >
                            {produto.PRODUTO}
                          </p>

                          <p className="text-[10px] text-textSecondary mt-1">
                            Cód. {produto.CODPROD}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-secondary/70 rounded-lg p-2">
                          <p className="text-[9px] text-textSecondary">
                            Média quantidade
                          </p>

                          <p className="text-xs font-semibold mt-0.5">
                            {formatNumber(produto.MEDIA_QT_VENDIDA, 2)}
                          </p>
                        </div>

                        <div className="bg-secondary/70 rounded-lg p-2">
                          <p className="text-[9px] text-textSecondary">
                            Média de venda
                          </p>

                          <p className="text-xs font-semibold mt-0.5">
                            {formatMoney(produto.MEDIA_VALOR_VENDIDO)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between gap-2 mt-2 text-[10px] text-textSecondary">
                        <span>
                          Total: {formatNumber(produto.QT_TOTAL, 2)}
                        </span>

                        <span>{formatMoney(produto.VALOR_TOTAL)}</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/5">
                        <p
                          className="text-[9px] text-textSecondary truncate"
                          title={`${produto.SECAO} / ${produto.CATEGORIA}`}
                        >
                          {produto.SECAO} / {produto.CATEGORIA}
                        </p>

                        <p className="text-[9px] text-textSecondary mt-0.5">
                          Dias considerados: {produto.QUANTIDADE_DIAS}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendaProdutoTop;