# PRD - Módulo de Gestão de Parceiros

**Autor:** Ronald Dias
**Data:** 2026-09-14

## 1. Objetivo

Permitir o gerenciamento completo (cadastro, listagem e edição) de parceiros comerciais (clientes, fornecedores e representantes) da Keeptor, garantindo integridade de dados e consistencia visual.

## 2. Requisitos Funcionais (RF)

- **RF01 - Cadastro de Parceiro**: Registrar parceiro contendo razão social, nome fantasia, CNPJ (opcional para estrangeiros), inscrição estadual (opcional), telefone, e-mail, data de inicio, limite de crédito, status ativo/inativo e endereço completo.
- **RF02 - Edição**: Permitir atualização de dados cadastrais e alternância de status ativo/inativo no mesmo registro.
- **RF03 - Listagem**: Exibição tabular responsiva com formatação monetária (BRL), máscara de CNPJ e dados de localização (Cidade/UF), com tratamento consistente de estados de carregamento, erro e lista vazia.
- **RF04 - Seleção Dependente de Localidade**: O dropdown de Município é filtrado reativamente a partir da UF selecionada.
- **RF05 - Máscaras e Formatação**: Formatação automática para CNPJ, Telefone, CEP e Moeda.
- **RF06 - Escopo da Listagem**: A listagem não contempla filtros nem paginação no servidor, por decisão de foco no formulário e na modelagem de dados, confrme orientação do desafio.

## 3. Requisitos Não Funcionais (RNF)

- **RNF01 - Isolamento do PrimeVue**: Zero importações diretas de `primevue/*` nas telas. 100% de uso através dos wrappers em `src/design-system/`.
- **RNF02 - Integridade no Banco**: Regras de negócio enforced no PostgreSQL (constraint UNIQUE em CNPJ, CHECK de limite não-negativo e FKs para UF e Município).
- **RNF03 - Tratamento de Concorrência**: Interceptação de erro de chave duplicada (código 23505) do PostgreSQL para responder amigavelmente a race conditions.
- **RNF04 - Acessibilidade e Responsividade**: Suporte a navegação mobile e desktop com rótulos acessíveis e atributos ARIA.

## 4. Decisões e Premissas

- **Endereço**: Modelado como único por parceiro, embutido na p´ropria tabela de parceiro (não normalizado em tabela separada), por não haver indicação no enunciado de necessidade de múltiplos endereços.
- **Bairro**: Tratado como texto livre, não como tabela com FK. Os dados do IBGE vieram apenas para UF e Município, sem bairros populados, o que foi interpretado como indicação de que bairro não deveria virar entidade própria.
- **Limite de crédito em branco**: tratado como equivalente a zero (DEFAULT 0 na coluna), não como valor nulo distinto.
- **Reativação de parceiro**: feita por alternância do campo 'ativo', sem criar novo registro - mantém histórico único por parceiro.
