# Guia de Componentes

## Componentes Globais

### nav.html
**Propósito**: Menu de navegação principal  
**Localização**: `src/_includes/nav.html`  
**Uso**: Incluído automaticamente em default.html

### sidebar.html
**Propósito**: Barra lateral com navegação contextual  
**Funcionalidades**: Busca, lista de páginas, links de repositórios

### topbar.html
**Propósito**: Barra superior com controles  
**Funcionalidades**: Toggle tema, controle fonte, breadcrumb

## Componentes Default

### default/head-default.html
**Conteúdo**:
- Meta tags (charset, viewport)
- Links CSS
- Favicons
- jekyll-seo-tag

### default/header-default.html
**Conteúdo**: Cabeçalho da página

### default/footer-default.html
**Conteúdo**: Rodapé com copyright

### default/scripts-default.html
**Conteúdo**: Scripts JavaScript antes de `</body>`

## Scripts/Features

### scripts/theme-switcher.html
**Funcionalidade**: Toggle entre tema claro/escuro  
**Persistência**: localStorage  
**Uso**:
```md
<!--
{% include scripts/theme-switcher.html %}
-->
```

### scripts/font-size-control.html
**Funcionalidade**: Botões +/- para ajustar fonte  
**Persistência**: localStorage

### scripts/breadcrumb.html
**Funcionalidade**: Gera breadcrumbs dinâmicos  
**Configuração**: `src/_data/breadcrumb_config.yml`

### scripts/sidebar/search.html
**Funcionalidade**: Busca client-side  
**Dados**: `src/assets/json/search-index.json`

### scripts/sidebar/pasta-listing.html
**Funcionalidade**: Lista páginas de uma seção

## Usar Componente

```liquid
{% raw %}
<!-- Sintaxe básica -->
{% include nav.html %}

<!-- Com parâmetros -->
{% include componente.html title="Título" %}

<!-- Acessar parâmetro dentro do include -->
<h1>{{ include.title }}</h1>
{% endraw %}
```

## Criar Novo Componente

1. Criar `src/_includes/novo-componente.html`
2. Adicionar estilos em `src/_sass/components/_novo.scss`
3. Importar em `src/_sass/_components.scss`:
```scss
@import 'components/novo';
```
4. Usar com `{{ "{% include novo-componente.html " }}%}`
