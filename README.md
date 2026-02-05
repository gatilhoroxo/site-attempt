---
layout: default
title: README
---

# 🌐 site-template

Making my on site template.
Site estático com documentação web do projeto.

---

## 📑 Índice

1. [📂 Estrutura](#-estrutura)
2. [🎯 Propósito](#-propósito)
3. [🚀 Como Visualizar](#-como-visualizar)
4. [🔗 Fonte do Conteúdo](#-fonte-do-conteúdo)

---

## 📂 Estrutura

```
site-attempt/
├── _config.yml              # Configuração do Jekyll
├── Gemfile                  # Dependências Ruby
├── index.md                 # Página inicial
├── _data/                   # Dados estruturados
│   ├── breadcrumb_config.yml    # Configuração do breadcrumb
│   └── repositories.yml         # Configuração de repositórios
├── _includes/               # Componentes reutilizáveis (ver _includes/README.md)
│   ├── breadcrumb-icon.html
│   ├── nav.html
│   ├── sidebar.html
│   ├── topbar.html
│   ├── default/                 # Head, header, footer, scripts
│   └── scripts/                 # Scripts (breadcrumb, tema, fonte, listagens, sidebar)
├── _layouts/                # Templates de página (ver _layouts/README.md)
│   ├── default.html
│   ├── post.html
│   ├── diario.html
│   ├── pasta.html
│   └── gatilho.html
├── _sass/                   # Estilos SCSS modulares (ver _sass/README.md)
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _base.scss
│   ├── _components.scss
│   ├── components/              # Badges, buttons, breadcrumb, sidebar, topbar, etc
│   ├── layouts/                 # Diário, pasta, projeto
│   └── screens/                 # Desktop, tablet, phone
├── assets/
│   ├── css/style.scss           # CSS principal
│   ├── images/                  # Imagens e favicons
│   └── json/                    # Dados JSON (search-index)
├── gatilhos/                # Documentação de aprendizado
│   ├── conceitos-fundamentais/
│   ├── diario-de-aprendizado/
│   ├── ferramentas/
│   ├── roadmaps/
│   └── templates/
├── posts/                   # Posts e artigos
├── projects/                # Projetos
│   └── mc-journey/
└── docs/                    # Documentação adicional
```

> **Nota:** Consulte os READMEs específicos em cada pasta (`_sass/`, `_layouts/`, `_includes/`) para detalhes da organização interna.

## 🎯 Propósito

Site web navegável da documentação de algum repositório usando **Jekyll** e **GitHub Pages**, ideal para:
- Navegação visual mais amigável
- Compartilhamento fácil via URL
- Acesso rápido via navegador
- Apresentação de projetos com formatação consistente
- Documentação técnica com syntax highlighting

## 🚀 Como Visualizar

### GitHub Pages (Produção)
Se hospedado no GitHub, acesse:
```
https://<seu-usuario>.github.io/<nome-do-repo>/
```

### Desenvolvimento Local (Recomendado)

#### Pré-requisitos
- Ruby >= 2.5.0
- Bundler
- Jekyll

#### Instalação (Ubuntu 24)
```bash
# Instalar Ruby e dependências
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev

# Configurar gems no diretório do usuário
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Instalar Bundler e Jekyll
gem install bundler jekyll
```

#### Executar localmente
```bash
# No diretório raiz do projeto
cd site-attempt/

# Instalar dependências (primeira vez)
bundle install

# Iniciar servidor de desenvolvimento
bundle exec jekyll serve

# Acessar em http://localhost:4000
```

#### Opções úteis
```bash
# Rodar em porta diferente
bundle exec jekyll serve --port 4001

# Reconstruir automaticamente ao editar
bundle exec jekyll serve --livereload

# Modo detalhado (debug)
bundle exec jekyll serve --verbose
```

## 🔗 Conteúdo

- **[gatilhos/](gatilhos/)** - Documentação de aprendizado
- **[posts/](posts/)** - Páginas e postagens
- **[projects/](projects/)** - Projetos

---

**Status:** Em Desenvolvimento

**Tecnologias:**
- Jekyll (gerador de sites estáticos)
- GitHub Pages (hospedagem)
- Kramdown (processador Markdown)
- SCSS modular (estilos)
- Liquid (templating)

**Funcionalidades:**
- ✅ Sistema de temas (Dark/Light mode com localStorage)
- ✅ Controle de tamanho de fonte (5 níveis)
- ✅ Navegação breadcrumb configurável
- ✅ Sidebar hierárquica com até 3 níveis
- ✅ Listagens automáticas (pastas e diários)
- ✅ Layouts reutilizáveis (default, post, pasta, diário, gatilho)
- ✅ SCSS modular com variáveis e mixins
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Syntax highlighting para código
- ✅ Markdown com GitHub Flavored Markdown

## 📚 Arquitetura

### Layouts Disponíveis
- **`default`** - Layout base com estrutura completa (sidebar, topbar, footer)
- **`post`** - Posts e artigos simples
- **`pasta`** - Páginas de coleção com listagem automática de subpastas
- **`diario`** - Diário de aprendizado com timeline de entradas
- **`gatilho`** - Conceitos e gatilhos de aprendizado

### Componentes Principais
- **Breadcrumb** - Navegação contextual configurável via YAML
- **Sidebar** - Navegação lateral hierárquica (até 3 níveis)
- **Topbar** - Barra superior com breadcrumb e controles (tema/fonte)
- **Scripts** - Listagens automáticas, controle de tema e fonte

### Sistema de Estilosvia `_data/breadcrumb_config.yml`
- **Sidebar** - Navegação hierárquica com 3 modos (navegação, repositórios, busca)
- **Topbar** - Barra superior com breadcrumb e controles
- **Scripts** - Listagens automáticas, tema, fonte, gerenciamento de estado

### Sistema de Estilos
- **Variáveis** - Cores, espaçamentos, tipografia (`_variables.scss`)
- **Mixins** - Transições, sombras, flexbox, responsividade (`_mixins.scss`)
- **Componentes** - Badges, botões, breadcrumb, sidebar, topbar, tabelas, scrollbar
- **Layouts** - Diário, pasta, projeto (`_sass/layouts/`)
- **Responsividade** - Desktop, tablet, phone (`_sass/screens/`)
```scss
:root { 
  --accent: #your-color;
  --background: #your-bg;
}
```

### Configurar Breadcrumb
Edite `_data/breadcrumb_config.yml`:
```yaml
sections:
  sua-secao:
    label: "Sua Seção"
    icon_type: "emoji"
    emoji: "📌"
```

### Adicionar Nova Página
1. Crie `sua-pagina.md`
2. Adicione front matter:
   ```yaml
   ---
   layout: post
   title: Sua Página
   ---
   ```
3. Escreva conteúdo em Markdown

## 🔧 Desenvolvimento

### Estrutura de ArquivosHTML (ver [_includes/README.md](_includes/README.md))
- `_layouts/` - Templates de página (ver [_layouts/README.md](_layouts/README.md))
- `_sass/` - Estilos SCSS (ver [_sass/README.md](_sass/README.md))
- `_data/` - Configurações YAML (breadcrumb, repositórios)
- `assets/` - CSS, imagens, JSON

### Convenções
- `layout: pasta` - Páginas índice com listagem automática
- `layout: diario` - Páginas de diário com timeline
- `layout: gatilho` - Conceitos e gatilhos
- Prefira variáveis CSS e mixins SCSS
- Mantenha componentes modulare
- Mantenha componentes modulares e focados

---

## Inspirações e Referências

### Projetos
- [Hacker - Jekyll Theme](https://github.com/pages-themes/hacker) - Estrutura base e aparência

### Tecnologias
- **Jekyll** - Gerador de sites estáticos
- **Liquid** - Template engine
- **SCSS** - Pré-processador CSS modular
- **GitHub Pages** - Hospedagem gratuita
- ...
- Nome da tecnologia - Como influenciou o desenvolvimento
- Ferramenta - Propósito no projeto

### Agradecimentos
Agradecimentos especiais ao próprio github por disponibilizar essa chance de visualizar um site próprio e poder personalizar completamente como eu quero. 
