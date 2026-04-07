import { useState } from "react";
import axios from "axios";
import type { GetVendaMesAtual } from "../interface/GetVendaMesAtual";

export function useHttpvenda() {
  const [data, setData] = useState<GetVendaMesAtual[]>([]);
  const [loading, setLoading] = useState(false);

  const getVenda = async () => {
    try {
      setLoading(true);
      const response = await axios.get<GetVendaMesAtual[]>("http://localhost:3333/adm/bi");
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Erro ao buscar dados";
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
  };
}