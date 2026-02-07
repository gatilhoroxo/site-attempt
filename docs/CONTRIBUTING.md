# Como Contribuir

## Adicionar Novo Layout
1. Criar arquivo em `_layouts/`
2. Documentar em `_layouts/README.md`
3. Adicionar exemplo de uso

## Adicionar Componente SCSS
1. Criar em `_sass/components/`
2. Importar em `_sass/_components.scss`
3. Documentar variáveis usadas

## Componentização

- Separar lógica de apresentação
```md
<!-- Em vez de misturar no layout -->
{% include scripts/sidebar/sidebar-state-manager.html %}

<!-- Criar componentes atômicos -->
{% include components/button.html text="Clique" class="primary" %}
```
