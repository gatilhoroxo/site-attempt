#!/usr/bin/env python3

import os
import sys
import re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import json
import yaml
import requests
from bs4 import BeautifulSoup


class HTMLValidator:
    def __init__(self, site_root):
        self.site_root = Path(site_root)
        self.site_dir = self.site_root / '_site'
        self.errors = []
        self.warnings = []
        self.config = self.load_validation_config()

    def load_validation_config(self):
        try:
            config_path = self.site_root / 'tests' / 'validation' / 'validation_config.yml'
            with open(config_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except Exception as e:
            self.add_error(f"Failed to load validation config: {e}")
            return {}

    def validate_all(self):
        print("🔍 Starting HTML validation...")
        
        if not self.site_dir.exists():
            self.add_error("_site directory not found. Site needs to be built first.")
            self.report_results()
            return False

        self.validate_html_structure()
        self.validate_links()
        self.validate_images()
        self.validate_accessibility()
        self.validate_performance()
        
        self.report_results()
        return len(self.errors) == 0

    def validate_html_structure(self):
        print("  📄 Validating HTML structure...")
        
        html_files = list(self.site_dir.glob('**/*.html'))
        
        for html_file in html_files:
            self.validate_html_file(html_file)

    def validate_html_file(self, html_file):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            relative_path = html_file.relative_to(self.site_dir)
            
            # Parse HTML
            soup = BeautifulSoup(content, 'html.parser')
            
            # Validate basic structure
            self.validate_html_basics(soup, relative_path)
            
            # Validate head section
            self.validate_head_section(soup, relative_path)
            
            # Validate body content
            self.validate_body_content(soup, relative_path)
            
            # Validate semantic structure
            self.validate_semantic_html(soup, relative_path)
            
        except Exception as e:
            self.add_error(f"{relative_path}: Failed to parse HTML - {e}")

    def validate_html_basics(self, soup, file_path):
        # Check for doctype
        if not soup.find(text=re.compile('<!DOCTYPE', re.I)):
            self.add_error(f"{file_path}: Missing DOCTYPE declaration")

        # Check for html element
        html_element = soup.find('html')
        if not html_element:
            self.add_error(f"{file_path}: Missing <html> element")
        elif not html_element.get('lang'):
            self.add_warning(f"{file_path}: HTML element missing lang attribute")

        # Check for head and body
        if not soup.find('head'):
            self.add_error(f"{file_path}: Missing <head> element")
        
        if not soup.find('body'):
            self.add_error(f"{file_path}: Missing <body> element")

    def validate_head_section(self, soup, file_path):
        head = soup.find('head')
        if not head:
            return

        # Check for title
        title = head.find('title')
        if not title:
            self.add_error(f"{file_path}: Missing <title> element")
        elif not title.string or not title.string.strip():
            self.add_error(f"{file_path}: Empty <title> element")
        elif len(title.string) > 60:
            self.add_warning(f"{file_path}: Title is very long ({len(title.string)} chars)")

        # Check for meta description
        meta_description = head.find('meta', attrs={'name': 'description'})
        if not meta_description:
            self.add_warning(f"{file_path}: Missing meta description")
        elif not meta_description.get('content'):
            self.add_warning(f"{file_path}: Empty meta description")

        # Check for viewport meta tag
        viewport_meta = head.find('meta', attrs={'name': 'viewport'})
        if not viewport_meta:
            self.add_warning(f"{file_path}: Missing viewport meta tag")

        # Check for charset
        charset_meta = head.find('meta', attrs={'charset': True})
        if not charset_meta:
            # Check for http-equiv content-type
            content_type_meta = head.find('meta', attrs={'http-equiv': 'Content-Type'})
            if not content_type_meta:
                self.add_warning(f"{file_path}: Missing charset declaration")

    def validate_body_content(self, soup, file_path):
        body = soup.find('body')
        if not body:
            return

        # Check for heading hierarchy
        self.validate_heading_hierarchy(soup, file_path)
        
        # Check for alt attributes on images
        self.validate_image_alt_text(soup, file_path)
        
        # Check for form labels
        self.validate_form_accessibility(soup, file_path)
        
        # Check for link text
        self.validate_link_text(soup, file_path)

    def validate_heading_hierarchy(self, soup, file_path):
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        
        if not headings:
            self.add_warning(f"{file_path}: No headings found")
            return

        # Check for h1
        h1_elements = [h for h in headings if h.name == 'h1']
        if len(h1_elements) == 0:
            self.add_warning(f"{file_path}: No H1 heading found")
        elif len(h1_elements) > 1:
            self.add_warning(f"{file_path}: Multiple H1 headings found")

        # Check heading order
        prev_level = 0
        for heading in headings:
            level = int(heading.name[1])
            if level - prev_level > 1:
                self.add_warning(f"{file_path}: Heading hierarchy skip from h{prev_level} to h{level}")
            prev_level = level

    def validate_image_alt_text(self, soup, file_path):
        images = soup.find_all('img')
        
        for img in images:
            if not img.get('alt'):
                src = img.get('src', 'unknown')
                self.add_error(f"{file_path}: Image missing alt attribute: {src}")
            elif not img['alt'].strip():
                src = img.get('src', 'unknown')
                self.add_warning(f"{file_path}: Image has empty alt attribute: {src}")

    def validate_form_accessibility(self, soup, file_path):
        # Check form inputs have labels
        inputs = soup.find_all(['input', 'select', 'textarea'])
        
        for input_elem in inputs:
            input_type = input_elem.get('type', 'text')
            if input_type in ['hidden', 'submit', 'button']:
                continue

            input_id = input_elem.get('id')
            if input_id:
                # Look for associated label
                label = soup.find('label', attrs={'for': input_id})
                if not label:
                    self.add_warning(f"{file_path}: Form input missing associated label: {input_elem}")
            else:
                # Check if wrapped in label
                parent_label = input_elem.find_parent('label')
                if not parent_label:
                    self.add_warning(f"{file_path}: Form input missing label or id: {input_elem}")

    def validate_link_text(self, soup, file_path):
        links = soup.find_all('a', href=True)
        
        for link in links:
            link_text = link.get_text().strip()
            if not link_text:
                # Check for images or other content
                if not link.find('img') and not link.find_all():
                    self.add_warning(f"{file_path}: Link with empty text: {link.get('href')}")
            elif link_text.lower() in ['click here', 'read more', 'more', 'here']:
                self.add_warning(f"{file_path}: Generic link text: '{link_text}'")

    def validate_semantic_html(self, soup, file_path):
        # Check for semantic elements
        semantic_elements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']
        found_elements = []
        
        for element in semantic_elements:
            if soup.find(element):
                found_elements.append(element)

        if len(found_elements) < 3:
            self.add_warning(f"{file_path}: Limited use of semantic HTML elements")

        # Check for main element
        main_elements = soup.find_all('main')
        if len(main_elements) > 1:
            self.add_error(f"{file_path}: Multiple <main> elements found")

    def validate_links(self):
        print("  🔗 Validating links...")
        
        html_files = list(self.site_dir.glob('**/*.html'))
        internal_links = set()
        external_links = set()
        
        for html_file in html_files:
            links = self.extract_links_from_file(html_file)
            for link in links:
                if self.is_internal_link(link):
                    internal_links.add(link)
                else:
                    external_links.add(link)

        # Validate internal links
        self.validate_internal_links(internal_links)
        
        # Optionally validate external links (can be slow)
        if len(external_links) < 20:  # Only for small number of external links
            self.validate_external_links(external_links)

    def extract_links_from_file(self, html_file):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            links = []
            for link_element in soup.find_all('a', href=True):
                href = link_element['href']
                if href and not href.startswith('#') and not href.startswith('mailto:') and not href.startswith('tel:'):
                    links.append(href)
            
            return links
        except Exception:
            return []

    def is_internal_link(self, link):
        parsed = urlparse(link)
        return not parsed.netloc or parsed.netloc == 'localhost'

    def validate_internal_links(self, links):
        for link in links:
            # Convert relative links to file paths
            if link.startswith('/'):
                # Root relative link
                target_path = self.site_dir / link.lstrip('/')
                if link.endswith('/'):
                    target_path = target_path / 'index.html'
                elif not link.endswith('.html') and not '.' in link.split('/')[-1]:
                    target_path = target_path / 'index.html'
            else:
                continue  # Skip relative links for now
            
            if not target_path.exists():
                self.add_error(f"Broken internal link: {link}")

    def validate_external_links(self, links):
        print("  🌐 Checking external links (this may take time)...")
        
        for link in list(links)[:10]:  # Limit to first 10 external links
            try:
                response = requests.head(link, timeout=10, allow_redirects=True)
                if response.status_code >= 400:
                    self.add_warning(f"External link may be broken ({response.status_code}): {link}")
            except requests.RequestException:
                self.add_warning(f"Could not verify external link: {link}")

    def validate_images(self):
        print("  🖼️  Validating images...")
        
        html_files = list(self.site_dir.glob('**/*.html'))
        
        for html_file in html_files:
            self.validate_images_in_file(html_file)

    def validate_images_in_file(self, html_file):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            relative_path = html_file.relative_to(self.site_dir)
            images = soup.find_all('img')
            
            for img in images:
                src = img.get('src')
                if not src:
                    self.add_error(f"{relative_path}: Image missing src attribute")
                    continue

                # Check if image file exists
                if src.startswith('/'):
                    image_path = self.site_dir / src.lstrip('/')
                    if not image_path.exists():
                        self.add_error(f"{relative_path}: Image file not found: {src}")
                elif not src.startswith('http'):
                    # Relative path - resolve relative to HTML file
                    image_path = html_file.parent / src
                    if not image_path.exists():
                        self.add_error(f"{relative_path}: Image file not found: {src}")

        except Exception as e:
            self.add_error(f"Error validating images in {html_file}: {e}")

    def validate_accessibility(self):
        print("  ♿ Validating accessibility basics...")
        
        html_files = list(self.site_dir.glob('**/*.html'))
        
        for html_file in html_files:
            self.validate_accessibility_in_file(html_file)

    def validate_accessibility_in_file(self, html_file):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            relative_path = html_file.relative_to(self.site_dir)
            
            # Check for skip links
            skip_links = soup.find_all('a', href=re.compile(r'^#'))
            if not skip_links:
                self.add_warning(f"{relative_path}: No skip links found for keyboard navigation")

            # Check color contrast (basic check for common issues)
            self.validate_color_usage(soup, relative_path)
            
            # Check for ARIA labels where needed
            self.validate_aria_usage(soup, relative_path)

        except Exception as e:
            self.add_error(f"Error validating accessibility in {html_file}: {e}")

    def validate_color_usage(self, soup, file_path):
        # Check for color-only information conveyance (basic check)
        elements_with_style = soup.find_all(style=True)
        
        for element in elements_with_style:
            style = element.get('style', '')
            if 'color:' in style and 'background' not in style:
                # This is a simplified check - real implementation would be more complex
                self.add_warning(f"{file_path}: Element relies on color alone for information")

    def validate_aria_usage(self, soup, file_path):
        # Check for ARIA labels on interactive elements
        buttons = soup.find_all('button')
        for button in buttons:
            button_text = button.get_text().strip()
            if not button_text and not button.get('aria-label') and not button.get('aria-labelledby'):
                self.add_warning(f"{file_path}: Button missing accessible text")

        # Check for ARIA landmarks
        nav_elements = soup.find_all('nav')
        for nav in nav_elements:
            if not nav.get('aria-label') and not nav.get('aria-labelledby'):
                self.add_warning(f"{file_path}: Navigation missing ARIA label")

    def validate_performance(self):
        print("  ⚡ Validating performance basics...")
        
        html_files = list(self.site_dir.glob('**/*.html'))
        
        for html_file in html_files:
            self.validate_performance_in_file(html_file)

    def validate_performance_in_file(self, html_file):
        try:
            file_size = html_file.stat().st_size
            max_size = self.config.get('performance_checks', {}).get('max_page_size', 500000)
            
            relative_path = html_file.relative_to(self.site_dir)
            
            if file_size > max_size:
                self.add_warning(f"{relative_path}: Large HTML file ({file_size} bytes)")

            # Check for performance best practices
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for inline styles (should be minimal)
            inline_style_count = content.count('style=')
            if inline_style_count > 10:
                self.add_warning(f"{relative_path}: Many inline styles ({inline_style_count})")

            # Check for unoptimized images
            soup = BeautifulSoup(content, 'html.parser')
            self.validate_image_optimization(soup, relative_path)

        except Exception as e:
            self.add_error(f"Error validating performance in {html_file}: {e}")

    def validate_image_optimization(self, soup, file_path):
        images = soup.find_all('img')
        
        for img in images:
            # Check for missing width/height (causes layout shift)
            if not img.get('width') and not img.get('height'):
                src = img.get('src', 'unknown')
                self.add_warning(f"{file_path}: Image missing dimensions: {src}")

            # Check for loading attribute
            if not img.get('loading'):
                src = img.get('src', 'unknown')
                self.add_warning(f"{file_path}: Image missing loading attribute: {src}")

    def add_error(self, message):
        self.errors.append(message)
        print(f"    ❌ ERROR: {message}")

    def add_warning(self, message):
        self.warnings.append(message)
        print(f"    ⚠️  WARNING: {message}")

    def report_results(self):
        print('\n📊 HTML Validation Results:')
        print(f'  Errors: {len(self.errors)}')
        print(f'  Warnings: {len(self.warnings)}')
        
        if self.errors:
            print('\n❌ Errors found:')
            for error in self.errors[:10]:  # Show first 10 errors
                print(f'  - {error}')
            if len(self.errors) > 10:
                print(f'  ... and {len(self.errors) - 10} more errors')

        if self.warnings:
            print('\n⚠️  Warnings:')
            for warning in self.warnings[:10]:  # Show first 10 warnings
                print(f'  - {warning}')
            if len(self.warnings) > 10:
                print(f'  ... and {len(self.warnings) - 10} more warnings')

        if not self.errors and not self.warnings:
            print('  ✅ All HTML validations passed!')


def main():
    site_root = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    validator = HTMLValidator(site_root)
    
    success = validator.validate_all()
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()