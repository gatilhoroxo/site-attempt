---
title: Architecture
---

# Arquitetura do Sistema

Este documento descreve a arquitetura técnica do site estático construído com 
Jekyll, incluindo estrutura de diretórios, fluxo de build, hierarquia de 
componentes e decisões técnicas principais.

## Visão Geral do Sistema

### Tipo de Projeto

**Site estático gerado com Jekyll** hospedado no GitHub Pages. O Jekyll processa 
templates Liquid, Markdown e SCSS para gerar HTML/CSS/JS estáticos que são 
servidos sem necessidade de servidor backend.

### Tecnologias Principais

- **Jekyll 3.10**: Gerador de sites estáticos
- **Liquid**: Template engine
- **Kramdown**: Processador Markdown com GFM
- **SCSS**: Preprocessador CSS
- **Rouge**: Syntax highlighter
- **GitHub Pages**: Hospedagem e deploy automatizado

### Filosofia Arquitetural

1. **Separação de Concerns**: Código (src/) separado de conteúdo (content/)
2. **Modularidade**: Componentes pequenos e reutilizáveis
3. **Progressive Enhancement**: Funcionalidades básicas sem JavaScript
4. **Mobile-First**: Design responsivo começando pelo mobile
5. **Acessibilidade**: WCAG 2.1 AA como objetivo

## Estrutura de Diretórios

### Organização Principal

```
site-attempt/
├── src/                      # Todo código-fonte Jekyll
│   ├── _layouts/            # Templates de página
│   ├── _includes/           # Componentes reutilizáveis
│   ├── _sass/              # Estilos SCSS modulares
│   ├── _data/              # Arquivos de dados YAML
│   └── assets/             # CSS, imagens, JSON
├── content/                 # Todo o conteúdo do site
│   ├── gatilhos/           # Documentação de aprendizado
│   ├── posts/              # Artigos e posts
│   └── projects/           # Projetos documentados
├── docs/                    # Documentação técnica
├── .github/                 # Workflows e templates
├── _config.yml             # Configuração Jekyll
├── Gemfile                 # Dependências Ruby
└── assets -> src/assets    # Symlink para build
```

### Decisões de Organização

**Por que `src/` e `content/`?**
- Separação clara entre código e conteúdo
- Facilita contribuições de não-desenvolvedores
- Melhora velocidade de build do Jekyll

**Por que symlink para `assets/`?**
Jekyll espera assets na raiz. O symlink mantém organização em `src/assets/` 
enquanto Jekyll encontra em `assets/`.

## Fluxo de Build Jekyll

```
1. _config.yml → Configuração (diretórios customizados)
2. content/** → Markdown processado → HTML
3. Layouts aplicados (default → post → gatilho)
4. SCSS compilado (src/_sass → _site/assets/css)
5. Assets copiados (imagens, JSON)
6. Plugins executados (feed, sitemap, SEO)
7. _site/ → Site estático final
```

### Configuração de URLs

Arquivos em `content/posts/` são servidos como `/posts/` (sem "content/"):

```yaml
# _config.yml
defaults:
  - scope:
      path: "content/posts"
    values:
      permalink: /posts/:title/
```

## Hierarquia de Layouts

```
default.html (base)
├─> Estrutura HTML, inclui header/footer
├─> Define grid e containers
└─> Fornece {{ content }}

  post.html (herda default)
  ├─> Adiciona metadata (título, data)
  └─> Formata artigos

    gatilho.html (herda post)
    ├─> Badges específicos
    └─> Navegação contextual

  diario.html (herda default)
  └─> Layout timeline

  pasta.html (herda default)
  └─> Lista subpáginas automaticamente
```

## Componentes Principais

### Includes Essenciais

**default/head-default.html** - Meta tags, CSS, favicons  
**topbar.html** - Controles (tema, fonte), breadcrumb  
**nav.html** - Menu principal  
**sidebar.html** - Navegação contextual, busca  
**scripts/theme-switcher.html** - Toggle claro/escuro  
**scripts/breadcrumb.html** - Geração dinâmica de breadcrumbs

### Sistema de Dados

**src/_data/repositories.yml** - Configuração de projetos externos  
**src/_data/breadcrumb_config.yml** - Configuração de navegação

## Arquitetura SCSS

### Estrutura Modular

```scss
// assets/css/style.scss
@import "variables";  // Variáveis (cores, espaçamentos)
@import "mixins";     // Mixins reutilizáveis
@import "base";       // Estilos base (html, body)
@import "components"; // Importa todos componentes
```

### Sistema de Temas

Usa CSS variables para permitir toggle dinâmico:

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

JavaScript altera `[data-theme]` e localStorage persiste escolha.

### Responsividade

Mobile-first com mixins para breakpoints:

```scss
@mixin tablet {
  @media (min-width: 768px) { @content; }
}

.sidebar {
  display: none;
  @include tablet { display: block; }
}
```

## Decisões Técnicas

### 1. Por que Jekyll?

**Prós**: GitHub Pages nativo, maduro, sem banco de dados  
**Contras**: Build time cresce, menos poderoso que frameworks modernos  
**Escolha**: Ideal para projeto de aprendizado e documentação estática

### 2. Estrutura src/ + content/

Facilita manutenção e permite contribuições de conteúdo sem mexer em código.

### 3. Permalinks sem "content/"

URLs limpas (/posts/ não /content/posts/) são melhores para SEO e UX.

### 4. Busca Client-Side

JSON local + JavaScript é simples e não requer serviços externos.

### 5. Tema com CSS Variables

Permite toggle dinâmico sem rebuild, melhor UX que SCSS puro.

## Fluxo de Dados

```
Markdown (content/*) + Front Matter
  ↓
Jekyll processa com Kramdown
  ↓
Aplica layout definido
  ↓
Acessa dados (site.data.*, page.*, site.*)
  ↓
Gera HTML final em _site/
```

Busca usa JSON gerado em build:
```
Loop site.pages → Extrai title/url/content → JSON → JavaScript
```

## Performance

### Otimizações
- CSS comprimido em produção
- Imagens otimizadas (< 50KB)
- JavaScript inline mínimo
- Sem dependências JS externas

### Métricas Alvo
- First Contentful Paint: < 1s
- Total Bundle: < 500KB

## Segurança

- Dependências auditadas (bundler-audit)
- Secrets nunca commitados
- XSS: Sanitização em JavaScript
- Superfície reduzida (site estático, sem backend)

## Extensibilidade

### Adicionar Layout
1. Criar `src/_layouts/novo.html`
2. Estilos em `src/_sass/layouts/_novo.scss`
3. Documentar em guides/

### Adicionar Seção
1. Criar `content/nova-secao/`
2. Configurar defaults em `_config.yml`
3. Atualizar navegação

### Adicionar Componente
1. Criar `src/_includes/componente.html`
2. Estilos em `src/_sass/components/_componente.scss`
3. Importar em `_components.scss`

## Limitações

1. Build time cresce com páginas
2. Busca só em português
3. Apenas 2 temas (claro/escuro)
4. Sem i18n
5. Sem comentários (estático)

## Roadmap

- [ ] Migrar Jekyll 4.x
- [ ] CSS minification
- [ ] Testes acessibilidade
- [ ] Lazy loading imagens
- [ ] Service Worker offline

---

**Última atualização**: Fevereiro de 2026

