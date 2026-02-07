# Início Rápido

## Comandos Essenciais

### Desenvolvimento
```bash
make dev          # Servidor com live reload
make build        # Build de produção
make clean        # Limpar arquivos gerados
make test-build   # Testar build
```

### Manualmente
```bash
bundle exec jekyll serve   # Desenvolvimento
bundle exec jekyll build   # Build
```

## Criar Novo Conteúdo

### Post
```bash
# 1. Criar arquivo em content/posts/
touch content/posts/meu-post.md

# 2. Adicionar front matter
---
layout: post
title: "Meu Primeiro Post"
date: 2026-02-06
---

# Conteúdo

Texto do post em Markdown...
```

URL gerada: `/posts/meu-post/`

### Gatilho (Documentação)
```bash
# Criar em content/gatilhos/
---
layout: gatilho
title: "Novo Conceito"
---

## Explicação

Documentação do conceito...
```

### Página Index
```bash
# content/nova-secao/index.md
---
layout: pasta
title: "Nova Seção"
permalink: /nova-secao/
---

Esta seção contém...
```

## Personalização Básica

### Mudar Cores do Tema
Edite `src/_sass/_variables.scss`:
```scss
$theme-primary: #6b46c1;
$theme-secondary: #805ad5;
```

### Adicionar Link no Menu
Edite `src/_includes/nav.html`:
```html
<a href="/nova-secao/">Nova Seção</a>
```

### Modificar Layout
Edite layouts em `src/_layouts/`

## Workflow Diário

1. **Iniciar servidor**: `make dev`
2. **Criar conteúdo**: Editar arquivos .md em `content/`
3. **Ver mudanças**: Salvar recarrega automaticamente
4. **Commit**: Quando satisfeito
