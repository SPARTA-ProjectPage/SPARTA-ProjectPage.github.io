# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an academic project page template for showcasing research papers. It's a static HTML/CSS/JS website designed for GitHub Pages deployment.

## Architecture

- **index.html**: Main page with HTML building blocks (teaser video, abstract, image/video carousels, YouTube embed, PDF viewer, BibTeX citation). Comment out unused sections.
- **static/css/index.css**: Custom styles using CSS variables for theming. Built on top of Bulma CSS framework.
- **static/js/index.js**: Interactive features (More Works dropdown, BibTeX copy, scroll-to-top, carousel autoplay).
- **static/**: Contains css/, js/, images/, videos/, pdfs/ subdirectories for assets.

## Development

This is a static site with no build process. Open `index.html` directly in a browser or serve with any static file server.

Key dependencies (loaded via CDN):
- Bulma CSS framework
- jQuery
- Font Awesome icons
- Academicons
- Adobe PDF Embed API

## Customization Pattern

The template uses TODO comments throughout `index.html` to mark all fields that need replacement:
- Meta tags (title, description, keywords, social preview)
- Paper info (authors, institution, conference)
- Links (arXiv, GitHub, supplementary materials)
- Media content (videos, images, PDFs)
- BibTeX citation
- "More Works" dropdown items

Replace the favicon at `static/images/favicon.ico` and create a 1200x630px social preview at `static/images/social_preview.png`.
