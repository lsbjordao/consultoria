# Consultoria Astro WebGL — v4

Landing page em **Astro + Three.js + GSAP** para explicar, de forma visual, as fases de uma consultoria de TI / engenharia de soluções tecnológicas.

## Stack

- Astro 7.2.4
- Three.js 0.185.1
- GSAP 3.15.0
- TypeScript

## O que mudou na v4

A v4 foi criada para corrigir um problema de direção de arte percebido nas iterações anteriores: o **gráfico contínuo no fundo** estava competindo com o texto e com os objetos 3D de cada etapa.

### Ajuste principal

A jornada 3D de fundo foi substituída por um **background atmosférico e discreto**:

- partículas leves
- halos sutis
- glows translúcidos
- malha/grid de fundo enfraquecida
- leve parallax por ponteiro e scroll

Com isso, a página fica mais **elegante, editorial e premium**, e os **objetos 3D de cada fase** assumem o protagonismo visual.

## Estrutura conceitual do fluxo

1. Descoberta estratégica
2. Diagnóstico & levantamento
3. Engenharia de requisitos
4. Lean Inception
5. Product Backlog Building + MVPs
6. Arquitetura da solução & plano de execução
7. Validação / aprovação do cliente
8. Construção, homologação & handover

> Observação: o fluxo principal é linear, mas a página também explicita os **feedback loops** entre as etapas.

## Rodando localmente

```bash
npm install
npm run dev
```

## Estrutura relevante

```text
src/
├── components/
├── data/
├── layouts/
├── lib/
│   ├── background.ts     # fundo atmosférico discreto (v4)
│   ├── main.ts
│   ├── phaseScenes.ts    # objetos 3D de cada etapa
│   └── scroll.ts         # GSAP + ScrollTrigger + ScrollSmoother
├── pages/
└── styles/
```

## Direção da v4

- **fundo global discreto**
- **3D forte apenas onde importa**
- **scroll narrativo suave**
- **mais legibilidade**
- **menos poluição visual**

A intenção da v4 é aproximar o projeto de uma landing page “vencedora”: mais limpa, mais segura visualmente e com melhor equilíbrio entre conteúdo, motion e WebGL.
