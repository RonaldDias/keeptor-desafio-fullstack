import { ref } from "vue";
import { supabase } from "@/lib/supabase";

export interface UF {
  id: number;
  sigla: string;
  nome: string;
}

export interface Municipio {
  id: number;
  nome: string;
  uf_id: number;
}

export interface Parceiro {
  id?: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string | null;
  inscricao_estadual: string | null;
  telefone: string;
  email: string;
  data_inicio_relacionamento: string | Date;
  limite_credito: number;
  ativo: boolean;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  uf_id: number | null;
  municipio_id: number | null;
  createdAt?: string;
  updatedAt?: string;
  uf?: { sigla: string };
  municipio?: { nome: string };
}

export function useParceiros() {
  const parceiros = ref<Parceiro[]>([]);
  const ufs = ref<UF[]>([]);
  const municipios = ref<Municipio[]>([]);

  const loading = ref(false);
  const loadingMunicipios = ref(false);
  const error = ref<string | null>(null);

  const carregarUFs = async () => {
    try {
      const { data, error: err } = await supabase
        .from("uf")
        .select("id, sigla, nome")
        .order("nome");
      if (err) throw err;
      ufs.value = data || [];
    } catch (err: unknown) {
      console.error("Erro ao carregar UFs:", err);
    }
  };

  const carregarMunicipios = async (ufId: number) => {
    if (!ufId) {
      municipios.value = [];
      return;
    }
    loadingMunicipios.value = true;
    try {
      const { data, error: err } = await supabase
        .from("municipio")
        .select("id, nome, uf_id")
        .eq("uf_id", ufId)
        .order("nome");
      if (err) throw err;
      municipios.value = data || [];
    } catch (err: unknown) {
      console.error("Erro ao carregar municípios:", err);
      municipios.value = [];
    } finally {
      loadingMunicipios.value = false;
    }
  };

  const listarParceiros = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("parceiro")
        .select(
          `
          *,
          uf:uf (sigla),
          municipio:municipio (nome)
          `,
        )
        .order("created_at", { ascending: false });
      if (err) throw err;
      parceiros.value = data || [];
    } catch (err: unknown) {
      const e = err as { message?: string };
      error.value = e.message || "Erro ao carregar parceiros";
    } finally {
      loading.value = false;
    }
  };

  const salvarParceiro = async (payload: Parceiro) => {
    loading.value = true;
    error.value = null;

    const { id, uf, municipio, ...resto } = payload;
    void uf;
    void municipio;

    const dadosParaSalvar = {
      ...resto,
      cnpj: resto.cnpj ? resto.cnpj.replace(/\D/g, "") || null : null,
      telefone: resto.telefone ? resto.telefone.replace(/\D/g, "") : "",
      cep: resto.cep ? resto.cep.replace(/\D/g, "") : "",
      limite_credito: Number(resto.limite_credito) || 0,
      data_inicio_relacionamento:
        resto.data_inicio_relacionamento instanceof Date
          ? resto.data_inicio_relacionamento.toISOString().split("T")[0]
          : resto.data_inicio_relacionamento,
      updated_at: new Date().toISOString(),
    };

    try {
      if (id) {
        const { data, error: err } = await supabase
          .from("parceiro")
          .update(dadosParaSalvar)
          .eq("id", id)
          .select()
          .single();
        if (err) throw err;
        return { success: true, data };
      } else {
        const { data, error: err } = await supabase
          .from("parceiro")
          .insert(dadosParaSalvar)
          .select()
          .single();
        if (err) throw err;
        return { success: true, data };
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (
        e.code === "23505" ||
        e.message?.includes("duplicate key") ||
        e.message?.includes("parceiro_cnpj_unique")
      ) {
        return {
          success: false,
          error: "Este CNPJ já está cadastrado para outro parceiro.",
        };
      }
      return {
        success: false,
        error: e.message || "Erro ao salvar parceiro.",
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    parceiros,
    ufs,
    municipios,
    loading,
    loadingMunicipios,
    error,
    carregarUFs,
    carregarMunicipios,
    listarParceiros,
    salvarParceiro,
  };
}
