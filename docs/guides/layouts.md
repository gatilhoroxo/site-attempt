# Guia de Layouts

## Hierarquia de Layouts

```
default.html (base)
├── post.html (herda default)
│   └── gatilho.html (herda post)
├── diario.html (herda default)
└── pasta.html (herda default)
```

## default.html

**Propósito**: Layout base com estrutura HTML completa

**Quando usar**: Raramente direto, serve como base para outros layouts

**Estrutura**:
```html
<!DOCTYPE html>
<html>
  {% include default/head-default.html %}
  <body>
    {% include topbar.html %}
    {% include nav.html %}
    <div class="container">
      {% include sidebar.html %}
      <main>
        {{ content }}
      </main>
    </div>
    {% include default/footer-default.html %}
  </body>
</html>
```

## post.html

**Propósito**: Layout para artigos e posts

**Quando usar**: Posts, artigos, conteúdo com título e data

**Front matter**:
```yaml
---
layout: post
title: "Título do Post"
date: 2026-02-06
---
```

**Adiciona**:
- Título formatado
- Metadata (data, autor)
- Espaçamento adequado para leitura

## gatilho.html

**Propósito**: Documentação de conceitos de aprendizado

**Quando usar**: Conceitos, tutoriais, documentação técnica

**Front matter**:
```yaml
---
layout: gatilho
title: "Conceito: Variáveis"
category: conceitos-fundamentais
---
```

**Adiciona**:
- Badges de categoria
- Navegação contextual
- Estilos específicos para documentação

## diario.html

**Propósito**: Entradas de diário de aprendizado

**Quando usar**: Diários diários, logs de progresso

**Front matter**:
```yaml
---
layout: diario
title: "Diário - 06/02/2026"
date: 2026-02-06
---
```

**Características**:
- Layout timeline
- Formatação de data
- Estilo cronológico

## pasta.html

**Propósito**: Páginas índice que listam subpáginas

**Quando usar**: index.md de seções

**Front matter**:
```yaml
---
layout: pasta
title: "Gatilhos"
permalink: /gatilhos/
---
```

**Funcionalidade**:
- Lista automaticamente subpáginas
- Gera índice navegável
- Mostra hierarquia de conteúdo

## Criar Novo Layout

1. Criar arquivo em `src/_layouts/novo.html`
2. Definir herança:
```liquid
---
layout: default
---

<div class="novo-layout">
  {{ content }}
</div>
```
3. Adicionar estilos em `src/_sass/layouts/_novo.scss`
4. Importar em `src/_sass/_components.scss`
