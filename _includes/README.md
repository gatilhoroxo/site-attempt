# Includes do Site

Componentes HTML reutilizáveis do Jekyll para construção modular das páginas.

## 📁 Estrutura

```
_includes/
├── breadcrumb.html             # Navegação breadcrumb completa
├── breadcrumb-icon.html        # Renderização de ícones do breadcrumb
├── nav.html                    # Navegação principal
├── sidebar.html                # Barra lateral de navegação
├── topbar.html                 # Barra superior (breadcrumb + controles)
├── default/                    # Componentes padrão do layout
│   ├── head-default.html           # <head> HTML (meta, CSS, favicon)
│   ├── header-default.html         # Header com título e nav
│   └── footer-default.html         # Footer com copyright
└── scripts/                    # Scripts JavaScript ou Liquid Jekyll
    ├── theme-switcher.html         # Alternância de tema claro/escuro
    ├── font-size-control.html      # Controle de tamanho de fonte
    ├── navigation-sidebar.html     # Navegação da sidebar
    ├── sidebar-expand.html         # Expansão/colapso da sidebar
    ├── diario-listing.html         # Listagem automática de diários
    └── pasta-listing.html          # Listagem automática de pastas
```

## 🎯 Componentes de Navegação

### `breadcrumb.html`
Navegação breadcrumb completa com configuração centralizada.
- **Configuração**: `_data/breadcrumb_config.yml`
- **Recursos**:
  - Item "Home" com ícone SVG
  - Geração automática de breadcrumb baseado na URL
  - Separadores visuais entre itens
  - Suporte a skip de itens específicos
  - Estados de hover e item atual

**Uso:**
```liquid
{% include breadcrumb.html %}
```

### `breadcrumb-icon.html`
Renderiza ícones para itens do breadcrumb (SVG ou emoji).
- **Parâmetros**: `config` - configuração da seção do breadcrumb
- Suporta `icon_type: "svg"` ou `icon_type: "emoji"`

**Uso:**
```liquid
{% include breadcrumb-icon.html config=section_config %}
```

### `nav.html`
Navegação principal simples do site.
- Links para: Início, Gatilhos, Posts

**Uso:**
```liquid
{% include nav.html %}
```

### `sidebar.html`
Barra lateral completa com navegação hierárquica.
- **Recursos**:
  - Seções: Gatilhos e Posts
  - Hierarquia de pastas e subpastas
  - Detecção automática de `layout: pasta`
  - Suporte a `details/summary` para expansão
  - Organização alfabética por título
  - Até 3 níveis de profundidade

**Uso:**
```liquid
{% include sidebar.html %}
```

### `topbar.html`
Barra superior com breadcrumb e controles.
- **Lado esquerdo**: Breadcrumb
- **Lado direito**:
  - Controle de tamanho de fonte (A-, A+)
  - Toggle de tema (🌙/☀️)

**Uso:**
```liquid
{% include topbar.html %}
```

## 🧩 Componentes Padrão (`default/`)

### `head-default.html`
Tag `<head>` HTML completa.
- **Conteúdo**:
  - Meta charset e viewport
  - Título dinâmico: `{{ page.title }} - {{ site.title }}`
  - Favicon (múltiplos tamanhos e formatos)
  - Link para CSS principal (`assets/css/style.css`)

**Uso:**
```liquid
{% include default/head-default.html %}
```

### `header-default.html`
Header padrão do site.
- Título do site (`{{ site.title }}`)
- Navegação principal (`nav.html`)

**Uso:**
```liquid
{% include default/header-default.html %}
```

### `footer-default.html`
Footer padrão com copyright.
- Copyright dinâmico com ano atual
- Créditos: "desenvolvido por gatilhoroxo"

**Uso:**
```liquid
{% include default/footer-default.html %}
```

## 🔧 Scripts JavaScript (`scripts/`)

### `theme-switcher.html`
Script de alternância de tema (dark/light).
- **Recursos**:
  - Salva preferência no `localStorage`
  - Aplica tema imediatamente sem transições
  - Alterna ícone do botão (🌙/☀️)
  - Tema padrão: escuro

**Uso:**
```liquid
{% include scripts/theme-switcher.html %}
```

### `font-size-control.html`
Controle de tamanho de fonte.
- **Recursos**:
  - 5 tamanhos: 80%, 90%, 100%, 110%, 120%
  - Padrão: 110%
  - Salva no `localStorage`
  - Desabilita botões nos limites
  - Aplica no `html { font-size }`

**Uso:**
```liquid
{% include scripts/font-size-control.html %}
```

### `navigation-sidebar.html`
Script de navegação da sidebar.
- Gerencia abertura/fechamento da sidebar
- Interações de navegação

**Uso:**
```liquid
{% include scripts/navigation-sidebar.html %}
```

### `sidebar-expand.html`
Controle de expansão/colapso da sidebar.
- **Recursos**:
  - Toggle de classe `sidebar-collapsed`
  - Animações de transição
  - Persistência de estado

**Uso:**
```liquid
{% include scripts/sidebar-expand.html %}
```

### `diario-listing.html`
Listagem automática de entradas de diário.
- **Recursos**:
  - Formato de timeline
  - Exibe apenas filhos diretos do diretório atual
  - Separa entradas de diário de outros arquivos
  - Usa layout compacto
  - Extração automática de data do nome do arquivo

**Uso:**
```liquid
{% include scripts/diario-listing.html %}
```

### `pasta-listing.html`
Listagem automática de pastas e arquivos.
- **Recursos**:
  - Separação entre pastas e arquivos
  - Exibe apenas filhos diretos (1 nível)
  - Ícones diferentes para pastas e arquivos
  - Mostra descrição se disponível
  - Organização alfabética

**Uso:**
```liquid
{% include scripts/pasta-listing.html %}
```

## 🔄 Fluxo de Inclusão

**Layout `default.html` inclui:**
```
default/head-default.html
    ↓
sidebar.html
    ↓
topbar.html → breadcrumb.html → breadcrumb-icon.html
    ↓
default/header-default.html → nav.html
    ↓
{{ content }}
    ↓
default/footer-default.html
    ↓
scripts/theme-switcher.html
scripts/font-size-control.html
scripts/navigation-sidebar.html
scripts/sidebar-expand.html
```

**Layout `diario.html` adiciona:**
```
scripts/diario-listing.html
```

**Layout `pasta.html` adiciona:**
```
scripts/pasta-listing.html
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

### Adicionar Novo Include
1. Crie arquivo em `_includes/seu-componente.html`
2. Desenvolva com HTML e Liquid tags
3. Inclua em layouts ou páginas:
   ```liquid
   {% include seu-componente.html %}
   ```

## ✨ Boas Práticas

- Mantenha includes focados em uma função específica
- Use comentários para documentar parâmetros esperados
- Prefira configuração via `_data/` para conteúdo variável
- Reutilize includes em vez de duplicar código
- Organize scripts por funcionalidade na pasta `scripts/`
- Use includes de `default/` para componentes estruturais
