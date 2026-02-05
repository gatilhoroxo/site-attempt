# Estrutura SASS

Organização modular dos estilos do site para facilitar manutenção e evitar repetição de código.

## 📁 Estrutura

```
_sass/
├── _variables.scss      # Variáveis CSS (cores, espaçamentos, tipografia)
├── _mixins.scss        # Funções reutilizáveis (transições, sombras, flexbox)
├── _base.scss          # Estilos base (HTML, body, header, footer)
├── _components.scss    # Importa todos os componentes
├── components/         # Componentes modulares
│   ├── _badges.scss        # Badges e tags
│   ├── _breadcrumb.scss    # Navegação breadcrumb
│   ├── _buttons.scss       # Botões e toggle de tema
│   ├── _scrollbar.scss     # Customização da scrollbar
│   ├── _sidebar.scss       # Barra lateral e navegação
│   ├── _text.scss          # Importa componentes de texto
│   ├── _topbar.scss        # Barra superior
│   ├── sidebar/            # Componentes da sidebar
│   │   ├── _base.scss          # Base da sidebar
│   │   ├── _buttons.scss       # Botões da sidebar
│   │   ├── _navigation.scss    # Navegação
│   │   ├── _repositories.scss  # Repositórios
│   │   └── _search.scss        # Busca
│   └── text/               # Componentes de texto
│       ├── _blockcode.scss     # Blocos de código
│       ├── _blockquote.scss    # Citações
│       ├── _details.scss       # Elementos colapsáveis
│       ├── _syntax.scss        # Syntax highlighting (monokai.sublime)
│       └── _tables.scss        # Tabelas
├── layouts/            # Layouts de páginas específicas
│   ├── _diario.scss        # Layout do diário
│   ├── _pasta.scss         # Layout de pastas
│   └── _projeto-page.scss  # Layout de páginas de projeto
└── screens/            # Media queries responsivas
    ├── _desktop.scss       # Estilos para desktop
    ├── _tablet.scss        # Estilos para tablet
    └── _phone.scss         # Estilos para mobile
```

## 🎯 Arquivos Principais

### Raiz
- **`_variables.scss`** - Variáveis CSS: cores, espaçamentos, tipografia, bordas e dimensões
- **`_mixins.scss`** - Mixins reutilizáveis: transições, sombras, flexbox, grid e responsividade
- **`_base.scss`** - Estilos fundamentais: layout geral, tipografia, links e separadores
- **`_components.scss`** - Importa todos os componentes modulares

### Componentes (`components/`)

**UI Principal:**
- `_badges.scss` - Badges e etiquetas
- `_breadcrumb.scss` - Navegação breadcrumb
- `_buttons.scss` - Botões de ação
- `_scrollbar.scss` - Customização da scrollbar
- `_sidebar.scss` - Barra lateral
- `_topbar.scss` - Barra superior
- `_text.scss` - Importa componentes de texto

**Sidebar (`sidebar/`):**
- `_base.scss` - Base da sidebar
- `_buttons.scss` - Botões da sidebar
- `_navigation.scss` - Navegação com expansão
- `_repositories.scss` - Lista de repositórios
- `_search.scss` - Busca no site

**Text (`text/`):**
- `_blockcode.scss` - Blocos de código (largura 70%)
- `_blockquote.scss` - Citações estilizadas
- `_details.scss` - Elementos `<details>` colapsáveis (largura 60%)
- `_syntax.scss` - Tema monokai.sublime para syntax highlighting
- `_tables.scss` - Tabelas responsivas

### Layouts (`layouts/`)
- `_diario.scss` - Estilização do diário de aprendizado
- `_pasta.scss` - Estilos de pastas e coleções
- `_projeto-page.scss` - Layout de páginas de projeto

### Responsividade (`screens/`)
- `_desktop.scss` - Desktop (> 1024px)
- `_tablet.scss` - Tablet (768px - 1024px)
- `_phone.scss` - Mobile (< 768px)

## 🔧 Uso

### Ordem de Importação
```scss
@import "variables";   // 1. Variáveis
@import "mixins";      // 2. Mixins
@import "base";        // 3. Base
@import "components";  // 4. Componentes
```

### Exemplos de Uso

**Variáveis:**
```scss
.elemento {
    color: var(--accent);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    background-color: var(--bg-light);
}
```

**Mixins:**
```scss
.botao {
    @include button-primary;
    @include transition(all, 0.3s, ease);
}

@include respond-to('tablet') {
    .elemento { font-size: var(--font-size-sm); }
}
```

## 🎨 Syntax Highlighting

O site usa **Rouge** com tema **monokai.sublime** adaptado para o esquema de cores roxo do site:
- Fundo dos blocos: `#211a2e` (roxo escuro)
- Números de linha na lateral esquerda
- Suporte para C, C++, Bash, Markdown, Python, JavaScript, etc.

Para atualizar o tema:
```bash
rougify style <tema> > _sass/components/text/_syntax.scss
sed -i 's/#272822/#211a2e/g' _sass/components/text/_syntax.scss
```

## 📏 Dimensões Customizadas

### Blocos de Código
- Largura: 70% do container
- Tema: monokai.sublime com fundo roxo
- Line numbers habilitados

### Blocos Details (colapsáveis)
- Largura: 60% do container
- Padding compacto: 6-8px
- Seta animada que rotaciona ao expandir

## 🚀 Adicionar Componente

1. Criar arquivo em `_sass/components/_seu-componente.scss`
2. Desenvolver usando variáveis (`var(--*)`) e mixins (`@include`)
3. Importar em `_sass/_components.scss`:
   ```scss
   @import 'components/seu-componente';
   ```

## ✨ Benefícios

- **Manutenibilidade**: Componentes isolados e bem organizados
- **Reusabilidade**: Mixins evitam duplicação de código
- **Consistência**: Variáveis garantem uniformidade visual
- **Organização**: Estrutura clara e hierárquica
- **Escalabilidade**: Fácil adicionar novos componentes
- **Temas**: Suporte a dark/light mode via variáveis CSS

## 🎨 Personalização de Temas

Edite `_sass/_variables.scss`:

**Modo Escuro (padrão):**
```scss
:root {
    --bg: #1a1625;              // Roxo escuro
    --accent: #d4c8e6;          // Lavanda
    --text: #f5f3f9;            // Branco suave
}
```

**Modo Claro:**
```scss
[data-theme="light"] {
    --bg: #d6c4eb;              // Lavanda claro
    --accent: #7a5da6;          // Roxo médio
    --text: #3d2463;            // Roxo escuro
}
```

## 🔍 Componentes Especiais

### Details/Summary
- Suporte a Markdown dentro com `markdown="1"`
- Configuração `parse_block_html: true` no `_config.yml`
- Animação suave na expansão
- Seta indicadora rotacionável

### Code Blocks
- Syntax highlighting via Rouge
- Números de linha configuráveis
- Scroll horizontal para código longo
- Background roxo customizado

---

**Última atualização:** Fevereiro 2026
