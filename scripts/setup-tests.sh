#!/bin/bash

# Script de configuração inicial do ambiente de testes
# Este script instala todas as dependências e configura o ambiente

set -e  # Sair em caso de erro

echo "🚀 Configurando ambiente de testes..."

# Verificar se estamos no diretório correto
if [ ! -f "_config.yml" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Jekyll"
    exit 1
fi

# Função para verificar se o comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências do sistema
echo "📋 Verificando dependências do sistema..."

if ! command_exists node; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm não encontrado. Por favor, instale o npm"
    exit 1
fi

if ! command_exists ruby; then
    echo "❌ Ruby não encontrado. Por favor, instale o Ruby"
    exit 1
fi

if ! command_exists bundle; then
    echo "❌ Bundler não encontrado. Instalando..."
    gem install bundler
fi

if ! command_exists python3; then
    echo "❌ Python 3 não encontrado. Por favor, instale o Python 3"
    exit 1
fi

if ! command_exists pip3; then
    echo "❌ pip3 não encontrado. Por favor, instale o pip3"
    exit 1
fi

echo "✅ Dependências do sistema verificadas"

# Instalar dependências Ruby
echo "💎 Instalando dependências Ruby..."
if [ -f "Gemfile" ]; then
    bundle install
    echo "✅ Dependências Ruby instaladas"
else
    echo "❌ Gemfile não encontrado"
    exit 1
fi

# Instalar dependências Node.js
echo "📦 Instalando dependências Node.js..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Dependências Node.js instaladas"
else
    echo "❌ package.json não encontrado"
    exit 1
fi

# Instalar dependências Python
echo "🐍 Instalando dependências Python..."
if [ -f "tests/unit/python/requirements-dev.txt" ]; then
    pip3 install -r tests/unit/python/requirements-dev.txt
    echo "✅ Dependências Python instaladas"
else
    echo "❌ requirements-dev.txt não encontrado"
    exit 1
fi

# Instalar browsers para Playwright
echo "🌐 Instalando browsers para E2E tests..."
npx playwright install

# Verificar se Jekyll pode fazer build
echo "🔨 Testando build do Jekyll..."
if bundle exec jekyll build; then
    echo "✅ Build do Jekyll bem-sucedido"
else
    echo "❌ Erro no build do Jekyll"
    exit 1
fi

# Executar testes rápidos para verificar configuração
echo "🧪 Executando testes de verificação..."

# Teste JavaScript
echo "  Testando JavaScript..."
if npm run test:unit; then
    echo "  ✅ Testes JavaScript OK"
else
    echo "  ⚠️  Problemas nos testes JavaScript (pode ser normal se não há testes ainda)"
fi

# Teste Ruby
echo "  Testando Ruby..."
if bundle exec rspec; then
    echo "  ✅ Testes Ruby OK"
else
    echo "  ⚠️  Problemas nos testes Ruby (pode ser normal se não há testes ainda)"
fi

# Teste Python
echo "  Testando Python..."
if python3 -m pytest tests/unit/python/ -v; then
    echo "  ✅ Testes Python OK"
else
    echo "  ⚠️  Problemas nos testes Python (pode ser normal se não há testes ainda)"
fi

# Criar diretórios de relatórios se não existirem
mkdir -p reports/coverage/{js,ruby,python}
mkdir -p reports/test-results/{e2e,unit,accessibility,validation}

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📚 Comandos disponíveis:"
echo "  make test-fast      # Testes unitários rápidos"
echo "  make test-all       # Todos os testes"
echo "  make test-e2e       # Testes E2E"
echo "  make test-a11y      # Testes de acessibilidade"
echo "  make help           # Ver todos os comandos"
echo ""
echo "🧪 Para executar testes imediatamente:"
echo "  make serve          # Inicia servidor (em outra janela)"
echo "  make test-fast      # Executa testes básicos"