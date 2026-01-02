import React, { createContext, useContext, useState, useRef } from 'react';
import { withPrefix } from 'gatsby'; 

const StackContext = createContext();
export const NoteIndexContext = createContext(-1);

export const StackProvider = ({ children }) => {
  const [stack, setStack] = useState([]);
  const sourceIndexRef = useRef(null);
  const currentPathRef = useRef(null);

  const setSourceIndex = (index) => {
    sourceIndexRef.current = index;
  };

  const updateStack = (rawPath, pageComponent) => {
    // --- 1. CLEAN THE PATH (The Fix) ---
    // Gatsby sends us the full path (e.g., "/my-garden/note").
    // We must strip the prefix so we store just "/note".
    let path = rawPath;
    const prefix = withPrefix('/');

    // Only strip if a prefix actually exists (and isn't just root "/")
    if (prefix !== '/') {
      if (path.startsWith(prefix)) {
        // Slice off the prefix (e.g. "/garden/")
        // If prefix is "/garden/" and path is "/garden/note", we get "note".
        path = path.slice(prefix.length);
        
        // Ensure it starts with a slash
        if (!path.startsWith('/')) {
          path = '/' + path;
        }
      } 
      // Handle edge case: visiting the root "/garden" without trailing slash
      else if (path === prefix.slice(0, -1)) {
        path = "/";
      }
    }
    
    // --- 2. GUARD CLAUSE (Strict Mode Fix) ---
    const isSamePath = path === currentPathRef.current;
    const isExplicitClick = sourceIndexRef.current !== null;

    if (isSamePath && !isExplicitClick) {
      return;
    }
    
    currentPathRef.current = path;
    const sourceIndex = sourceIndexRef.current;
    sourceIndexRef.current = null;

    setStack((prevStack) => {
      // SCENARIO 1: BRANCHING
      if (sourceIndex !== null) {
        const newStack = prevStack.slice(0, sourceIndex + 1);
        return [...newStack, { path, component: pageComponent }];
      }

      // SCENARIO 2: HISTORY / BACK BUTTON
      const reversedIndex = [...prevStack].reverse().findIndex(item => item.path === path);
      if (reversedIndex !== -1) {
        const existingIndex = prevStack.length - 1 - reversedIndex;
        return prevStack.slice(0, existingIndex + 1);
      }

      // SCENARIO 3: FRESH NOTE
      return [...prevStack, { path, component: pageComponent }];
    });
  };

  return (
    <StackContext.Provider value={{ stack, updateStack, setSourceIndex }}>
      {children}
    </StackContext.Provider>
  );
};

export const useStack = () => useContext(StackContext);
export const useNoteIndex = () => useContext(NoteIndexContext);
