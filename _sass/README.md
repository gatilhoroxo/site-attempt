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
│   ├── _diario.scss        # Estilos do diário de aprendizado
│   ├── _pasta.scss         # Estilos de pastas/coleções
│   ├── _scrollbar.scss     # Customização da scrollbar
│   ├── _sidebar.scss       # Barra lateral e navegação
│   ├── _tables.scss        # Tabelas responsivas
│   └── _topbar.scss        # Barra superior
├── layouts/            # Layouts de páginas específicas
│   └── _projeto-page.scss  # Layout de páginas de projeto
└── screens/            # Media queries responsivas
    ├── _desktop.scss       # Estilos para desktop
    ├── _tablet.scss        # Estilos para tablet
    └── _phone.scss         # Estilos para mobile
```

## 🎯 Descrição dos Arquivos

### Arquivos Raiz

**`_variables.scss`** - Variáveis CSS customizadas
- Cores (fundos, textos, destaques, bordas)
- Espaçamentos (sistema consistente)
- Tipografia (tamanhos de fonte)
- Bordas e raios
- Dimensões e larguras

**`_mixins.scss`** - Mixins reutilizáveis
- Transições e animações: `@include transition()`, `@include fadeIn()`
- Sombras: `@include box-shadow(1-5)`
- Interatividade: `@include hover-lift()`, `@include hover-scale()`
- Flexbox/Grid: `@include flex-center`, `@include grid-auto-fill()`
- Componentes: `@include button-primary`, `@include card-base`
- Responsividade: `@include respond-to('desktop')`, `@include respond-to('mobile')`

**`_base.scss`** - Estilos fundamentais
- Layout geral (HTML, body)
- Header e navegação principal
- Tipografia base
- Links e code blocks
- Footer

**`_components.scss`** - Importa todos os componentes modulares

### Componentes (`components/`)

- **`_badges.scss`** - Badges e etiquetas
- **`_breadcrumb.scss`** - Navegação breadcrumb com separadores
- **`_buttons.scss`** - Botões de ação e toggle de tema
- **`_diario.scss`** - Estilização do diário de aprendizado
- **`_pasta.scss`** - Estilos de pastas e coleções
- **`_scrollbar.scss`** - Customização da barra de rolagem
- **`_sidebar.scss`** - Barra lateral, navegação e toggle
- **`_tables.scss`** - Tabelas responsivas de componentes
- **`_topbar.scss`** - Barra superior do site

### Layouts (`layouts/`)

- **`_projeto-page.scss`** - Layout específico para páginas de projeto (meta informações, animações)

### Responsividade (`screens/`)

- **`_desktop.scss`** - Estilos para telas desktop
- **`_tablet.scss`** - Estilos para tablets
- **`_phone.scss`** - Estilos para smartphones

## 🔧 Uso

### Ordem de Importação
```scss
@import "variables";   // 1. Variáveis
@import "mixins";      // 2. Mixins
@import "base";        // 3. Base
@import "components";  // 4. Componentes
```

### Exemplos

**Usando variáveis:**
```scss
.elemento {
    color: var(--accent);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
}
```

**Usando mixins:**
```scss
.botao {
    @include button-primary;
}

@include respond-to('tablet') {
    .elemento { font-size: var(--font-size-sm); }
}
```

## 🚀 Adicionar Novos Componentes

1. Crie `_sass/components/_seu-componente.scss`
2. Desenvolva usando variáveis e mixins
3. Importe em `_sass/_components.scss`:
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

Edite `_sass/_variables.scss` para customizar:
- Modo escuro: `:root { ... }`
- Modo claro: `[data-theme="light"] { ... }`
