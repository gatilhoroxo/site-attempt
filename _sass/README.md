# Estrutura SASS Modular

## 📁 Organização dos Arquivos

A estrutura SASS foi modularizada para facilitar a leitura, manutenção e evitar repetição de código.

```
_sass/
├── _variables.scss       # Variáveis CSS customizadas
├── _mixins.scss         # Mixins reutilizáveis
├── _base.scss           # Estilos base do site
├── _components.scss     # Arquivo de importação dos componentes
├── components/          # Componentes modulares
│   ├── _badges.scss
│   ├── _breadcrumb.scss
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _sidebar.scss
│   └── _tables.scss
└── layouts/             # Layouts de páginas específicas
    └── _projeto-page.scss
```

## 🎯 Arquivos Principais

### 1. `_variables.scss`
Define todas as variáveis CSS customizadas organizadas por categoria:
- **Cores**: Fundos, textos, destaques, bordas
- **Tabelas**: Cores específicas para tabelas
- **Espaçamentos**: Sistema de espaçamento consistente
- **Tipografia**: Tamanhos de fonte
- **Bordas**: Raios de borda
- **Dimensões**: Larguras e tamanhos

### 2. `_mixins.scss`
Mixins reutilizáveis para evitar repetição de código:

#### Transições e Animações
```scss
@include transition(all, 0.3s, ease);
@include fadeIn(0.5s);
```

#### Sombras
```scss
@include box-shadow(1);  // Níveis 1-5
```

#### Interatividade
```scss
@include hover-lift(-2px);
@include hover-scale(1.1);
```

#### Flexbox e Grid
```scss
@include flex-center;
@include flex-column;
@include grid-auto-fill(300px, 1fr, 1.5rem);
```

#### Componentes
```scss
@include button-primary;
@include card-base;
@include card-hover;
```

#### Responsividade
```scss
@include respond-to('desktop-large') { ... }
@include respond-to('tablet') { ... }
@include respond-to('mobile') { ... }
```

### 3. `_base.scss`
Estilos fundamentais do site:
- Layout geral (HTML, body)
- Header e navegação
- Tipografia
- Links
- Code blocks
- Footer
- Media queries responsivas

### 4. `_components.scss`
Arquivo central que importa todos os componentes modulares.

## 📦 Componentes Modulares

### `components/_badges.scss`
- Badges genéricos

### `components/_buttons.scss`
- Botões de ação (datasheet, etc)
- Botões de ícone
- Toggle de tema

### `components/_tables.scss`
- Tabelas de componentes
- Estilos responsivos

### `components/_sidebar.scss`
- Barra lateral de ícones
- Navegação lateral
- Toggle de sidebar
- Elementos details/summary
- Comportamento responsivo

### `components/_breadcrumb.scss`
- Navegação breadcrumb
- Separadores
- Estados (atual, hover)

## 📱 Layouts

### `layouts/_projeto-page.scss`
Layout para páginas de projeto:
- Meta informações
- Animações

## 🔧 Como Usar

### Ordem de Importação
O arquivo `base/assets/css/style.scss` importa os módulos na ordem correta:

```scss
@import "variables";   // 1. Variáveis primeiro
@import "mixins";      // 2. Mixins
@import "base";        // 3. Estilos base
@import "components";  // 4. Componentes
```

### Usando Variáveis
```scss
.meu-elemento {
    color: var(--accent);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-xl);
}
```

### Usando Mixins
```scss
.meu-botao {
    @include button-primary;
}

.meu-card {
    @include card-base;
    @include card-hover;
}

@include respond-to('tablet') {
    .meu-elemento {
        font-size: var(--font-size-sm);
    }
}
```

## ✨ Benefícios da Modularização

1. **Manutenibilidade**: Cada componente em seu próprio arquivo
2. **Reusabilidade**: Mixins evitam duplicação de código
3. **Consistência**: Variáveis garantem design uniforme
4. **Organização**: Estrutura clara e intuitiva
5. **Performance**: Código mais limpo e otimizado
6. **Escalabilidade**: Fácil adicionar novos componentes

## 🚀 Adicionando Novos Componentes

1. Crie um novo arquivo em `_sass/components/_seu-componente.scss`
2. Desenvolva o componente usando variáveis e mixins
3. Importe no `_sass/_components.scss`:
   ```scss
   @import 'components/seu-componente';
   ```

## 📝 Boas Práticas

- Use variáveis CSS para valores que se repetem
- Prefira mixins para padrões repetitivos
- Mantenha componentes pequenos e focados
- Documente código complexo com comentários
- Siga a convenção de nomenclatura BEM quando apropriado
- Use os mixins de responsividade para media queries

## 🎨 Personalização de Tema

Para personalizar cores e estilos, edite `_sass/_variables.scss`:
- Modo escuro: `:root { ... }`
- Modo claro: `[data-theme="light"] { ... }`
