# Aurora Commerce — Guia de Arquitetura

## 1. Visão do projeto

Aurora Commerce é uma plataforma reutilizável de comércio eletrônico.

A primeira implementação oficial é a Lembrei de Você Store, mas a estrutura deve permitir a criação futura de diferentes lojas, segmentos, temas e modelos de negócio sem duplicar toda a aplicação.

A plataforma deve atender produtos:

- físicos;
- digitais;
- personalizados;
- sob encomenda;
- kits;
- serviços, futuramente.

---

## 2. Princípios fundamentais

### 2.1 Reutilização

Todo componente deve ser desenvolvido pensando em sua utilização por diferentes lojas.

Evitar componentes dependentes do nome, das cores ou dos textos da Lembrei de Você Store.

### 2.2 Configuração externa

Textos, opções visuais, slides, benefícios, links e comportamentos configuráveis não devem permanecer fixos dentro dos componentes.

Exemplo:

```ts
storefrontConfig.hero.enabled
storefrontConfig.hero.autoplay
storefrontConfig.hero.slides