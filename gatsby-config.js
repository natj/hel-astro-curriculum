const wikiLinkPlugin = require("remark-wiki-link").wikiLinkPlugin;
const makeSlug = require("./utils/slugify"); // <--- Import shared function


module.exports = {
  pathPrefix: "/home/jnattila/astro-curriculum",
  siteMetadata: {
    title: "My Modern Garden",
  },
  // We need to define the path prefix if you are deploying to GitHub Pages
  // pathPrefix: "/your-repo-name", 
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `partials`,
        path: `${__dirname}/src/components/partials`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [
            [
              wikiLinkPlugin,
              {
                // USE THE SHARED FUNCTION HERE
                pageResolver: (name) => [makeSlug(name)],
                hrefTemplate: (permalink) => `/${permalink}`,
                wikiLinkClassName: "internal-link",
              },
            ],
          ],
        },
      },
    },
  ],
};
