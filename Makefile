.PHONY: dev build test test-build test-links lint clean help

# Servidor de desenvolvimento com live reload
dev:
	bundle exec jekyll serve --livereload

# Build de produção
build:
	bundle exec jekyll build

# Testar build sem erros
test-build:
	bundle exec jekyll build --verbose

# Testar links internos (requer html-proofer instalado)
test-links:
	bundle exec htmlproofer ./_site --disable-external --assume-extension --check-html

# Executar todos os testes
test: test-build test-links

# Limpar arquivos gerados
clean:
	rm -rf _site .jekyll-cache .sass-cache

# Instalar dependências
install:
	bundle install

# Atualizar dependências
update:
	bundle update

# Ajuda - mostrar comandos disponíveis
help:
	@echo "Comandos disponíveis:"
	@echo "  make dev          - Servidor de desenvolvimento com live reload"
	@echo "  make build        - Build de produção"
	@echo "  make test-build   - Testar build sem erros"
	@echo "  make test-links   - Verificar links quebrados"
	@echo "  make test         - Executar todos os testes"
	@echo "  make clean        - Limpar arquivos gerados"
	@echo "  make install      - Instalar dependências"
	@echo "  make update       - Atualizar dependências"
	@echo "  make help         - Mostrar esta ajuda"
