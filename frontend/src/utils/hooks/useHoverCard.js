import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for handling hover card functionality with boundary detection
 * @param {Object} options - Configuration options
 * @param {number} options.hoverWidth - Width of the hover card
 * @param {number} options.hoverHeight - Height of the hover card
 * @param {number} options.delay - Delay in ms before showing hover card
 * @param {number} options.navbarHeight - Height of the navbar for boundary detection
 * @param {number} options.margin - Margin from screen edges
 * @returns {Object} Object containing ref, position, isHovered, and handler functions
 */
const useHoverCard = ({
  hoverWidth = 320,
  hoverHeight = 280,
  delay = 500,
  navbarHeight = 68,
  margin = 20
} = {}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState(null);
  const cardRef = useRef(null);
  const hoverTimeout = useRef(null);
  const hideTimeout = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent delayed hover cards
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate initial position (centered over the card)
        let left = rect.left + window.scrollX + rect.width / 2 - hoverWidth / 2;
        let top = rect.top + window.scrollY + rect.height / 2 - hoverHeight / 2;

        // Adjust if it goes off screen horizontally
        if (left < window.scrollX + margin) left = window.scrollX + margin;
        if (left + hoverWidth > window.scrollX + window.innerWidth - margin) {
          left = window.scrollX + window.innerWidth - hoverWidth - margin;
        }

        // Don't let the hover card go above the fixed navbar
        if (top < window.scrollY + navbarHeight + margin) {
          top = window.scrollY + navbarHeight + margin;
        }

        // Ensure it doesn't go off bottom screen
        if (top + hoverHeight > window.scrollY + window.innerHeight - margin) {
          top = window.scrollY + window.innerHeight - hoverHeight - margin;
        }

        setPosition({ top, left, width: hoverWidth });
        setIsHovered(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 200); // Grace period to move mouse to portal
  };

  return {
    cardRef,
    isHovered,
    position,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };
};

export default useHoverCard;