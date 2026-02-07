# Convenções de Código e Organização

Este documento estabelece os padrões de nomenclatura, organização de arquivos, 
convenções de código SCSS, front matter e permalinks usados neste projeto.

## Nomenclatura de Arquivos e Pastas

### Regras Gerais

**Pastas**: Sempre em minúsculas, com hífens para separar palavras
```
✓ conceitos-fundamentais/
✓ diario-de-aprendizado/
✗ Conceitos_Fundamentais/
✗ diarioAprendizado/
```

**Arquivos Markdown**: Minúsculas, hífens, extensão `.md`
```
✓ template-conceito.md
✓ dia_2025-12-25_.md (exceção: templates de diário)
✗ TemplatConceito.md
✗ template_conceito.markdown
```

**Arquivos HTML**: Minúsculas, hífens, extensão `.html`
```
✓ head-default.html
✓ sidebar.html
✗ HeadDefault.html
```

**Arquivos SCSS**: Prefixo `_` para partials, minúsculas, hífens
```
✓ _variables.scss
✓ _sidebar.scss
✗ variables.scss (sem underscore)
✗ _sideBar.scss (camelCase)
```

### Nomenclatura por Tipo

**Layouts**: Substantivo descritivo
- `default.html` - Layout base
- `post.html` - Para artigos
- `gatilho.html` - Para documentação
- `pasta.html` - Para índices

**Includes**: Função ou componente
- `nav.html` - Navegação
- `breadcrumb-icon.html` - Específico e descritivo
- `theme-switcher.html` - Feature clara

**Data Files**: Plural ou descritivo
- `repositories.yml` - Plural
- `breadcrumb_config.yml` - Singular com contexto

**Imagens**: Descritivo, sem espaços
- `favicon-32x32.png`
- `logo.png`
- `apple-touch-icon.png`

## Organização de Diretórios

### Estrutura Padrão

```
src/
├── _layouts/        # Um arquivo por layout
├── _includes/       # Organizado por função
│   ├── default/    # Componentes do layout default
│   ├── scripts/    # Features JavaScript
│   └── *.html      # Componentes globais
├── _sass/
│   ├── _*.scss     # Arquivos base (variables, mixins, base)
│   ├── components/ # Um arquivo por componente
│   ├── layouts/    # Estilos específicos de layouts
│   └── screens/    # Media queries por dispositivo
├── _data/          # Arquivos YAML de configuração
└── assets/
    ├── css/        # Entry points SCSS
    ├── images/     # Todas imagens
    └── json/       # Dados para JavaScript

content/
├── gatilhos/       # Por tipo de conteúdo
│   ├── index.md   # Sempre presente
│   └── */         # Subseções com index.md
├── posts/
└── projects/
```

### Regras de Organização

1. **Um arquivo = uma responsabilidade**
   - Cada include faz uma coisa
   - Cada SCSS partial é um componente

2. **Hierarquia clara**
   - Máximo 3 níveis de profundidade
   - Subpastas quando > 5 arquivos relacionados

3. **Index files obrigatórios**
   - Toda pasta de conteúdo tem `index.md`
   - Define título e layout da seção

4. **README para complexidade**
   - Pastas com > 10 arquivos têm README
   - Explica organização interna

## Padrões SCSS

### Estrutura de Arquivo

```scss
// 1. Comentário de cabeçalho
/**
 * Component: Sidebar
 * Estilos para barra lateral de navegação
 */

// 2. Variáveis locais (se necessário)
$sidebar-width: 250px;

// 3. Mixins locais (se necessário)
@mixin sidebar-transition {
  transition: transform 0.3s ease;
}

// 4. Estilos do componente
.sidebar {
  width: $sidebar-width;
  @include sidebar-transition;
  
  // 5. Elementos aninhados (max 3 níveis)
  &__header {
    padding: 1rem;
    
    &--active {
      background: var(--bg-active);
    }
  }
  
  // 6. Estados e modificadores
  &:hover {
    transform: translateX(0);
  }
  
  // 7. Media queries no final
  @include tablet {
    width: 300px;
  }
}
```

### Convenções de Nomenclatura CSS

Usamos **BEM modificado** (Block Element Modifier):

```scss
// Block
.component { }

// Element (parte do block)
.component__element { }

// Modifier (variação)
.component--modifier { }
.component__element--modifier { }

// Estados (preferir data attributes)
.component[data-state="active"] { }
```

**Exemplos:**
```scss
.sidebar { }                    // Block
.sidebar__nav { }               // Element
.sidebar__nav-item { }          // Sub-element
.sidebar--collapsed { }         // Modifier
.sidebar__nav-item--active { }  // Element modifier
```

### Variáveis

**Naming:**
```scss
// Padrão: $tipo-subtipo-propriedade-variação
$color-theme-primary: #6b46c1;
$color-theme-secondary: #805ad5;
$spacing-base-unit: 0.25rem;
$font-size-heading-large: 2rem;
$z-index-modal: 1000;
```

**Organização:**
```scss
// _variables.scss

// === TEMA ===
// Cores primárias
$theme-primary: #6b46c1;
$theme-secondary: #805ad5;

// Cores de fundo
$light-bg: #ffffff;
$dark-bg: #1a1a1a;

// === TIPOGRAFIA ===
$font-family-base: -apple-system, BlinkMacSystemFont, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.6;

// === SPACING ===
$spacing-unit: 0.25rem;
$spacing-small: calc($spacing-unit * 2);
$spacing-medium: calc($spacing-unit * 4);

// === LAYOUT ===
$container-max-width: 1200px;
$sidebar-width: 250px;

// === Z-INDEX ===
$z-index-sidebar: 100;
$z-index-topbar: 200;
$z-index-modal: 1000;
```

### Mixins

```scss
// _mixins.scss

// Responsividade
@mixin phone {
  @media (max-width: 767px) { @content; }
}

@mixin tablet {
  @media (min-width: 768px) and (max-width: 1023px) { @content; }
}

@mixin desktop {
  @media (min-width: 1024px) { @content; }
}

// Utilitários
@mixin flex-center {
  display: flex;
  justify-content: center;
<a href="{{ page.url | relative_url }}">Link</a>

<!-- Escape HTML quando necessário -->
<p>{{ user_content | escape }}</p>

<!-- Formatação de datas -->
{{ page.date | date: "%d/%m/%Y" }}

<!-- Capitalize, downcase, upcase -->
{{ page.title | capitalize }}
```

## Checklist de Conformidade

Antes de commitar, verifique:

- [ ] Nomes de arquivos em minúsculas com hífens
- [ ] SCSS partials começam com `_`
- [ ] Front matter tem `layout` e `title`
- [ ] Permalinks não incluem "content/"
- [ ] Indentação de 2 espaços
- [ ] Comentários em código complexo
- [ ] Variáveis SCSS seguem padrão
- [ ] Classes CSS seguem BEM
- [ ] Aninhamento SCSS ≤ 3 níveis
- [ ] Index.md em toda pasta de conteúdo

---

**Última atualização**: Fevereiro de 2026
