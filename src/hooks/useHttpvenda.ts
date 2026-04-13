import { useState } from "react";
import axios from "axios";
import type { GetVendaMesAtual } from "../interface/GetVendaMesAtual";
const API = import.meta.env.VITE_API;

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

export function useHttpvenda() {
  const [data, setData] = useState<GetVendaMesAtual[]>([]);
  const [loading, setLoading] = useState(false);

  const getVenda = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/bi`);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Erro ao buscar dados";
      console.log(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVendaData = async (datainicio: string, datafim: string) => {
    try {
      setLoading(true);

      const dataInicioFormatada = formatDateOracle(datainicio);
      const dataFimFormatada = formatDateOracle(datafim);

      const response = await axios.get<GetVendaMesAtual[]>(
        `${API}/bi/${dataInicioFormatada}/${dataFimFormatada}`,);

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Erro ao buscar dados";

      console.log(message);
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
