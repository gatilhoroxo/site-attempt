# Guia de Contribuição

Obrigado por considerar contribuir para este projeto! Este é um projeto de 
aprendizado e todas as contribuições são bem-vindas, desde correções de typos 
até novas funcionalidades.

## 📋 Índice

1. [Como Posso Contribuir?](#como-posso-contribuir)
2. [Processo de Desenvolvimento](#processo-de-desenvolvimento)
3. [Padrões de Código](#padrões-de-código)
4. [Processo de Pull Request](#processo-de-pull-request)
5. [Como Testar](#como-testar)
6. [Convenções de Commit](#convenções-de-commit)

## Como Posso Contribuir?

### Reportar Bugs

Antes de criar um report de bug:
- Verifique se já não existe uma issue sobre o mesmo problema
- Teste com a versão mais recente do projeto
- Colete informações sobre o ambiente (sistema operacional, versão do Ruby, etc.)

Ao criar um report de bug, inclua:
- Descrição clara e concisa do problema
- Passos para reproduzir o comportamento
- Comportamento esperado vs comportamento atual
- Screenshots se aplicável
- Informações do ambiente

### Sugerir Melhorias

Sugestões de melhorias são sempre bem-vindas! Para sugerir:

1. Abra uma issue com a tag `enhancement`
2. Descreva claramente a melhoria proposta
3. Explique por que esta melhoria seria útil
4. Considere possíveis alternativas

### Contribuir com Código

Áreas onde contribuições são especialmente úteis:

- **Documentação**: Melhorar guias, adicionar exemplos, corrigir erros
- **Testes**: Adicionar testes de build, verificação de links
- **Acessibilidade**: Melhorar contraste, navegação por teclado, ARIA labels
- **Performance**: Otimizar CSS, reduzir tamanho de assets
- **Novos Componentes**: Criar includes reutilizáveis
- **Layouts**: Criar novos layouts para tipos de conteúdo

## Processo de Desenvolvimento

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork localmente
git clone https://github.com/SEU-USUARIO/site-attempt.git
cd site-attempt

# Adicione o repositório original como remote
git remote add upstream https://github.com/gatilhoroxo/site-attempt.git
```

### 2. Configure o Ambiente

```bash
# Instale as dependências
bundle install

# Teste se funciona
bundle exec jekyll serve
```

### 3. Crie uma Branch

```bash
# Atualize main com o upstream
git checkout main
git pull upstream main

# Crie uma branch descritiva
git checkout -b feature/minha-feature
# ou
git checkout -b fix/correcao-bug
# ou
git checkout -b docs/melhoria-documentacao
```

### 4. Faça Suas Mudanças

- Escreva código claro e bem comentado
- Siga as convenções de código do projeto
- Teste suas mudanças localmente
- Mantenha commits atômicos e bem descritos

### 5. Teste Localmente

```bash
# Build do projeto
make test-build

# Teste links (se html-proofer estiver instalado)
make test-links

# Servidor de desenvolvimento
make dev
```

### 6. Commit e Push

```bash
# Add suas mudanças
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona componente de navegação"

# Push para seu fork
git push origin feature/minha-feature
```

### 7. Abra um Pull Request

- Vá para o repositório original no GitHub
- Clique em "New Pull Request"
- Selecione sua branch
- Preencha o template de PR
- Aguarde revisão

## Padrões de Código

### Estrutura de Arquivos

```
src/               # Todo código Jekyll
  _layouts/        # Apenas templates
  _includes/       # Apenas componentes
  _sass/          # Apenas estilos
  _data/          # Apenas dados

content/          # Todo conteúdo
  gatilhos/       # Documentação de aprendizado
  posts/          # Posts
  projects/       # Projetos
```

### HTML/Liquid

```liquid
<!-- Use comentários descritivos -->
<!-- Component: Sidebar Navigation -->

<!-- Indentação de 2 espaços -->
<div class="sidebar">
  {% for item in site.pages %}
    <a href="{{ item.url }}">{{ item.title }}</a>
  {% endfor %}
</div>

<!-- Nomes de classes descritivos -->
<button class="theme-toggle-button">
  <!-- não: <button class="btn"> -->
```

### SCSS

```scss
// Organize por categoria
// 1. Variáveis
$color-primary: #6b46c1;

// 2. Mixins
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 3. Estilos base
.component {
  @include flex-center;
  color: $color-primary;
  
  // Aninhamento máximo de 3 níveis
  &:hover {
    opacity: 0.8;
  }
}

// Comentários explicativos para lógica complexa
// Calculate dynamic spacing based on screen size
$spacing: calc(1rem + 2vw);
```

### Markdown

```markdown
---
layout: post
title: "Título Claro e Descritivo"
---

# Use heading hierarchy correta

## Subtítulo

Parágrafos com linha em branco entre eles.

### Listas com formatação consistente

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

### Blocos de código com linguagem

```bash
echo "Sempre especifique a linguagem"
```
```

### Front Matter

```yaml
---
layout: post          # Required
title: "Título"       # Required
date: 2026-02-06      # Optional
tags: [tag1, tag2]    # Optional
---
```

## Processo de Pull Request

### Antes de Abrir o PR

- [ ] Código está formatado consistentemente
- [ ] Comentários adicionados onde necessário
- [ ] Testes locais passam (`make test-build`)
- [ ] Documentação atualizada se necessário
- [ ] Commits seguem convenções
- [ ] Branch está atualizada com main

### Template de PR

Preencha todas as seções do template:


refactor(includes): simplifica lógica de navegação
```

## Dúvidas?

Se tiver dúvidas:

1. Consulte a [documentação](docs/)
2. Procure em [issues fechadas](https://github.com/gatilhoroxo/site-attempt/issues?q=is%3Aissue+is%3Aclosed)
3. Abra uma [nova issue](https://github.com/gatilhoroxo/site-attempt/issues/new) com suas perguntas

## Reconhecimento

Todos os contribuidores serão reconhecidos! Suas contribuições ajudam este 
projeto de aprendizado a crescer e melhorar.

---

**Obrigado por contribuir!** 🎉
