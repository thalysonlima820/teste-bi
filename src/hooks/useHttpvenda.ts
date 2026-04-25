import { useState } from "react";
import axios from "axios";
import type { GetVendaMesAtual } from "../interface/GetVendaMesAtual";
import { useAuth } from "../auth/useAuth";

const API = "/.netlify/functions/proxy";
//const APITeste = "http://localhost:3333/adm";

const formatDateOracle = (date: string) => {
  const meses: Record<string, string> = {
    "01": "JAN",
    "02": "FEB",
    "03": "MAR",
    "04": "APR",
    "05": "MAY",
    "06": "JUN",
    "07": "JUL",
    "08": "AUG",
    "09": "SEP",
    "10": "OCT",
    "11": "NOV",
    "12": "DEC",
  };

  const [ano, mes, dia] = date.split("-");

  return `${dia}-${meses[mes]}-${ano}`;
};

const normalizarLista = (payload: any): GetVendaMesAtual[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export function useHttpvenda() {
  const [data, setData] = useState<GetVendaMesAtual[]>([]);
  const [loading, setLoading] = useState(false);

  const { user, logout } = useAuth();

  const getVenda = async () => {
    try {
      setLoading(true);

      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await axios.get(`${API}/bi`, {
        headers: {
          admgestao: token,
        },
      });

      const lista = normalizarLista(response.data);

      setData(lista);
      return lista;
    } catch (err: any) {
      if (err?.response?.status === 401) {
        logout();
        return;
      }

      const message =
        err?.response?.data?.message || err?.message || "Erro ao buscar dados";

      console.log(message);
      setData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVendaData = async (datainicio: string, datafim: string) => {
    try {
      setLoading(true);

      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const dataInicioFormatada = formatDateOracle(datainicio);
      const dataFimFormatada = formatDateOracle(datafim);

      const response = await axios.get(
        `${API}/bi/${dataInicioFormatada}/${dataFimFormatada}`,
        {
          headers: {
            admgestao: token,
          },
        },
      );

      const lista = normalizarLista(response.data);

      setData(lista);
      return lista;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Erro ao buscar dados";

      console.log(message);
      setData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    getVenda,
    getVendaData,
  };
}
