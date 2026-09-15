import type { Meta, StoryObj } from "@storybook/vue3";
import KSelect from "./KSelect.vue";

const ufsExemplo = [
  { id: 1, sigla: "BA", nome: "Bahia" },
  { id: 2, sigla: "PA", nome: "Pará" },
  { id: 3, sigla: "RJ", nome: "Rio de Janeiro" },
];

const meta: Meta<typeof KSelect> = {
  title: "Design System/KSelect",
  component: KSelect,
  args: {
    label: "UF",
    options: ufsExemplo,
    optionLabel: "nome",
    optionValue: "id",
    placeholder: "Selecione uma UF",
  },
};

export default meta;
type Story = StoryObj<typeof KSelect>;

export const Default: Story = {};

export const ComErro: Story = {
  args: {
    error: "Selecione a UF.",
  },
};

export const Desabilitado: Story = {
  args: {
    disabled: true,
  },
};

export const Carregando: Story = {
  args: {
    loading: true,
  },
};
