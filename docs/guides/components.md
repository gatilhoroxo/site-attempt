---
title: Guia de Componentes
---

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

## Navegação Dinâmica da Sidebar

A navegação da sidebar é gerada automaticamente a partir de `src/_data/navigation.yml`.

### Adicionar Nova Seção

Edite `src/_data/navigation.yml`:

```yaml
sections:
  - name: "Nome da Seção"
    path: "pasta-dentro-de-content"
    max_depth: 2
    sort_by: "title"  # ou "date" ou "name"
```

- **name**: Título exibido na sidebar
- **path**: Pasta dentro de `content/` (sem o prefixo content/)
- **max_depth**: Níveis de profundidade (1-3), onde 1 = apenas arquivos raiz
- **sort_by**: `title` (alfabético), `date` (cronológico), ou `name` (por filename)

### Comportamento

- Arquivos são listados **antes** de subpastas
- Seções vazias são automaticamente ocultadas
- Página atual recebe highlight com classe `.active`
- `index.md` de cada pasta é ignorado (evita duplicação)

### Processamento

O plugin `src/_plugins/navigation_generator.rb` processa a árvore no build e salva em `site.data.navigation_tree`. A renderização usa `src/_includes/scripts/sidebar/navigation-tree.html` (recursivo).

## Criar Novo Componente

1. Criar `src/_includes/novo-componente.html`
2. Adicionar estilos em `src/_sass/components/_novo.scss`
3. Importar em `src/_sass/_components.scss`:
```scss
@import 'components/novo';
```
4. Usar com `{{ "{% include novo-componente.html " }}%}`
