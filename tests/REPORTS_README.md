# 📊 Sistema de Relatórios Consolidados

Sistema unificado de relatórios de testes que agrega resultados de múltiplos frameworks em um dashboard HTML único e interativo.

## 🎯 Visão Geral

Este sistema resolve dois problemas principais:
1. **Travamento do servidor**: Testes E2E não bloqueiam mais o terminal
2. **Relatórios fragmentados**: Um único dashboard HTML consolida todos os resultados

## 🚀 Uso Rápido

### Gerar Relatório Consolidado

```bash
# Executar todos os testes (exceto E2E) e gerar relatório
make test-report

# Para incluir E2E/A11y, em terminal separado:
make serve              # Terminal 1
make test-report    # Terminal 2 (irá detectar servidor e rodar E2E)
```

### Regenerar Apenas o Relatório

```bash
# Usar resultados existentes sem re-executar testes
make test-report-only
```

## 📁 Estrutura de Saída

```
test-reports/
└── unified/
    ├── index.html              # 📊 Dashboard consolidado (ABRIR ESTE)
    ├── summary.txt             # Resumo em texto
    ├── data/                   # JSONs dos testes
    │   ├── playwright-results.json
    │   ├── rspec-results.json
    │   └── ...
    └── embedded/               # Relatórios originais
        ├── playwright/         # E2E report interativo
        ├── coverage-js/        # Vitest coverage
        ├── coverage-python/    # pytest coverage
        └── coverage-ruby/      # SimpleCov
```

## 🧪 Executando Testes

### Testes sem servidor (rápido)

```bash
make test-fast              # Apenas unitários (JS, Python, Ruby)
make test-all              # Build + unitários + validação
```

### Testes E2E/A11y (requer servidor)

```bash
# Terminal 1
make serve

# Terminal 2
make test-e2e              # Testes E2E
make test-a11y             # Testes A11y
make test-all-with-e2e     # Tudo incluindo E2E
```

## 📊 O que o Dashboard Mostra

### Abas do Dashboard

1. **📋 Sumário**
   - Cards com métricas principais
   - Status de todos os testes
   - Comandos rápidos

2. **🎭 E2E & A11y**
   - Relatório Playwright incorporado (iframe)
   - Interativo: clique nos testes para traces/screenshots
   - Resultados de acessibilidade

3. **📈 Cobertura**
   - Links para relatórios de cobertura (JS, Python, Ruby)
   - Métricas agregadas

4. **🧪 Testes Unitários**
   - Status dos testes por linguagem
   - Detalhes sobre cada framework

5. **✅ Validação**
   - Build, frontmatter, HTML, search index
   - Explicações sobre cada validador

## 🔄 Como Funciona

### Fluxo de Execução

1. **Executar Testes**
   - Cada framework gera JSON + HTML
   - Outputs padronizados em `test-reports/`

2. **Coletar Dados**
   - Script lê JSONs de todos os frameworks
   - Copia relatórios HTML para estrutura unificada

3. **Gerar Dashboard**
   - Template HTML com todos os dados
   - Iframes para relatórios existentes
   - Links relativos (funciona como arquivo local)

4. **Abrir no Navegador**
   - Auto-detecta SO (Linux/macOS)
   - Abre `test-reports/unified/index.html`
   - Nenhum servidor fica rodando

### Mudanças nos Testes E2E

**Antes:**
- Playwright iniciava servidor Jekyll automaticamente
- Servidor travava o terminal (precisava Ctrl+C)

**Agora:**
- Servidor deve ser iniciado manualmente: `make serve`
- Testes apenas conectam ao servidor já rodando
- Validação com mensagem clara se servidor não estiver rodando
- Testes terminam normalmente sem travar

## 🛠️ Configuração

### Arquivos Modificados

- `tests/playwright.config.js` - Removido `webServer`, adicionado JSON reporter
- `tests/e2e/specs/*.spec.js` - Validação de servidor em `beforeAll`
- `tests/accessibility/*.spec.js` - Validação de servidor
- `package.json` - Scripts com `--reporter=json`
- `Makefile` - Novos targets e avisos
- `Gemfile` - Adicionado `simplecov`
- `tests/unit/ruby/spec/spec_helper.rb` - Configurado SimpleCov

### Novos Arquivos

- `tests/scripts/generate-unified-report.sh` - Script principal
- `tests/scripts/generate-dashboard-html.sh` - Gerador de HTML
- `tests/e2e/helpers/server-check.js` - Validação de servidor

## 📝 Comandos Makefile

| Comando | Descrição |
|---------|-----------|
| `make test-fast` | Testes unitários (desenvolvimento) |
| `make test-all` | Todos os testes SEM E2E |
| `make test-all-with-e2e` | Todos os testes COM E2E (requer servidor) |
| `make test-report` | Gera relatório consolidado |
| `make test-report-only` | Regenera HTML sem executar testes |
| `make test-e2e` | Apenas E2E (requer servidor) |
| `make test-a11y` | Apenas acessibilidade (requer servidor) |

## ⚡ Dicas

### Desenvolvimento Rápido

```bash
# Durante desenvolvimento, mantenha servidor rodando:
make serve              # Deixe rodando

# Em outro terminal, rode testes quantas vezes quiser:
make test-e2e
make test-a11y
make test-report
```

### CI/CD

```bash
# Build antes dos testes
make build

# Servidor em background para CI
make serve &
SERVER_PID=$!

# Executar testes
SKIP_BROWSER_OPEN=1 make test-report

# Cleanup
kill $SERVER_PID
```

### Troubleshooting

**Erro: "Servidor não está rodando"**
```bash
# Verifique se porta 4000 está livre
lsof -i :4000

# Inicie o servidor
make serve
```

**Relatório E2E vazio**
```bash
# Certifique-se de rodar servidor antes dos testes
make serve              # Terminal 1
make test-e2e          # Terminal 2
make test-report    # Gera relatório
```

**SimpleCov não gera coverage**
```bash
# Instale dependências Ruby
bundle install

# Execute testes Ruby
make test-unit-ruby
```

## 📚 Mais Informações

- Relatório abre automaticamente no navegador após geração
- Dashboard funciona offline (todos os assets são locais)
- Use `make help` para ver todos os comandos disponíveis
- Relatórios podem ser compartilhados (zip da pasta `test-reports/unified/`)

## 🎨 Personalização

Para customizar o dashboard, edite:
- `tests/scripts/generate-dashboard-html.sh` - Template HTML e estilos
- `tests/scripts/generate-unified-report.sh` - Lógica de coleta de dados
