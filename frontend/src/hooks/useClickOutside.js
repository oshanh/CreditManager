import { useEffect, useRef } from 'react';

function useClickOutside(callback, excludeRefs = []) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is inside the main ref element or any of the excluded refs
      const isInsideClickArea = (
        ref.current && ref.current.contains(event.target)
      ) || (
        excludeRefs.some(excludeRef => 
          excludeRef.current && excludeRef.current.contains(event.target)
        )
      );

      // If the click is outside the entire click area, call the callback
      if (!isInsideClickArea) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, excludeRefs]); // Add excludeRefs to dependency array

  return ref;
}

export default useClickOutside; 