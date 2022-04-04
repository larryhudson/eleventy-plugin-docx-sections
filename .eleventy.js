const DocxSectionsPlugin = require("./index");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(DocxSectionsPlugin);

  return {
    dir: {
      input: "./src",
    },
    markdownTemplateEngine: "njk",
  };
};
