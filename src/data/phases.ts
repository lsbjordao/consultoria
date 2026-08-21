export type PhaseVisual =
  | 'discovery'
  | 'diagnosis'
  | 'inception'
  | 'requirements'
  | 'backlog'
  | 'architecture'
  | 'approval'
  | 'delivery';

export interface Phase {
  id: string;
  number: string;
  kicker: string;
  title: string;
  description: string;
  visual: PhaseVisual;
  objectLabel: string;
  question: string;
  output: string;
  risk: string;
  deliverables: Array<{ title: string; text: string }>;
}

export const phases: Phase[] = [
  {
    id: 'descoberta',
    number: '01',
    kicker: 'Descoberta & enquadramento',
    title: 'Entender o problema antes de escolher a tecnologia.',
    description:
      'A consultoria começa pela construção de uma leitura compartilhada do contexto: qual transformação é desejada, quem é afetado, quais decisões precisam ser tomadas e que evidências definem sucesso. A solução ainda permanece deliberadamente aberta.',
    visual: 'discovery',
    objectLabel: 'Constelação de contexto',
    question: 'Qual problema merece ser resolvido?',
    output: 'Problema e objetivos enquadrados',
    risk: 'Solução prematura',
    deliverables: [
      { title: 'Mapa do problema', text: 'Dores, causas, oportunidades, limites e objetivos mensuráveis.' },
      { title: 'Mapa de stakeholders', text: 'Usuários, operadores, especialistas, decisores e patrocinadores.' },
      { title: 'Hipóteses iniciais', text: 'Direções de solução que serão validadas nas etapas seguintes.' }
    ]
  },
  {
    id: 'diagnostico',
    number: '02',
    kicker: 'Diagnóstico & elicitação',
    title: 'Trocar suposições por evidências sobre a operação real.',
    description:
      'Entrevistas, workshops, observação do trabalho, documentos e sistemas existentes revelam processos, dados, integrações, restrições, dependências e riscos. É aqui que a demanda verbal se transforma em material verificável.',
    visual: 'diagnosis',
    objectLabel: 'Scanner de evidências',
    question: 'Como o sistema funciona hoje?',
    output: 'Diagnóstico factual e requisitos brutos',
    risk: 'Decisões baseadas em pressupostos',
    deliverables: [
      { title: 'Levantamento de necessidades', text: 'Necessidades de negócio, jornadas, exceções e pontos de fricção.' },
      { title: 'Inventário técnico', text: 'Dados, APIs, sistemas legados, infraestrutura, segurança e integrações.' },
      { title: 'Mapa de riscos e lacunas', text: 'Restrições de prazo, orçamento, governança, dados e capacidade operacional.' }
    ]
  },
  {
    id: 'lean-inception',
    number: '03',
    kicker: 'Lean Inception',
    title: 'Alinhar visão e descobrir o que realmente importa primeiro.',
    description:
      'Negócio, usuários e tecnologia convergem em uma visão comum do produto. Personas, jornadas, objetivos, funcionalidades e trade-offs são discutidos de forma explícita para reduzir dispersão e construir foco executivo.',
    visual: 'inception',
    objectLabel: 'Órbita de alinhamento',
    question: 'Qual valor deve aparecer primeiro?',
    output: 'Visão, jornadas e prioridades',
    risk: 'Produto grande demais para aprender',
    deliverables: [
      { title: 'Visão compartilhada', text: 'Propósito, público, resultados esperados e fronteiras do produto.' },
      { title: 'Jornadas e funcionalidades', text: 'Fluxos de maior valor e funcionalidades candidatas.' },
      { title: 'Priorização explícita', text: 'Valor, risco, esforço, dependências e custo de atraso tornam-se visíveis.' }
    ]
  },
  {
    id: 'engenharia-requisitos',
    number: '04',
    kicker: 'Engenharia de requisitos',
    title: 'Transformar necessidades em especificações testáveis.',
    description:
      'Os resultados da descoberta são consolidados em requisitos funcionais e não funcionais, regras de negócio, critérios de aceite e rastreabilidade. A ambiguidade passa a ser tratada como risco de engenharia.',
    visual: 'requirements',
    objectLabel: 'Blueprint de requisitos',
    question: 'Como saberemos que está correto?',
    output: 'Especificação verificável',
    risk: 'Retrabalho por ambiguidade',
    deliverables: [
      { title: 'Requisitos funcionais', text: 'Comportamentos, fluxos, regras, exceções e integrações esperadas.' },
      { title: 'Qualidades do sistema', text: 'Segurança, desempenho, disponibilidade, auditoria, acessibilidade e escala.' },
      { title: 'Critérios de aceite', text: 'Condições objetivas para teste, homologação e definição de pronto.' }
    ]
  },
  {
    id: 'backlog-mvps',
    number: '05',
    kicker: 'Product Backlog Building',
    title: 'Construir o backlog do produto e recortar os MVPs.',
    description:
      'O Product Backlog Building organiza épicos, features, histórias, dependências e critérios de aceite. O produto deixa de ser um bloco único e passa a ter versões incrementais: MVP 1, MVP 2 e ondas posteriores de evolução.',
    visual: 'backlog',
    objectLabel: 'Torres de backlog',
    question: 'Qual é o menor recorte que gera valor?',
    output: 'Backlog priorizado + MVPs',
    risk: 'Escopo difuso e interminável',
    deliverables: [
      { title: 'Product Backlog', text: 'Épicos, features, histórias, critérios, dependências e prioridades.' },
      { title: 'Lista de MVPs', text: 'MVP 1, MVP 2, MVP 3 e hipóteses de evolução posteriores.' },
      { title: 'Roadmap incremental', text: 'Sequência de aprendizagem, construção e expansão do produto.' }
    ]
  },
  {
    id: 'arquitetura',
    number: '06',
    kicker: 'Arquitetura & plano de execução',
    title: 'Projetar uma solução viável antes de assumir o compromisso de construir.',
    description:
      'A arquitetura traduz o produto priorizado em decisões tecnológicas: fronteiras de sistemas, dados, integrações, infraestrutura, segurança, observabilidade, implantação e estratégia de evolução. O objetivo é tornar custo e risco tecnicamente compreensíveis.',
    visual: 'architecture',
    objectLabel: 'Arquitetura em camadas',
    question: 'Como entregar isso com segurança e continuidade?',
    output: 'Blueprint de solução + plano',
    risk: 'Dívida estrutural e estimativas cegas',
    deliverables: [
      { title: 'Arquitetura de solução', text: 'Componentes, fronteiras, integrações, dados e decisões arquiteturais.' },
      { title: 'Plano de execução', text: 'Sequenciamento, dependências, riscos, ambientes e estratégia de implantação.' },
      { title: 'Estimativas e premissas', text: 'Faixas de esforço e custo vinculadas a hipóteses explicitamente documentadas.' }
    ]
  },
  {
    id: 'aprovacao',
    number: '07',
    kicker: 'Validação & decision gate',
    title: 'Dar ao cliente uma decisão informada de go / no-go.',
    description:
      'O cliente revisa o recorte do produto, backlog, MVPs, arquitetura, premissas, riscos, critérios de aceite e plano de execução. A aprovação deixa de ser uma concordância genérica e se torna um marco de decisão rastreável.',
    visual: 'approval',
    objectLabel: 'Gate de aprovação',
    question: 'Estamos de acordo sobre o que será construído?',
    output: 'Baseline aprovada',
    risk: 'Desalinhamento contratual e técnico',
    deliverables: [
      { title: 'Baseline de escopo', text: 'O que entra, o que não entra e o que permanece como hipótese futura.' },
      { title: 'Validação técnica e de produto', text: 'Protótipos, arquitetura, critérios e riscos revisados com as partes.' },
      { title: 'Gate formal', text: 'Decisão documentada para iniciar, ajustar ou interromper a construção.' }
    ]
  },
  {
    id: 'entrega',
    number: '08',
    kicker: 'Construção, homologação & handover',
    title: 'Construir em incrementos, homologar e preparar a continuidade.',
    description:
      'A implementação segue o backlog e os critérios acordados, com incrementos observáveis, QA, homologação e feedback. A entrega inclui implantação, documentação, transferência de conhecimento e um backlog residual pronto para evolução.',
    visual: 'delivery',
    objectLabel: 'Pipeline de entrega',
    question: 'Como entregar valor sem perder continuidade?',
    output: 'Produto operacional + handover',
    risk: 'Dependência da consultoria após a entrega',
    deliverables: [
      { title: 'Incrementos homologáveis', text: 'Build, testes e demonstrações alinhadas aos critérios de aceite.' },
      { title: 'Implantação e documentação', text: 'Deploy, operação, observabilidade, configuração e decisões registradas.' },
      { title: 'Handover e evolução', text: 'Transferência de conhecimento, backlog residual e próximos ciclos.' }
    ]
  }
];
