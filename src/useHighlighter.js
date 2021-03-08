import { useEffect, useState } from "react";
import { highlight} from './highlighter';
export default function useHighlighter (options = {}) {
  const { onHighlight = () => {} } = options;

  const [element, setElement] = useState();

  const init = (selector) => {
    const el = document.querySelector(selector);
    setElement(el);
  }

  const handleHighlight =  () => {
    const results = highlight(element);

    if (results) onHighlight(results.positions);
  }

  useEffect(() => {
    if (element) {
      element.addEventListener('pointerup', handleHighlight);

      return () => {
        element.removeEventListener('pointerup', handleHighlight);
      }
    }
  }, [element]);

  return {
    init,
  }
}