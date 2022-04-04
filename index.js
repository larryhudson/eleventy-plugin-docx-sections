const lodashMerge = require("lodash.merge");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const slugify = require("slugify");
const { camelCase } = require("camel-case");

const DocxSectionsPlugin = (eleventyConfig, suppliedOptions) => {
  const defaultOptions = {
    globalDataVariable: "wordPages",
    sourceDocumentPath: "./source.docx",
    splitSelector: "h1",
    cheerioTransform: ($) => {},
    mammothConfig: {},
  };

  const options = lodashMerge(defaultOptions, suppliedOptions);

  eleventyConfig.addGlobalData(options.globalDataVariable, async () => {
    //   convert the source doc to HTML
    const rawHtml = await mammoth
      .convertToHtml(
        { path: options.sourceDocumentPath },
        options.mammothConfig
      )
      .then((result) => result.value);

    const $ = cheerio.load(rawHtml);
    options.cheerioTransform($);

    // split the document into sections
    // first section would be everything until

    const sections = [];

    const firstTag = $("body").children().first().get(0);

    const firstHeadingTag = $(options.splitSelector).first().get(0);

    const hasContentBeforeFirstHeading = firstTag !== firstHeadingTag;

    function getContentBeforeFirstHeading($) {
      const firstElem = $("body").children().first();
      const elemsBeforeFirstHeading = firstElem.add(
        firstElem.nextUntil(options.splitSelector)
      );

      elemsBeforeFirstHeading.wrapAll(`<div id="section-0"></div>`);

      return {
        heading: null,
        content: $("#section-0").html(),
        permalink: "/",
      };
    }

    if (hasContentBeforeFirstHeading) {
      sections.push(getContentBeforeFirstHeading($));
    }

    function getFrontmatterFromTable($, tableTag) {
      if (tableTag.prop("tagName") !== "TABLE") return null;

      var frontmatter = {};

      $(tableTag)
        .find("tr")
        .each((rowIndex, rowElem) => {
          const cells = $(rowElem).find("td,th");

          const key = camelCase(cells.first().text());
          const valueCell = cells.last();

          const valueGetters = {
            blurb: (cell) => cell.html(),
            permalink: (cell) => cell.text(),
          };

          const defaultValueGetter = (cell) => cell.text();

          const valueGetter = valueGetters[key] || defaultValueGetter;

          frontmatter[key] = valueGetter(valueCell);
        });

      $(tableTag).remove();

      return frontmatter;
    }

    function getSectionContent($, headingElem, sectionNumber) {
      const frontmatter = getFrontmatterFromTable($, $(headingElem).next());

      $(headingElem)
        .nextUntil(options.splitSelector)
        .wrapAll(`<div class="section" id="section-${sectionNumber}"></div>`);

      const sectionContainer = $(`#section-${sectionNumber}`);

      return {
        heading: $(headingElem).text(),
        content: $(sectionContainer).html(),
        permalink: `/${slugify($(headingElem).text(), { lower: true })}/`,
        frontmatter,
      };
    }

    $(options.splitSelector).each(function (headingIndex, headingElem) {
      sections.push(getSectionContent($, headingElem, headingIndex + 1));
    });

    return sections;
    //
  });
};

module.exports = DocxSectionsPlugin;
