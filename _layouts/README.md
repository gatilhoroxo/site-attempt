# Layouts do Site

Layouts Jekyll que definem a estrutura HTML das diferentes páginas do site.

## 📁 Estrutura

```
_layouts/
├── default.html    # Layout base com estrutura completa
├── post.html       # Layout para posts/artigos
├── diario.html     # Layout para diário de aprendizado
├── pasta.html      # Layout para páginas de pasta/coleção
└── gatilho.html    # Layout para páginas de gatilho/conceito
```

## 🎯 Descrição dos Layouts

### `default.html` - Layout Base
Layout principal do site que inclui toda a estrutura HTML:
- **Head**: Meta tags, CSS, configurações (`head-default.html`)
- **Sidebar**: Barra lateral de navegação com ícones
- **Topbar**: Barra superior do site
- **Header**: Cabeçalho padrão
- **Main**: Área de conteúdo principal (`{{ content }}`)
- **Footer**: Rodapé padrão
- **Scripts**: 
  - Theme switcher (alternância de tema)
  - Font size control (controle de tamanho de fonte)
  - Navigation sidebar (navegação lateral)
  - Sidebar expand (expansão da sidebar)

**Uso**: Base para todos os outros layouts ou páginas que precisam da estrutura completa.

### `post.html` - Posts e Artigos
Layout simples que herda de `default.html`.
- Renderiza o conteúdo da página diretamente
- Sem componentes adicionais

**Uso**: Páginas de posts, artigos e documentação geral.

**Exemplo de front matter:**
```yaml
---
layout: post
title: Título do Post
---
```

### `diario.html` - Diário de Aprendizado
Layout para páginas de diário, herda de `default.html`.
- **Descrição opcional**: Exibe descrição se definida no front matter
- **Conteúdo**: Área principal do diário
- **Script**: Listagem automática de entradas de diário (`diario-listing.html`)

**Uso**: Páginas índice de diário de aprendizado.

**Exemplo de front matter:**
```yaml
---
layout: diario
title: Diário de Aprendizado
description: Registro das minhas experiências
---
```

### `pasta.html` - Pastas e Coleções
Layout para páginas de pasta/coleção, herda de `default.html`.
- **Descrição opcional**: Exibe descrição se definida no front matter
- **Conteúdo**: Área principal da pasta
- **Script**: Listagem automática de itens da pasta (`pasta-listing.html`)

**Uso**: Páginas que agrupam coleções de conteúdo (templates, ferramentas, etc).

**Exemplo de front matter:**
```yaml
---
layout: pasta
title: Templates
description: Modelos reutilizáveis para o projeto
---
```

### `gatilho.html` - Gatilhos e Conceitos
Layout mínimo para páginas de gatilho, herda de `post.html`.
- Renderiza apenas título e conteúdo
- Sem componentes adicionais

**Uso**: Páginas de conceitos fundamentais, definições e gatilhos de aprendizado.

**Exemplo de front matter:**
```yaml
---
layout: gatilho
title: Conceito Fundamental
---
```

## 🔄 Hierarquia de Herança

```
default.html (base)
├── post.html
│   └── gatilho.html
├── diario.html
└── pasta.html
```

- **`default.html`** é o layout raiz com estrutura completa
- **`post.html`** herda de `default.html` e serve como base para conteúdo simples
- **`gatilho.html`** herda de `post.html` para conteúdo ainda mais minimalista
- **`diario.html`** e **`pasta.html`** herdam de `default.html` e adicionam listagens automáticas

## 🔧 Como Usar

### Definir Layout em uma Página
No front matter do arquivo Markdown:
```yaml
---
layout: nome-do-layout
title: Título da Página
---

Conteúdo aqui...
```

### Variáveis Disponíveis
- `{{ content }}` - Conteúdo da página
- `{{ page.title }}` - Título da página
- `{{ page.description }}` - Descrição (opcional)
- `{{ site.* }}` - Variáveis do `_config.yml`

### Adicionar Novo Layout
1. Crie `_layouts/seu-layout.html`
2. Defina herança (se necessário):
   ```yaml
   ---
   layout: default
   ---
   ```
3. Adicione HTML e Liquid tags
4. Use em páginas com `layout: seu-layout`

## 📦 Componentes Incluídos

### Includes Padrão (via `default.html`)
- `default/head-default.html` - Head HTML
- `default/header-default.html` - Header
- `default/footer-default.html` - Footer
- `sidebar.html` - Barra lateral
- `topbar.html` - Barra superior

### Scripts Incluídos
- `scripts/theme-switcher.html` - Alternância de tema claro/escuro
- `scripts/font-size-control.html` - Controle de tamanho de fonte
- `scripts/navigation-sidebar.html` - Navegação da sidebar
- `scripts/sidebar-expand.html` - Expansão/colapso da sidebar
- `scripts/diario-listing.html` - Listagem de diários (apenas `diario.html`)
- `scripts/pasta-listing.html` - Listagem de pastas (apenas `pasta.html`)

## ✨ Boas Práticas

- Use `default.html` como base para novos layouts
- Mantenha layouts focados e específicos
- Reutilize componentes via `{% include %}`
- Defina variáveis opcionais com verificação: `{% if page.description %}`
- Documente variáveis esperadas no front matter
