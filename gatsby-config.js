module.exports = {
  siteMetadata: {
    title: `Helsinki Astrophysics Curriculum`,
  },
  plugins: [
    {
      resolve: `gatsby-theme-andy`,
      options: {
        hideDoubleBrackets: true,
        mdxOtherwiseConfigured: true,
      },
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [`gatsby-remark-embedder`],
      },
    },
  ],
};
