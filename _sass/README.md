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
│   ├── _topbar.scss        # Barra superior
│   ├── sidebar/            # Componentes da sidebar
│   │   ├── _base.scss          # Base da sidebar
│   │   ├── _buttons.scss       # Botões da sidebar
│   │   ├── _navigation.scss    # Navegação
│   │   ├── _repositories.scss  # Repositórios
│   │   └── _search.scss        # Busca
│   └── text/               # Componentes de texto
│       ├── _blockquote.scss    # Citações
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

**`_variables.scss`**
Variáveis CSS: cores, espaçamentos, tipografia, bordas e dimensões.

**`_mixins.scss`**
Mixins reutilizáveis: transições, sombras, flexbox, grid e responsividade.

**`_base.scss`**
Estilos fundamentais: layout geral, tipografia, links e code blocks.

**`_components.scss`**
Importa todos os componentes modulares.

### Componentes (`components/`)

**Principais:**
- `_badges.scss` - Badges e etiquetas
- `_breadcrumb.scss` - Navegação breadcrumb
- `_buttons.scss` - Botões de ação
- `_scrollbar.scss` - Customização da scrollbar
- `_sidebar.scss` - Barra lateral
- `_topbar.scss` - Barra superior

**Sidebar (`sidebar/`):**
- `_base.scss` - Base da sidebar
- `_buttons.scss` - Botões da sidebar
- `_navigation.scss` - Navegação
- `_repositories.scss` - Repositórios
- `_search.scss` - Busca

**Text (`text/`):**
- `_blockquote.scss` - Citações
- `_tables.scss` - Tabelas

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

### Exemplos

**Variáveis:**
```scss
.elemento {
    color: var(--accent);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
}
```

**Mixins:**
```scss
.botao {
    @include button-primary;
}

@include respond-to('tablet') {
    .elemento { font-size: var(--font-size-sm); }
}
```

## 🚀 Adicionar Componente

1. Criar `_sass/components/_seu-componente.scss`
2. Desenvolver usando variáveis e mixins
3. Importar em `_sass/_components.scss`:
   ```scss
   @import 'components/seu-componente';
   ```

## ✨ Benefícios

- **Manutenibilidade**: Componentes isolados
- **Reusabilidade**: Mixins evitam duplicação
- **Consistência**: Variáveis garantem uniformidade
- **Organização**: Estrutura clara
- **Escalabilidade**: Fácil expansão

## 🎨 Personalização

Edite `_sass/_variables.scss`:
- Modo escuro: `:root { ... }`
- Modo claro: `[data-theme="light"] { ... }`
