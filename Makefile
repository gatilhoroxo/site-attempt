.PHONY: dev build test test-build test-links lint clean help serve test-e2e test-e2e-headed test-e2e-debug test-a11y test-unit-js test-unit-js-watch test-unit-js-coverage test-all test-fast test-coverage

# Servidor de desenvolvimento com live reload
dev:
	bundle exec jekyll serve --livereload

# Servidor para testes (sem livereload)
serve:
	bundle exec jekyll serve --port 4000

# Build de produção
build:
	bundle exec jekyll build

# Testar build sem erros
test-build:
	bundle exec jekyll build --verbose

# Testar links internos (requer html-proofer instalado)
test-links:
	bundle exec htmlproofer ./_site --disable-external --assume-extension --check-html

# Testes E2E com Playwright
test-e2e:
	npm run test:e2e

test-e2e-headed:
	npm run test:e2e:headed

test-e2e-debug:
	npm run test:e2e:debug

# Testes de Acessibilidade
test-a11y:
	npm run test:a11y

test-a11y-auto:
	npm run test:a11y && npm run test:a11y:pa11y

# Testes Unitários JavaScript
test-unit-js:
	npm run test:unit

test-unit-js-watch:
	npm run test:unit:watch

test-unit-js-coverage:
	npm run test:unit:coverage

# Testes Unitários Ruby (RSpec)
test-unit-ruby:
	cd tests/unit/ruby && bundle exec rspec --format json --out ../../../test-reports/data/rspec-results.json --format progress

test-unit-ruby-verbose:
	cd tests/unit/ruby && bundle exec rspec --format documentation

# Testes Unitários Python (pytest)
test-unit-python:
	@mkdir -p test-reports/data
	PYTHONPATH=$(PWD)/.github/scripts:$$PYTHONPATH tests/unit/python/.venv/bin/python -m pytest -c tests/unit/python/config/pytest.ini tests/unit/python/tests -v

test-unit-python-coverage:
	@mkdir -p test-reports/data test-reports/unified/embedded/coverage-python
	PYTHONPATH=$(PWD)/.github/scripts:$$PYTHONPATH tests/unit/python/.venv/bin/python -m pytest -c tests/unit/python/config/pytest.ini tests/unit/python/tests -v --cov=.github/scripts --cov-report=html:test-reports/unified/embedded/coverage-python --cov-report=term

# Testes de Validação de Build
test-validation:
	ruby tests/validation/build_validator.rb
	node tests/validation/frontmatter_validator.cjs
	node tests/validation/search_index_validator.cjs

test-validation-html:
	tests/unit/python/.venv/bin/python tests/validation/html_validator.py

# Comandos consolidadosvalidation test-validation-html
test-all-with-e2e: test-build test-unit-js test-unit-ruby test-unit-python test-e2e test-a11y test-validation test-validation-html
test-coverage: test-unit-js-coverage test-unit-python-coverage

# Automação e Relatórios
setup-tests:
	./tests/scripts/setup-tests.sh

# Gera relatório consolidado de todos os testes (HTML único)
test-report:
	@echo "⚠️  IMPORTANTE: Para incluir testes E2E, execute 'make serve' em outro terminal primeiro"
	./tests/scripts/generate-unified-report.sh

# Regenera apenas o relatório HTML dos resultados existentes
test-report-only:
	./tests/scripts/generate-unified-report.sh --skip-tests

# Linting e formatação
lint:
	npm run lint
	bundle exec rubocop
	tests/unit/python/.venv/bin/python -m flake8 .github/scripts/
	tests/unit/python/.venv/bin/python -m black --check .github/scripts/

# Executar todos os testes (compatibilidade)
test: test-build test-links

# Limpar arquivos gerados
clean:
	rm -rf _site .jekyll-cache .sass-cache 

# Limpar arquivos gerados dos testes
clean-test:
	rm -rf node_modules package-lock.json
	rm -rf .pytest_cache playwright-report test-results reports

# Limpa todoso os arquivos gerados
clean-all:
	make clean && make clean-test

# Instalar dependências
install:
	bundle install

# Atualizar dependências
update:
	bundle update

# Ajuda - mostrar comandos disponíveis
help:
	@echo "Comandos disponíveis:"
	@echo "  make dev                - Servidor de desenvolvimento com live reload"  
	@echo "  make serve              - Servidor para testes (sem livereload)"
	@echo "  make build              - Build de produção"
	@echo "  make test-build         - Testar build sem erros"
	@echo "  make test-links         - Verificar links quebrados"
	@echo "  make test               - Executar testes básicos (build + links)"
	@echo ""
	@echo "Testes E2E:"
	@echo "  ⚠️  REQUISITO: Execute 'make serve' em terminal separado antes de rodar E2E/A11y"
	@echo "  make test-e2e           - Testes E2E headless (rápido)"
	@echo "  make test-e2e-headed    - Testes E2E com interface gráfica"
	@echo "  make test-e2e-debug     - Testes E2E com Playwright inspector"
	@echo ""
	@echo "Outros testes:"
	@echo "  make test-a11y          - Testes de acessibilidade"
	@echo "  make test-a11y-auto     - Testes automáticos (axe + pa11y)" 
	@echo "  make test-unit-js       - Testes unitários JavaScript"
	@echo "  make test-unit-js-watch - Testes JS em watch mode"
	@echo "  make test-unit-ruby     - Testes unitários Ruby (RSpec)"
	@echo "  make test-unit-ruby-verbose - RSpec com saída detalhada"
	@echo "  make test-unit-python   - Testes unitários Python (pytest)"
	@echo "  make test-validation    - Validação de build e estrutura"
	@echo "  make test-validation-html - Validação HTML completa"
	@echo ""
	@echo "Comandos consolidados:"
	@echo "  make test-fast          - Testes unitários (JS + Ruby + Python, desenvolvimento)"
	@echo "  make test-all           - Todos os testes SEM E2E (build + unit + validation)"
	@echo "  make test-all-with-e2e  - Todos os testes COM E2E (requer 'make serve' rodando)"
	@echo "  make test-coverage      - Relatórios de cobertura (JS + Python)"
	@echo ""
	@echo "Automação e Relatórios:"
	@echo "  make setup-tests        - Configurar ambiente de testes completo"
	@echo "  make test-report    - Gerar relatório consolidado (HTML único, abre no navegador)"
	@echo "  make test-report-only   - Regenerar relatório HTML dos resultados existentes"
	@echo ""
	@echo "Outros:"
	@echo "  make lint               - Análise de código (linting)"
	@echo "  make clean              - Limpar arquivos gerados"
	@echo "  make clean-test		 - Limpar arquivos gerados dos testes"
	@echo "  make clean-all 		 - Limpa todoso os arquivos gerados"
	@echo "  make install            - Instalar dependências"
	@echo "  make update             - Atualizar dependências"
	@echo "  make help               - Mostrar esta ajuda"
