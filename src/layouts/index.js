import React, { useEffect } from 'react';
import { StackProvider, useStack } from '../context/StackContext';
import { ThemeProvider } from '../context/ThemeContext'; // <--- IMPORT
import GardenInterface from '../components/GardenInterface';
import '../styles/global.css';

const StackHandler = ({ location, children }) => {
  const { updateStack } = useStack();

  // Extract title logic...
  let title = null;
  if (children && children.props && children.props.data && children.props.data.mdx) {
    title = children.props.data.mdx.frontmatter.title;
  }

  useEffect(() => {
    updateStack(location.pathname, children, title);
  }, [location.pathname, children, updateStack, title]);

  return <GardenInterface />;
};

export default function Layout({ children, location }) {
  return (
    <ThemeProvider> {/* <--- WRAP HERE */}
      <StackProvider>
        <StackHandler location={location}>
          {children}
        </StackHandler>
      </StackProvider>
    </ThemeProvider>
  );
}
