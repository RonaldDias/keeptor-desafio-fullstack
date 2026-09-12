# ADR - Decisões de Arquitetura e Modelagem

## Modelagem (PostgreSQL)

| Decisão           | Escolha                                      | Motivo                                                                                                                                      |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Endereço          | Colunas na própria tabela `parceiro`         | Um endereço por parceiro; tabela separada 1:N não se justifica sem requisito de múltiplos endereços                                         |
| CNPJ              | `VARCHAR(14) NULL UNIQUE`                    | `UNIQUE` ignora `NULL` no Postgres -> permite parceiros estrangeiros sem CNPJ . Race condition resolvida pela constraint, não pelo frontend |
| Bairro            | Texto livre `VARCHAR(100)`                   | Sem tabela IBGE de bairros fornecida (pista, não esquecimento)                                                                              |
| Reativação        | Toggle no campo `ativo BOOLEAN DEFAULT true` | Preserva histórico e CNPJ; registro novo fragmentaria dados                                                                                 |
| Limite de crédito | `NUMERIC(12,2) NOT NULL DEFAULT 0.00`        | Zero = sem crédito; `NULL` gera ambiguidade em cálculos (`NULL + valor = NULL`)                                                             |

## Design System

**"Se trocássemos o PrimeVue, quantos arquivos mudariam?"**
Apenas os arquivos dentro de `src/design-system/`.

### Contrato comum de todos os componentes

| Prop         | Tipo      | Descrição                               |
| ------------ | --------- | --------------------------------------- |
| `modelValue` | varies    | Suporte a `v-model`                     |
| `label`      | `string`  | Rótulo acessível                        |
| `error`      | `string`  | Mensagem de erro; aciona `aria-invalid` |
| `disabled`   | `boolean` | Desabilita interação                    |
| `required`   | `boolean` | Indicador `*` e atributo `required`     |
| `id`         | `string`  | Associação `<label>` <-> campo          |

### Componentes

| Componente     | PrimeVue por trás     | Uso                                                            |
| -------------- | --------------------- | -------------------------------------------------------------- |
| `KInput`       | InputText / InputMask | Texto simples + máscaras (CNPJ, telefone, CEP) via prop `mask` |
| `KIinputMoney` | InputNumber           | Limite de crédito (R$)                                         |
| `KDatePicker`  | DatePicker            | Data de início do relacionamento                               |
| `KSelect`      | Select                | UF e Município (dependência reativa)                           |
| `KSwitch`      | ToggleSwitch          | Ativo/Inativo                                                  |
| `KButton`      | Button                | Salvar, Cancelar                                               |

`KInput` com prop `mask` em vez de componentes separados por tipo de máscara: a lógica de label/erro/acessibilidade é a mesma, só muda o padrão.
