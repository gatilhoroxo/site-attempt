# Arquitetura do Sistema

## Fluxo de Dados

- Páginas: Markdown
- Layout: html + liquid
- Includes: Componentes
- SCSS: Estilos
- CSS: compilado
- Plugins: ...

### Ordem de processamento do Jekyll

...

### Caminho dos dados entre as pastas

_data, _includes, _layouts
...

## Convenções de Nomenclatura

- Layouts: `nome-do-layout.html`
- Componentes: `nome-componente.html`
- SCSS: `_nome-arquivo.scss`
- Classes CSS: `.nome-classe` (kebab-case)


## Componentes

Diagrama de Componentes
```md
┌───────────────────────────────────┐
│  Page (.md)                       │
│  ├─ Front Matter (YAML)           │
│  └─ Markdown Content              │
└──────────────┬────────────────────┘
               │
               ▼
┌───────────────────────────────────┐
│  Layout (default.html)            │
│  ├─ {% include topbar.html %}     │
│  ├─ {% include sidebar.html %}    │
│  └─ {{ content }}                 │
└──────────────┬────────────────────┘
               │
               ▼
          [CSS + JS]
```

### Componentes críticos

sidebar
topbar
header

### Hierarquia de layouts

- Default: base
- Pasta: depende de default
- Post: depende de default
- Diario: depende de default
- Gatilho: depende de post

## Estruturas de Dados

... 
breadcrumb_config.yml e repositores.yml

## Sistema de Estilos

```css
style.scss
├─ _variables.scss
├─ _mixins.scss
├─ _base.scss
├─ _components.scss
├─ components/*.scss
├─ layouts/*.scss
└─ screens/*.scss
```

