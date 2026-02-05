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

## 🎯 Layouts

### `default.html` - Layout Base
Layout principal com estrutura HTML completa:
- **Componentes**: topbar, sidebar, header, main, footer
- **Scripts**: `default/scripts-default.html`
- **Uso**: Base para todos os outros layouts

### `post.html` - Posts e Artigos
Herda de `default.html` e renderiza conteúdo diretamente.

**Exemplo:**
```yaml
---
layout: post
title: Título do Post
---
```

### `diario.html` - Diário de Aprendizado
Herda de `default.html` com listagem automática de entradas.
- **Script adicional**: `scripts/layouts/diario-listing.html`

**Exemplo:**
```yaml
---
layout: diario
title: Diário de Aprendizado
description: Registro das minhas experiências
---
```

### `pasta.html` - Pastas e Coleções
Herda de `default.html` com listagem automática de itens.
- **Script adicional**: `scripts/layouts/pasta-listing.html`

**Exemplo:**
```yaml
---
layout: pasta
title: Templates
description: Modelos reutilizáveis
---
```

### `gatilho.html` - Gatilhos e Conceitos
Herda de `post.html` para conteúdo minimalista.

**Exemplo:**
```yaml
---
layout: gatilho
title: Conceito Fundamental
---
```

## 🔄 Hierarquia

```
default.html
├── post.html
│   └── gatilho.html
├── diario.html
└── pasta.html
```

## 📦 Componentes (via `default.html`)

### Includes
- `default/head-default.html` - Head HTML
- `topbar.html` - Barra superior
- `sidebar.html` - Barra lateral
- `default/header-default.html` - Header
- `default/footer-default.html` - Footer
- `default/scripts-default.html` - Scripts padrão

### Scripts Específicos
- `diario.html` → `scripts/layouts/diario-listing.html`
- `pasta.html` → `scripts/layouts/pasta-listing.html`

## 🔧 Uso

### Definir Layout
```yaml
---
layout: nome-do-layout
title: Título
---
```

### Variáveis Disponíveis
- `{{ content }}` - Conteúdo da página
- `{{ page.title }}` - Título
- `{{ page.description }}` - Descrição (opcional)
- `{{ site.* }}` - Variáveis de `_config.yml`

### Criar Novo Layout
1. Criar `_layouts/seu-layout.html`
2. Definir herança:
   ```yaml
   ---
   layout: default
   ---
   ```
3. Adicionar HTML e Liquid tags

## ✨ Boas Práticas

- Use `default.html` como base para novos layouts
- Mantenha layouts focados e específicos
- Reutilize componentes via `{% include %}`
- Verifique variáveis opcionais: `{% if page.description %}`
