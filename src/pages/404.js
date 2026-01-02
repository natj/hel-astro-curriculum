import React from 'react';
import MdxLink from '../components/MdxLink';

export default function NotFoundPage() {
  return (
    <div className="max-w-none">
      <h1>
        404
      </h1>

      <div className="prose prose-lg text-gray-700">
        <h3>
          This note doesn't exist yet.
        </h3>
        <p>
          You have reached the edge of the site. The link you clicked hasn't been created (yet).
        </p>
        <p className="mt-8">
           <MdxLink href="/">← Go back to the beginning</MdxLink>
        </p>
      </div>
    </div>
  );
}
