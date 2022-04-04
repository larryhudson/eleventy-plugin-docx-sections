# `eleventy-plugin-docx-sections`

This is a plugin to break a Word document into multiple Eleventy pages. This means you could write all your website content in a single Word document, and build a full multi-page website with Eleventy.

This is a work in progress.

## To do / to think about

### Breaking subheadings into subpages

If you break H1s into separate pages, and then H2s into separate pages, you could have a nested structure like this:

Eg:

- H1 - About me = /about-me/
  - H2 - Work = /about-me/work/
  - H2 - Projects = /about-me/projects/

This might be difficult because Eleventy doesn't really support nested pagination.

### Hyperlinks between pages

In Word, you can insert hyperlinks that jump from section to section within the same Word doc.

I'm hoping we can use this to create hyperlinks between pages in the Eleventy site. This will mean:

- finding the hyperlinks and replacing them with working permalinks
