# Pages

{% for page in wordPages %}

## {{page.heading}}

{{page.frontmatter.blurb | safe}}

{% endfor %}
