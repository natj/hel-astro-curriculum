import React from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from "@mdx-js/react";
import MdxLink from '../components/MdxLink';

// 1. IMPORT YOUR PARTIALS
// (Ignore linter errors about .mdx imports if you see them, Gatsby handles this)
import NoteHeader from '../components/partials/NoteHeader.mdx';
import NoteFooter from '../components/partials/NoteFooter.mdx';

export default function NotePage({ data, children }) {
  const { backlinks, frontmatter } = data.mdx;

  return (
    <div>
      <MDXProvider components={{ a: MdxLink }}>
        
        {!frontmatter.hideHeader && (
          <div className="note-header-area">
            <NoteHeader />
          </div>
        )}

        <h1>{data.mdx.frontmatter.title}</h1>
        {children}


        {backlinks && backlinks.length > 0 && (
          <div className="references-block">
            <h3 className="references-title">
              Referred in
            </h3>
            <div>
              {backlinks.map((ref) => (
                <MdxLink href={ref.fields.slug} key={ref.id} className="reference-link">
                  <div className="ref-title">
                    {ref.frontmatter.title || ref.fields.slug}
                  </div>
                  <p className="ref-excerpt">
                    {ref.excerpt}
                  </p>
                </MdxLink>
              ))}
            </div>
          </div>
        )}


        {!frontmatter.hideFooter && (
          <div className="note-footer-area">
            <NoteFooter />
          </div>
        )}

      </MDXProvider>

    </div>
  );
}

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        hideHeader
        hideFooter
      }
      fields {
        slug
      }
      backlinks {
        id
        excerpt(pruneLength: 80)
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
  }
`;
