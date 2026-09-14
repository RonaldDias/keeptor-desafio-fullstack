<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import {
  KInput,
  KInputMoney,
  KDatePicker,
  KSelect,
  KSwitch,
  KButton,
} from "../design-system";
import { useParceiros, type Parceiro } from "../composables/useParceiros";

const {
  parceiros,
  ufs,
  municipios,
  loading,
  loadingMunicipios,
  carregarUFs,
  carregarMunicipios,
  listarParceiros,
  salvarParceiro,
} = useParceiros();

const exibindoForm = ref(false);
const salvando = ref(false);
const erroApi = ref("");

const formInicial = (): Parceiro => ({
  razao_social: "",
  nome_fantasia: "",
  cnpj: "",
  inscricao_estadual: "",
  telefone: "",
  email: "",
  data_inicio_relacionamento: new Date(),
  limite_credito: 0,
  ativo: true,
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  uf_id: null,
  municipio_id: null,
});

const form = reactive<Parceiro>(formInicial());

onMounted(() => {
  carregarUFs();
  listarParceiros();
});

watch(
  () => form.uf_id,
  (novoUf) => {
    if (novoUf) carregarMunicipios(Number(novoUf));
    else municipios.value = [];
  },
);

const abrirNovo = () => {
  Object.assign(form, formInicial());
  erroApi.value = "";
  exibindoForm.value = true;
};

const editar = (p: Parceiro) => {
  Object.assign(form, p);
  erroApi.value = "";
  if (p.uf_id) carregarMunicipios(p.uf_id);
  exibindoForm.value = true;
};

const salvar = async () => {
  salvando.value = true;
  erroApi.value = "";

  const res = await salvarParceiro(form);
  salvando.value = false;

  if (res.success) {
    await listarParceiros();
    exibindoForm.value = false;
  } else {
    erroApi.value = res.error || "Erro ao salvar parceiro.";
  }
};

const formatarCNPJ = (cnpj: string | null) => {
  if (!cnpj) return "-";
  const limpo = cnpj.replace(/\D/g, "");

  if (limpo.length !== 14) return cnpj;
  return limpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
};

const formatarMoeda = (val: number | null | undefined) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(val) || 0);
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex items-center justify-between pb-4 border-b border-slate-200"
    >
      <h1 class="text-2xl font-bold text-slate-800">Parceiros</h1>
      <KButton
        :label="exibindoForm ? 'Voltar para a Lista' : 'Novo Parceiro'"
        :variant="exibindoForm ? 'secondary' : 'primary'"
        @click="exibindoForm ? (exibindoForm = false) : abrirNovo()"
      />
    </div>
    <div
      v-if="erroApi"
      class="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200"
    >
      {{ erroApi }}
    </div>
    <form
      v-if="exibindoForm"
      @submit.prevent="salvar"
      class="bg-white p-6 rounded-xl border border-slate-200 space-y-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KInput v-model="form.razao_social" label="Razão Social" required />
        <KInput v-model="form.nome_fantasia" label="Nome Fantasia" required />
        <KInput
          v-model="form.cnpj"
          label="CNPJ"
          mask="cnpj"
          hint="Opcional para parceiros estrangeiros"
        />
        <KInput v-model="form.inscricao_estadual" label="Inscrição Estadual" />
        <KInput
          v-model="form.telefone"
          label="Telefone"
          mask="phone"
          required
        />
        <KInput v-model="form.email" label="E-mail" type="email" required />
        <KDatePicker
          v-model="form.data_inicio_relacionamento"
          label="Início do Relacionamento"
          required
        />
        <KInputMoney
          v-model="form.limite_credito"
          label="Limite de Crédito"
          required
        />
      </div>
      <div
        class="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <KInput v-model="form.cep" label="CEP" mask="cep" required />
        <KSelect
          v-model="form.uf_id"
          label="UF"
          :options="ufs"
          option-label="nome"
          option-value="id"
          required
        />
        <KSelect
          v-model="form.municipio_id"
          label="Município"
          :options="municipios"
          option-label="nome"
          option-value="id"
          :disabled="!form.uf_id"
          :loading="loadingMunicipios"
          required
        />
        <div class="md:col-span-2">
          <KInput v-model="form.logradouro" label="Logradouro" required />
        </div>
        <KInput v-model="form.numero" label="Número" required />
        <KInput v-model="form.bairro" label="Bairro" required />
        <div class="md:col-span-2">
          <KInput v-model="form.complemento" label="Complemento" />
        </div>
      </div>
      <KSwitch v-model="form.ativo" label="Parceiro Ativo" />
      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <KButton
          type="button"
          label="Cancelar"
          variant="secondary"
          @click="exibindoForm = false"
        />
        <KButton
          type="submit"
          :label="form.id ? 'Salvar Alterações' : 'Cadastrar'"
          :loading="salvando"
        />
      </div>
    </form>
    <div
      v-else
      class="bg-white rounded-xl border border-slate-200 overflow-hidden"
    >
      <div v-if="loading" class="p-8 text-center text-slate-500">
        Carregando parceiros...
      </div>

      <div
        v-else-if="parceiros.length === 0"
        class="p-8 text-center text-slate-500"
      >
        Nenhum parceiro cadastrado. Clique em "Novo Parceiro" para começar.
      </div>
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full text-left text-sm">
          <thead
            class="bg-slate-100 text-slate-700 text-xs font-semibold uppercase border-b border-slate-200"
          >
            <tr>
              <th class="p-3">Parceiro</th>
              <th class="p-3">CNPJ</th>
              <th class="p-3">Contato</th>
              <th class="p-3">Cidade / UF</th>
              <th class="p-3">Limite</th>
              <th class="p-3 text-center">Status</th>
              <th class="p-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-800">
            <tr
              v-for="p in parceiros"
              :key="p.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="p-3">
                <div class="font-semibold text-slate-900">
                  {{ p.nome_fantasia }}
                </div>
                <div class="text-xs text-slate-500">{{ p.razao_social }}</div>
              </td>
              <td class="p-3 font-mono text-xs text-slate-500">
                {{ formatarCNPJ(p.cnpj) }}
              </td>
              <td class="p-3 text-xs text-slate-700">
                <div class="font-medium text-slate-900">{{ p.telefone }}</div>
                <div class="text-slate-500">{{ p.email }}</div>
              </td>
              <td class="p-3 text-slate-500 font-medium">
                {{ p.municipio?.nome || "-" }}
                <span v-if="p.uf?.sigla" class="text-slate-500"
                  >/ {{ p.uf.sigla }}</span
                >
              </td>
              <td class="p-3 font-semibold text-slate-500">
                {{ formatarMoeda(p.limite_credito) }}
              </td>
              <td class="p-3 text-center">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold',
                    p.ativo
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700',
                  ]"
                >
                  {{ p.ativo ? "Ativo" : "Inativo" }}
                </span>
              </td>
              <td class="p-3 text-right">
                <KButton
                  label="Editar"
                  variant="outlined"
                  size="small"
                  @click="editar(p)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
