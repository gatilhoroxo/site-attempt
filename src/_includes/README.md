# Includes do Site

Componentes HTML reutilizáveis do Jekyll para construção modular das páginas.

## 📁 Estrutura

```
_includes/
├── breadcrumb-icon.html        # Renderização de ícones do breadcrumb
├── nav.html                    # Navegação principal
├── sidebar.html                # Barra lateral de navegação
├── topbar.html                 # Barra superior (breadcrumb + controles)
├── default/                    # Componentes padrão do layout
│   ├── head-default.html           # <head> HTML (meta, CSS, favicon)
│   ├── header-default.html         # Header com título e nav
│   ├── footer-default.html         # Footer com copyright
│   └── scripts-default.html        # Scripts padrão do layout
└── scripts/                    # Scripts JavaScript ou Liquid Jekyll
    ├── breadcrumb.html             # Navegação breadcrumb
    ├── theme-switcher.html         # Alternância de tema claro/escuro
    ├── font-size-control.html      # Controle de tamanho de fonte
    ├── layouts/
    │   ├── diario-listing.html     # Listagem de diários
    │   └── pasta-listing.html      # Listagem de pastas
    └── sidebar/
        ├── navigation-mode.html        # Modo de navegação
        ├── navigation-state.html       # Estado da navegação
        ├── repositories-mode.html      # Modo de repositórios
        ├── repositories-state.html     # Estado de repositórios
        ├── search-mode.html            # Modo de busca
        ├── search-state.html           # Estado de busca
        ├── sidebar-expand.html         # Expansão da sidebar
        └── sidebar-state-manager.html  # Gerenciador de estado
```

## 🎯 Componentes Principais

### `breadcrumb-icon.html`
Renderiza ícones para itens do breadcrumb (SVG ou emoji).

### `nav.html`
Navegação principal com links para Início, Gatilhos e Posts.

### `sidebar.html`
Barra lateral com navegação hierárquica, suporte a pastas e organização alfabética.

### `topbar.html`
Barra superior com breadcrumb e controles (tamanho de fonte e tema).

## 🧩 Componentes Padrão (`default/`)

### `head-default.html`
Tag `<head>` com meta tags, título dinâmico, favicon e CSS.

### `header-default.html`
Header com título do site e navegação principal.

### `footer-default.html`
Footer com copyright dinâmico.

### `scripts-default.html`
Scripts padrão incluídos em todos os layouts.

## 🔧 Scripts (`scripts/`)

### `breadcrumb.html`
Script para navegação breadcrumb com configuração centralizada via `_data/breadcrumb_config.yml`.

### `theme-switcher.html`
Alternância de tema dark/light com persistência em `localStorage`.

### `font-size-control.html`
Controle de tamanho de fonte (80%-120%) com persistência.

### `layouts/diario-listing.html`
Listagem automática de entradas de diário em formato timeline.

### `layouts/pasta-listing.html`
Listagem automática de pastas e arquivos com ícones e descrições.

### `sidebar/navigation-mode.html`
Gerencia o modo de navegação da sidebar.

### `sidebar/navigation-state.html`
Controla o estado da navegação.

### `sidebar/repositories-mode.html`
Gerencia o modo de repositórios.

### `sidebar/repositories-state.html`
Controla o estado de repositórios.

### `sidebar/search-mode.html`
Gerencia o modo de busca.

### `sidebar/search-state.html`
Controla o estado de busca.

### `sidebar/sidebar-expand.html`
Controla expansão/colapso da sidebar com animações.

### `sidebar/sidebar-state-manager.html`
Gerenciador central de estado da sidebar.

## 🔄 Fluxo de Inclusão

**Layout `default.html`:**
```
default/head-default.html
sidebar.html
topbar.html → scripts/breadcrumb.html → breadcrumb-icon.html
default/header-default.html → nav.html
{{ content }}
default/footer-default.html
default/scripts-default.html
```

**Layout `diario.html`:**
```
+ scripts/layouts/diario-listing.html
```

**Layout `pasta.html`:**
```
+ scripts/layouts/pasta-listing.html
```

## 🔧 Como Usar

### Incluir Componente
```liquid
{% include nome-do-arquivo.html %}
```

### Incluir com Parâmetros
```liquid
{% include breadcrumb-icon.html config=section_config %}
```

## ✨ Boas Práticas

- Mantenha includes focados em uma função específica
- Use comentários para documentar parâmetros esperados
- Prefira configuração via `_data/` para conteúdo variável
- Reutilize includes em vez de duplicar código
- Organize scripts por funcionalidade nas pastas apropriadas
