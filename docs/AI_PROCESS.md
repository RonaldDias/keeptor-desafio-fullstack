# Processo de Desenvolvimento Assistido por IA

**Autor:** Ronald Dias
**Data:** 2026-09-14

## Ferramentas utilizadas

Uso o Antigravity como ambiente de desenvolvimento assistido por IA, com dois modelos em papéis diferentes: Claude Opus para planejamento, ou seja: leitura de requisitos, decisões de arquitetura e modelagem, revisão de abordagem antes de codar e Gemini Pro para execução do código propriamente dito. Essa divisão é a forma como trabalho no dia a dia, não algo montado só pra este desafio.

## MCPs

Não usei nenhum MCP neste desafio. Resolvi todo o fluxo de planejamento e execução diretamente no Antigravity, sem integração externa via protocolo.

## Skills, agentes, rules ou comandos

Não configurei skill, agente ou comando específico para este desafio, usei o fluxo padrão de planejamento com Claude Opus seguido de execução com Gemini Pro, sem automações adicionais.

## Contexto fornecido à IA

O único contexto de entrada foi o README do desafio técnico da Keeptor, fornecido na íntegra para a etapa de planejamento antes de qualquer código ser gerado.

## Como o desenvolvimento andou

Comecei pelo ambiente. O docker-compose que veio no projeto deu erro no healthcheck do serviço rest, então criei um arquivo de override (docker-compose.override.yml) desabilitando o healthcheck pra conseguir subir sem travar.

Depois criei a migration 0003_parceiros.sql com a tabela de parceiro, já com as constraints de negócio pensadas (CNPJ único, limite de crédito não-negativo, FKs obrigatórias pra UF e município, coerente com o endereço completo ser requisito do cadastro) e índices nos campos mais consultados. Rodei o npm run smoke em seguida pra confirmar que o ambiente estava íntegro antes de ir pro frontend.

No frontend, comecei pela pasta design-system/, criando os wrappers (KButton, KDatePicker, KInput, KInputMoney, KSelect, KSwitch) com um index.ts centralizando a exportação, garantindo que nenhuma tela importe primevue/\* diretamente. Depois criei composables/useParceiros.ts concentrando toda a lógica de dados (carregar UFs, carregar municípios por UF, listar e salvar parceiro), incluindo tratamento específico do erro de CNPJ duplicado (código 23505) com mensagem amigável.

Por último montei a ParceirosPage.vue consumindo os componentes do design system e o composable. Nessa etapa, o Gemini gerou um template inicial com uma cor de texto errada nas informações da listagem, o conteúdo ficava praticamente invisível na tela por falta de contraste. Precisei corrigir manualmente, padronizando as classes de cor pra garantir que as informações da tabela ficassem legíveis, o que também reforça a consistência visual pedida no requisito de padronização.
