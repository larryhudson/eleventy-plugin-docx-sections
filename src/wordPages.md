---
pagination:
  size: 1
  data: wordPages
  alias: wordPage
permalink: "{{wordPage.frontmatter.permalink}}"
layout: wordLayout.njk
eleventyComputed:
  title: "{{wordPage.heading}}"
---

# {{wordPage.heading}}

{{wordPage.content|safe}}
