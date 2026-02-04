import React, { useEffect, useState, useCallback } from 'react';

import { BackToTopProps } from '../../types';

const BackToTop: React.FC<BackToTopProps> = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleScroll = useCallback((): void => {
    if (window.scrollY > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [threshold]);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        padding: '10px 15px',
        cursor: 'pointer',
      }}
    >
      ↑ Back to Top
    </button>
  );
};

export default BackToTop;
