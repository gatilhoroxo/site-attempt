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

```

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
# No diretório docs/
cd docs/

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

## 🔗 Fonte do Conteúdo

O conteúdo aqui é gerado/inspirado em:
- **[gatilhos/](gatilhos/)** - Documentação de aprendizado
- **[posts/](posts/)** - Páginas e postagens

---

**Status:** Em

**Tecnologias:**
- Jekyll (gerador de sites estáticos)
- GitHub Pages (hospedagem)
- Kramdown (processador Markdown)
- SCSS modular (estilos)
- Liquid (templating)

**Funcionalidades:**
- ✅ Sistema de temas (Dark/Light mode)
- ✅ Syntax highlighting para código
- ✅ Navegação responsiva
- ✅ Layouts reutilizáveis
- ✅ Markdown com GitHub Flavored Markdown

**Melhorias futuras:**
- Geração automática de índice de projetos
- Sistema de busca integrado
- Breadcrumbs para navegação
- Integração com coleção `_projetos`

## Inspirações e Referências

Este projeto foi inspirado e influenciado por:

### Projetos
- [Hacker - Jekyll Theme](https://github.com/pages-themes/hacker) - Sua estrutura do site e a aparência

### Pessoas
- **Nome** - Contribuição ou ensinamento relevante
- **Nome** - Link para trabalho/perfil

### Recursos e Tutoriais
- [Tutorial/Artigo](link) - O que aprendeu
- [Documentação](link) - Conceito aplicado

### Tecnologias e Ferramentas
- Nome da tecnologia - Como influenciou o desenvolvimento
- Ferramenta - Propósito no projeto

### Agradecimentos
Agradecimentos especiais a...
