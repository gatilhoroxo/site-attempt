# Guia de Estilos

## Estrutura SCSS

### Arquivos Base

**_variables.scss**: Todas variáveis globais  
**_mixins.scss**: Mixins reutilizáveis  
**_base.scss**: Estilos base (html, body, typography)  
**_components.scss**: Importa todos componentes

### Sistema de Temas

Usa CSS variables para toggle dinâmico:

```scss
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #f0f0f0;
}
```

### Variáveis Disponíveis

**Cores**:
- `$theme-primary`, `$theme-secondary`
- `$light-bg`, `$dark-bg`
- `$light-text`, `$dark-text`

**Tipografia**:
- `$font-family-base`
- `$font-size-base`
- `$line-height-base`

**Spacing**:
- `$spacing-unit` (0.25rem)
- `$spacing-small`, `$spacing-medium`, `$spacing-large`

**Layout**:
- `$container-max-width`
- `$sidebar-width`

## Adicionar Novos Estilos

### Para Componente Existente

Edite `src/_sass/components/_componente.scss`:
```scss
.sidebar {
  // Novo estilo
  border-radius: 8px;
}
```

### Criar Novo Componente

1. Criar `src/_sass/components/_novo.scss`
2. Escrever estilos:
```scss
.novo-componente {
  padding: 1rem;
  background: var(--bg-primary);
}
```
3. Importar em `_components.scss`:
```scss
@import 'components/novo';
```

## Responsividade

Usar mixins predefinidos:

```scss
.component {
  display: none;
  
  @include tablet {
    display: block;
  }
  
  @include desktop {
    width: 80%;
  }
}
```

Mixins disponíveis:
- `@include phone` (< 768px)
- `@include tablet` (768px - 1023px)
- `@include desktop` (>= 1024px)

## Personalizar Tema

### Mudar Cores Principais

Edite `src/_sass/_variables.scss`:
```scss
$theme-primary: #6b46c1;    // Roxo
$theme-secondary: #805ad5;  // Roxo claro
```

### Mudar Fonte

```scss
$font-family-base: 'Inter', -apple-system, sans-serif;
```

Rebuild necessário:
```bash
make build
```
