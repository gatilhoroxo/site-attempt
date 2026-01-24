source "https://rubygems.org"

# Usar a mesma versão do GitHub Pages
gem "github-pages", group: :jekyll_plugins

# Plugins Jekyll úteis
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Windows e JRuby não incluem arquivos de zona de tempo
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster para assistir diretórios no Windows
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Kramdown v2 ships without the gfm parser by default.
gem "kramdown-parser-gfm"

# webrick é necessário para Ruby 3.0+
gem "webrick", "~> 1.8"
