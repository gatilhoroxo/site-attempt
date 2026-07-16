# frozen_string_literal: true

require 'date'

# Plugin para gerar árvore de navegação dinâmica da sidebar
# Pré-processa a estrutura de pastas e arquivos de content/ para performance

Jekyll::Hooks.register :site, :post_read do |site|
  Jekyll.logger.info "Navigation:", "Hook triggered"
  
  unless site.data['navigation'] && site.data['navigation']['sections']
    Jekyll.logger.warn "Navigation:", "No navigation.yml or sections found"
    next
  end

  navigation_tree = []
  sections = site.data['navigation']['sections']
  
  Jekyll.logger.info "Navigation:", "Found #{sections.size} sections to process"

  sections.each do |section|
    section_path = section['path']
    section_name = section['name']
    max_depth = section['max_depth'] || 2
    sort_by = section['sort_by'] || 'title'
    
    # Determinar prefixo do path (content/ ou raiz)
    path_prefix = section_path == 'docs' ? '' : 'content/'

    # Filtrar páginas da seção
    section_pages = site.pages.select do |page|
      page.path.start_with?("#{path_prefix}#{section_path}/") &&
      page.path != "#{path_prefix}#{section_path}/index.md" &&
      !File.basename(page.path).start_with?('_')
    end
    
    Jekyll.logger.info "Navigation:", "Section '#{section_name}' (#{path_prefix}#{section_path}/) has #{section_pages.size} pages"
    
    # Debug: mostrar primeiros 3 paths
    if section_pages.size > 0
      section_pages.first(3).each { |p| Jekyll.logger.debug "  - #{p.path}" }
    end

    # Construir árvore using helper method
    tree = build_navigation_tree(section_pages, "#{path_prefix}#{section_path}", sort_by, max_depth, 0)
    
    Jekyll.logger.info "Navigation:", "Tree for '#{section_name}': #{tree['files'].size} files, #{tree['folders'].size} folders"

    # Adicionar apenas se não estiver vazia
    if tree && (!tree['files'].empty? || !tree['folders'].empty?)
      navigation_tree << {
        'name' => section_name,
        'path' => section_path,
        'path_prefix' => path_prefix,
        'tree' => tree
      }
    end
  end

  site.data['navigation_tree'] = navigation_tree
  Jekyll.logger.info "Navigation:", "Processed #{navigation_tree.size} sections"
end

def build_navigation_tree(pages, base_path, sort_by, max_depth, current_depth)
  return { 'files' => [], 'folders' => {} } if pages.empty? || current_depth >= max_depth

  files = []
  folder_groups = {}

  # Calcular profundidade base (base_path já inclui prefixo: content/gatilhos ou docs)
  base_segments = base_path.split('/').size

  pages.each do |page|
    segments = page.path.split('/')
    
    # Profundidade relativa à base
    relative_depth = segments.size - base_segments
    
    # Debug primeira iteração
    if current_depth == 0 && files.size == 0 && folder_groups.size == 0
      Jekyll.logger.debug "Navigation:", "  base_path=#{base_path}, base_segments=#{base_segments}"
      Jekyll.logger.debug "Navigation:", "  First page: #{page.path} (segments=#{segments.size}, relative_depth=#{relative_depth})"
    end

    if relative_depth == 1
      # Arquivo direto neste nível
      files << {
        'title' => page.data['title'] || filename_as_title(page),
        'url' => page.url,
        'path' => page.path,
        'date' => page.data['date']
      }
    elsif relative_depth > 1
      # Arquivo em subpasta
      subfolder_name = segments[base_segments]
      folder_groups[subfolder_name] ||= []
      folder_groups[subfolder_name] << page
    end
  end

  # Ordenar arquivos
  files = sort_files(files, sort_by)

  # Processar subpastas recursivamente
  folders = {}
  if current_depth + 1 < max_depth
    folder_groups.each do |folder_name, folder_pages|
      # Construir novo base_path para recursão
      new_base_path = "#{base_path}/#{folder_name}"
      subtree = build_navigation_tree(folder_pages, new_base_path, sort_by, max_depth, current_depth + 1)
      
      # Detectar se a pasta tem index.md
      folder_index = folder_pages.find { |p| p.path.end_with?("/#{folder_name}/index.md") }
      
      # Adicionar apenas se não estiver vazia
      if subtree && (!subtree['files'].empty? || !subtree['folders'].empty?)
        # Remove index.md da lista de arquivos se existir
        if folder_index
          subtree['files'] = subtree['files'].reject { |f| f['path'] == folder_index.path }
          subtree['index_url'] = folder_index.url
          subtree['index_title'] = folder_index.data['title'] || filename_as_title(folder_index)
        end
        
        folders[folder_name] = subtree
      end
    end
  end

  { 'files' => files, 'folders' => folders }
end

def sort_files(files, sort_by)
  case sort_by
  when 'date'
    files.sort_by do |f|
      date = f['date']
      # Convert to Time for consistent comparison
      if date.is_a?(String)
        date = Time.parse(date) rescue Time.at(0)
      elsif date.is_a?(Date)
        date = date.to_time
      elsif date.is_a?(Time)
        date
      else
        Time.at(0)
      end
    end.reverse
  when 'name'
    files.sort_by { |f| f['path'] }
  else # 'title'
    files.sort_by { |f| f['title'].downcase }
  end
end

def filename_as_title(page)
  File.basename(page.path, '.*')
      .gsub(/[-_]/, ' ')
      .split
      .map(&:capitalize)
      .join(' ')
end
