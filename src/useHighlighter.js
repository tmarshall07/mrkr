import { useEffect, useRef, useState } from "react";
import Mrkr from 'mrkrjs';

export default function useHighlighter (options = {}) {
  const { onHighlight = () => {} } = options;
  const highlighterRef = useRef();

  const init = (selector) => {
    const el = document.querySelector(selector);
    highlighterRef.current.setContainerElement(el);

    highlighterRef.current.enableSelection();
  }

  const handleHighlight =  (e, offsets) => {
    const positions = {
      start: offsets.startOffset,
      end: offsets.endOffset,
    };

    onHighlight(positions)
  }

  useEffect(() => {
    const highlighter = new Mrkr({ onHighlightSelection: handleHighlight });
    highlighterRef.current = highlighter;
  }, []);

  return {
    init,
    highlighter: highlighterRef.current,
  }
}