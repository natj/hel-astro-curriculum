import { useState, useEffect } from 'react';

const getWindowWidth = () => {
  return typeof window === 'undefined' ? 0 : window.innerWidth;
};

export default function useWindowWidth() {
  const [width, setWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleResize() {
      setWidth(getWindowWidth());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
