const slugify = require("slugify");
const path = require("path");
const makeSlug = require("./utils/slugify"); // <--- Import shared function



// : Create the 'backlinks' field
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Mdx: {
      backlinks: {
        type: ["Mdx"],
        resolve: async (source, args, context, info) => {
          const allNotes = await context.nodeModel.findAll({ type: "Mdx" });
          
          // 1. Get the current note's slug base
          // e.g. "/notes/My-Note" -> "my-note" (assuming strict/lower happened on file creation)
          const mySlugBase = source.fields.slug.replace(/^\/|\/$/g, '').split('/').pop();

          console.log(`-----generating backlinks for ${mySlugBase}`);

          return allNotes.entries.filter((note) => {
            if (note.id === source.id) return false;

            // We check the file path. If it contains "partials", we skip it.
            // Note: In Gatsby 5, path info is often in 'internal.contentFilePath'
            const filePath = note.internal.contentFilePath || "";
            if (filePath.includes("src/components/partials")) {
              return false;
            }

            //console.log(`Checking if ${note.fields.slug} links to me...`);

            // 2. Scan for [[Wiki Links]]
            const wikiMatches = [...note.body.matchAll(/\[\[(.*?)\]\]/g)];

            for (const match of wikiMatches) {
              let linkText = match[1]; // "My Note" or "My Note|Label"

              // Remove styling pipe if present
              if (linkText.includes('|')) {
                linkText = linkText.split('|')[0];
              }

              // 3. USE SHARED SLUGIFY 
              // This turns "My Note" -> "my-note" using the exact rules from gatsby-config
              const candidateSlug = makeSlug(linkText);

              //console.log(` comparing links ${candidateSlug} to ${mySlugBase}`);

              if (candidateSlug === mySlugBase) {
                return true;
              }
            }
            
            // (Optional) Keep the standard markdown check if needed
            if (note.body.includes(`](${source.fields.slug})`)) {
               return true;
            }

            return false;
          });
        },
      },
    },
  };
  createResolvers(resolvers);
};



exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // 1. Check if the node is an MDX file
  if (node.internal.type === "Mdx") {
    
    // 2. Get the parent file node to find the actual filename
    // (MDX nodes are children of File nodes)
    const fileNode = getNode(node.parent);
    
    // 3. Get the filename without extension (e.g. "My Note.md" -> "My Note")
    const fileName = fileNode.name;

    // 4. Create the slug using the EXACT same logic as your wiki-links
    // Special handling: if filename is "index", slug should be "/"
    let slug = "";
    if (fileName === "index") {
      slug = "/";
    } else {
      slug = "/" + slugify(fileName, { lower: true, strict: true });
    }

    // 5. Add this new 'slug' field to the MDX node
    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};



exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }
    type MdxFrontmatter {
      hideHeader: Boolean
      hideFooter: Boolean
      title: String
    }
  `;
  createTypes(typeDefs);
};

