import { describe, it, expect, vi, beforeEach } from "vitest";

const fromMock = vi.fn();
const insertMock = vi.fn();
const selectMock = vi.fn();
const singleMock = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

import { useParceiros, type Parceiro } from "./useParceiros";

const parceiroBase: Parceiro = {
  razao_social: "Empresa Teste",
  nome_fantasia: "Teste",
  cnpj: "12345678000199",
  inscricao_estadual: null,
  telefone: "91999999999",
  email: "teste@teste.com",
  data_inicio_relacionamento: new Date("2026-01-01"),
  limite_credito: 1000,
  ativo: true,
  cep: "66000000",
  logradouro: "Rua Teste",
  numero: "100",
  complemento: null,
  bairro: "Centro",
  uf_id: 1,
  municipio_id: 1,
};

beforeEach(() => {
  fromMock.mockReset();
  insertMock.mockReset();
  selectMock.mockReset();
  singleMock.mockReset();

  fromMock.mockReturnValue({ insert: insertMock });
  insertMock.mockReturnValue({ select: selectMock });
  selectMock.mockReturnValue({ single: singleMock });
});

describe("useParceiros - salvarParceiro", () => {
  it("retorna mensagem amigável quando o CNPJ já existe (erro 23505)", async () => {
    singleMock.mockResolvedValue({
      data: null,
      error: {
        code: "23505",
        message:
          'duplicate key value violates unique constraint "parceiro_cnpj_unique"',
      },
    });

    const { salvarParceiro } = useParceiros();
    const resultado = await salvarParceiro(parceiroBase);

    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe(
      "Este CNPJ já está cadastrado para outro parceiro.",
    );
  });

  it("retorna sucesso e os dados salvos quando o insert funciona sem erro", async () => {
    const parceiroSalvo = { id: "uuid-123", ...parceiroBase };
    singleMock.mockResolvedValue({ data: parceiroSalvo, error: null });

    const { salvarParceiro } = useParceiros();
    const resultado = await salvarParceiro(parceiroBase);

    expect(resultado.success).toBe(true);
    expect(resultado.data).toEqual(parceiroSalvo);
  });
});
