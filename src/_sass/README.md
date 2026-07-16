# Estrutura SASS

Organização modular dos estilos do site.

## 📁 Estrutura

```
_sass/
├── _variables.scss      # Variáveis CSS (cores, espaçamentos, tipografia)
├── _mixins.scss        # Funções reutilizáveis
├── _base.scss          # Estilos base (HTML, body, header, footer)
├── _components.scss    # Importa todos os componentes
├── components/
│   ├── _badges.scss, _breadcrumb.scss, _buttons.scss
│   ├── _scrollbar.scss, _sidebar.scss, _text.scss, _topbar.scss
│   ├── sidebar/        # _base, _buttons, _navigation, _repositories, _search
│   └── text/           # _blockcode, _blockquote, _details, _syntax, _tables
├── layouts/            # _diario, _pasta, _projeto-page
└── screens/            # _desktop, _tablet, _phone
```

## 🎯 Componentes Principais

### Text (`text/`)
- **`_blockcode.scss`** - Blocos de código com tema escuro fixo (largura 80%)
- **`_blockquote.scss`** - Citações estilizadas
- **`_details.scss`** - Elementos colapsáveis (largura 60%)
- **`_syntax.scss`** - Syntax highlighting (monokai.sublime adaptado)
- **`_tables.scss`** - Tabelas responsivas

### Sidebar (`sidebar/`)
- **`_navigation.scss`** - Navegação com expansão
- **`_repositories.scss`** - Lista de repositórios
- **`_search.scss`** - Busca no site

## 🔧 Uso

### Ordem de Importação
```scss
@import "variables";   // 1. Variáveis
@import "mixins";      // 2. Mixins
@import "base";        // 3. Base
@import "components";  // 4. Componentes
```

### Exemplos
```scss
.elemento {
    color: var(--accent);
    padding: var(--spacing-md);
    @include border-radius(var(--radius-lg));
}

@include respond-to('tablet') {
    .elemento { font-size: var(--font-size-sm); }
}
```

## 🎨 Temas

**Modo Escuro (`:root`):**
- `--bg: #1a1625` (roxo escuro)
- `--accent: #d4c8e6` (lavanda)
- `--text: #f5f3f9` (branco suave)

**Modo Claro (`[data-theme="light"]`):**
- `--bg: #d6c4eb` (lavanda claro)
- `--accent: #4a1d6b` (roxo escuro)
- `--text: #1a0f28` (roxo quase preto)

### Blocos de Código - Sempre Escuro
**Localização:** [_sass/components/text/_blockcode.scss](_sass/components/text/_blockcode.scss)

Blocos de código mantêm tema escuro em ambos os modos (escuro/claro):
- Fundo: `#211a2e` (roxo escuro)
- Texto: `#ffffff` (branco)
- Bordas: `#3d3451` (roxo acinzentado)
- Largura: 80% do container
- Números de linha habilitados

Para alterar cores dos blocos de código, edite a seção "FORÇAR TEMA ESCURO" em `_blockcode.scss`.

## 🎨 Syntax Highlighting

Tema **monokai.sublime** adaptado com fundo roxo (`#211a2e`).

Atualizar tema:
```bash
rougify style <tema> > _sass/components/text/_syntax.scss
sed -i 's/#272822/#211a2e/g' _sass/components/text/_syntax.scss
```

## 🚀 Adicionar Componente

1. Criar `_sass/components/_seu-componente.scss`
2. Usar variáveis (`var(--*)`) e mixins (`@include`)
3. Importar em `_sass/_components.scss`:
   ```scss
   @import 'components/seu-componente';
   ```

## 📏 Dimensões Customizadas

| Elemento | Largura | Observação |
|----------|---------|------------|
| Code blocks | 80% | Tema escuro fixo |
| Details | 60% | Colapsável com seta animada |
| Tabelas | 100% | Responsivas |

## ✨ Benefícios

- **Manutenibilidade** - Componentes isolados
- **Reusabilidade** - Mixins evitam duplicação
- **Consistência** - Variáveis garantem uniformidade
- **Temas** - Dark/light mode via variáveis CSS
- **Escalabilidade** - Fácil adicionar componentes

---

**Última atualização:** Fevereiro 2026
