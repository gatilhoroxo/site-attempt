.PHONY: dev build test lint clean

dev:
	bundle exec jekyll serve --livereload

build:
	bundle exec jekyll build

test:
	bundle exec htmlproofer ./_site --disable-external

lint:
	npm run lint

clean:
	rm -rf _site .jekyll-cache
