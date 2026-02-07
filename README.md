# Template de Site Pessoal

Um site estático construído com Jekyll para documentação de projetos de aprendizado, 
com foco em microcontroladores e programação. Este repositório serve como um espaço 
de experimentação e aprendizado sobre desenvolvimento web, Jekyll e boas práticas 
de documentação.

## 🎯 Sobre o Projeto

Este site foi criado como um projeto de aprendizado pessoal para:

- Documentar a jornada de aprendizado em programação e eletrônica
- Experimentar com Jekyll e geração de sites estáticos
- Praticar organização de documentação técnica
- Criar um espaço centralizado para projetos e referências
- Aprender boas práticas de desenvolvimento web

## 🚀 Início Rápido

### Pré-requisitos

- Ruby 2.7 ou superior
- Bundler
- Jekyll 3.x ou superior
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gatilhoroxo/site-attempt.git
cd site-attempt

# Instale as dependências
bundle install

# Execute o servidor de desenvolvimento
bundle exec jekyll serve

# Ou use o Makefile
make dev
```

O site estará disponível em `http://localhost:4000/site-attempt/`

## 📁 Estrutura do Repositório

```
site-attempt/
├── src/                      # Código-fonte Jekyll
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
│   ├── getting-started/    # Guias de início
│   ├── guides/             # Guias de uso
│   ├── ARCHITECTURE.md     # Arquitetura do sistema
│   └── CONVENTIONS.md      # Convenções de código
├── .github/                 # Workflows e templates
│   ├── workflows/          # GitHub Actions
│   └── ISSUE_TEMPLATE/     # Templates de issues
├── _config.yml             # Configuração Jekyll
├── Gemfile                 # Dependências Ruby
├── Makefile               # Comandos comuns
└── README.md              # Este arquivo
```

### Diretórios Principais

**`src/`** - Contém todo o código Jekyll (layouts, includes, SCSS, dados)  
**`content/`** - Contém todo o conteúdo markdown organizado por tipo  
**`docs/`** - Documentação técnica sobre o projeto e como contribuir  
**`.github/`** - Automações e templates do GitHub

## 🎨 Funcionalidades

- **Tema Claro/Escuro**: Alternância entre temas com persistência local
- **Controle de Tamanho de Fonte**: Ajuste de tamanho de texto para acessibilidade
- **Navegação Dinâmica**: Sidebar e breadcrumbs gerados automaticamente
- **Busca de Conteúdo**: Busca client-side usando JSON
- **Responsivo**: Design adaptado para desktop, tablet e mobile
- **Syntax Highlighting**: Destaque de código com Rouge
- **RSS Feed**: Feed automático de posts
- **SEO Otimizado**: Meta tags e sitemap automáticos

## 📖 Como Usar

### Criar Novo Conteúdo

Dentro da Pasta Content

#### Post
```markdown
# Criar arquivo em content/posts/
---
layout: post
title: "Meu Novo Post"
---

Conteúdo do post aqui...
```

#### Gatilho (Documentação de Aprendizado)
```markdown
# Criar arquivo em content/gatilhos/
---
layout: gatilho
title: "Novo Conceito"
---

Documentação do conceito...
```

### Personalizar Tema

Edite as variáveis em [src/_sass/_variables.scss](src/_sass/_variables.scss):

```scss
// Cores do tema
$theme-primary: #6b46c1;
$theme-background-light: #ffffff;
$theme-background-dark: #1a1a1a;
```

### Comandos Disponíveis

```bash
make dev          # Servidor de desenvolvimento com live reload
make build        # Build de produção
make test-build   # Testar build sem erros
make test-links   # Verificar links quebrados
make clean        # Limpar arquivos gerados
```

## 🤝 Como Contribuir

Contribuições são bem-vindas! Este é um projeto de aprendizado, então feedbacks e 
sugestões são especialmente valiosos.

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes detalhadas.

## 📚 Documentação

- [Guia de Instalação](docs/getting-started/installation.md)
- [Início Rápido](docs/getting-started/quick-start.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Convenções](docs/CONVENTIONS.md)
- [Guia de Layouts](docs/guides/layouts.md)
- [Guia de Componentes](docs/guides/components.md)
- [Guia de Estilos](docs/guides/styling.md)

## 🔒 Segurança

Para reportar vulnerabilidades de segurança, veja [SECURITY.md](SECURITY.md).

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) 
para detalhes.

## 🙏 Agradecimentos

- **Jekyll** - Framework de geração de sites estáticos
- **GitHub Pages** - Hospedagem gratuita
- **Comunidade Open Source** - Por todo conhecimento compartilhado

## 📞 Contato

- **GitHub**: [@gatilhoroxo](https://github.com/gatilhoroxo)
- **Issues**: [GitHub Issues](https://github.com/gatilhoroxo/site-attempt/issues)
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
