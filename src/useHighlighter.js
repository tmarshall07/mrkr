import { useEffect, useRef, useState } from "react";
import Highlighter from './Highlighter';

export default function useHighlighter (options = {}) {
  const { onHighlight = () => {} } = options;
  const highlighterRef = useRef();

  const [element, setElement] = useState();

  const init = (selector) => {
    const el = document.querySelector(selector);
    highlighterRef.current.setContainerElement(el);
    setElement(el);
  }

  const handleHighlight =  () => {
    const results = highlighterRef.current.highlightSelection();

    if (results) {
      const positions = {
        start: results.startOffset,
        end: results.endOffset,
      };

      onHighlight(positions)
    };
  }

  useEffect(() => {
    if (element) {
      element.addEventListener('pointerup', handleHighlight);

      return () => {
        element.removeEventListener('pointerup', handleHighlight);
      }
    }
  }, [element]);

  useEffect(() => {
    const highlighter = new Highlighter();
    highlighterRef.current = highlighter;
  }, []);

  return {
    init,
    highlighter: highlighterRef.current,
  }
}