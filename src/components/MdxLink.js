import React from 'react';
import { Link } from 'gatsby';
import { useStack, useNoteIndex } from '../context/StackContext';

const MdxLink = ({ href, children }) => {
  const { setSourceIndex } = useStack();
  const myIndex = useNoteIndex(); // Get the index of the note this link lives in
  
  const isInternal = href && (href.startsWith('/') || href.startsWith('.'));

  if (isInternal) {
    return (
      <Link
        to={href}
        onClick={() => {
          // KEY MOMENT: logic to handle the "Branching"
          // "I am clicking from stack item #2, so delete everything after #2"
          if (myIndex !== -1) {
            setSourceIndex(myIndex);
          }
        }}
        className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
      >
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
      {children}
    </a>
  );
};

export default MdxLink;
