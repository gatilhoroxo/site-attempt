---
title: Guia de Instalação
---

# Guia de Instalação

## Pré-requisitos

### Sistemas Suportados
- Linux (Ubuntu, Debian, Fedora, Arch)
- macOS
- Windows (via WSL2 recomendado)

### Dependências Necessárias

**Ruby** (>= 2.7)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ruby-full build-essential zlib1g-dev

# macOS (via Homebrew)
brew install ruby

# Verificar versão
ruby --version
```

**Bundler**
```bash
gem install bundler
bundler --version
```

**Git**
```bash
# Ubuntu/Debian
sudo apt install git

# macOS
brew install git
```

## Instalação do Projeto

### 1. Clonar Repositório

```bash
git clone https://github.com/gatilhoroxo/site-attempt.git
cd site-attempt
```

### 2. Instalar Dependências

```bash
# Instalar gems do Gemfile
bundle install

# Se houver erro de permissões
bundle install --path vendor/bundle
```

### 3. Primeira Execução

```bash
# Build inicial
bundle exec jekyll build

# Servidor de desenvolvimento
bundle exec jekyll serve

# Ou usando Makefile
make dev
```

Acesse: `http://localhost:4000/site-attempt/`

## Resolução de Problemas Comuns

### Erro: "cannot load such file -- webrick"
```bash
bundle add webrick
```

### Erro: "Permission denied - bind(2)"
Porta 4000 em uso:
```bash
bundle exec jekyll serve --port 4001
```

### Erro: "Bundler::GemNotFound"
```bash
bundle update
bundle install
```

## Configuração Opcional

### Editor Config
Instale plugin .editorconfig no seu editor para formatação automática.

### Live Reload
```bash
# Já incluído em make dev
bundle exec jekyll serve --livereload
```
