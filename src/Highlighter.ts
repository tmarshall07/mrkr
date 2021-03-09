// Type predicate function
function isTextNode(node: Node): node is Text {
  return (node as Text).nodeType === 3;
}

interface Props {
  element?: HTMLElement;
  className?: string;
}

interface Range {
  startContainer: ChildNode;
  endContainer: ChildNode;
  startOffset: number;
  endOffset: number;
}

export default class Highlighter {
  element: HTMLElement;
  highlightClass: string;

  constructor(props: Props = {}) {
    const { element = document.body, className = 'highlight' } = props;

    this.element = element;
    this.highlightClass = className;

    this.setContainerElement(element);
  }

  setContainerElement(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Clears the highlights from the container element
   *
   * @memberof Highlighter
   */
  clear(): void {
    if (!this.element) return;

    const highlightedNodes = this.element.querySelectorAll(`.${this.highlightClass}`);
    highlightedNodes.forEach((highlightedNode) => {
      highlightedNode.replaceWith(...highlightedNode.childNodes);
    });
  }

  highlightSelection(): { positions: { start?: number, end?: number }} {
    const selection = window.getSelection();
    let results = {
      positions: {},
    };

    // If there's no selection object
    if (!selection) return results;

    // Container element must be defined
    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'));
      return results;
    } 
    
    const range = selection.getRangeAt(0);
    
    const { startContainer, endContainer, startOffset, endOffset } = range as unknown as Range;

    // Ensure that results are Text nodes
    if (isTextNode(startContainer) && isTextNode(endContainer)) {
      const startTextNode = startContainer;
      const endTextNode = endContainer;

      const positions = this.getAbsolutePositions(startTextNode, startOffset, endTextNode, endOffset);
  
      // If no content's actually been selected
      if (startTextNode === endTextNode && endOffset === startOffset) return results;
  
      if (startTextNode === endTextNode) {
        // If the selection occurs inside the same text node
        const newNodes = this.highlightNode(startTextNode.textContent, startOffset, endOffset) as ChildNode[];
        startTextNode.replaceWith(...newNodes);
      } else {
        const textNodes = textNodesUnder(this.element);
  
        let startFound = false;
        textNodes.some((textNode) => {
          if (!textNode.textContent) return false;
  
          // Handle highlighting the starting text node
          if (textNode === startTextNode) {
            const newStartNodes = this.highlightNode(textNode.textContent, startOffset, textNode.textContent.length);
            textNode.replaceWith(...newStartNodes);
  
            // Start collecting text nodes in between
            startFound = true;
            
            return false;
          } else if (textNode === endTextNode) {
            // Handle highlighting the end text node
            const newEndNodes = this.highlightNode(textNode.textContent, 0, endOffset);
            textNode.replaceWith(...newEndNodes);
  
            return true; // Stop the loop
          } else if (startFound) {
            // Handle highlighting nodes in between start and end
            const newEndNodes = this.highlightNode(textNode.textContent, 0, textNode.textContent.length);
            textNode.replaceWith(...newEndNodes);
          }
          
          return false;
        });
      }
      selection.removeAllRanges();
  
      return { positions };
    }

    return results;
  }

  highlightRange(startOffset: number, endOffset: number): void {
    if (!this.element) {
      console.error(new Error('Container element not defined for highlighter.'))
    };

    const textNodes = textNodesUnder(this.element);
    
    let currentIndex = 0;
    let startFound = false;

    textNodes.some((textNode) => {
      if (!textNode.textContent) return false;

      const newCurrentIndex = currentIndex + (textNode.textContent.length || 0);
      if (startOffset >= currentIndex && startOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, startOffset - currentIndex, textNode.textContent.length);
        textNode.replaceWith(...newNodes);
        startFound = true;
      } else if (endOffset >= currentIndex && endOffset < newCurrentIndex) {
        const newNodes = this.highlightNode(textNode.textContent, 0, endOffset - currentIndex);
        textNode.replaceWith(...newNodes);
        return true;
      } else if (startFound) {
        const newNodes = this.highlightNode(textNode.textContent, 0, textNode.textContent.length);
        textNode.replaceWith(...newNodes);
      }

      currentIndex = newCurrentIndex;
      return false;
    });
  }

  getAbsolutePositions(startTextNode: ChildNode, startOffset: number, endTextNode: ChildNode, endOffset: number): {
    start?: number;
    end?: number;
  } {
    const textNodes = textNodesUnder(this.element);

    let currentIndex = 0;
    let startIndex = 0;
    let endIndex = 0;

    textNodes.forEach((node) => {
      if (!node.textContent) return;

      if (node === startTextNode) {
        startIndex = currentIndex + startOffset;
        if (startTextNode === endTextNode) {
          endIndex = currentIndex + endOffset;
        }
      } else if (node === endTextNode) {
        endIndex = currentIndex + endOffset;
      } else {
        currentIndex += node.textContent.length;
      }
      return false;
    });

    return {
      start: startIndex,
      end: endIndex,
    }
  }

  highlightNode (text: string | null = '', startOffset: number, endOffset: number): ChildNode[] {
    if (!text) return [];

    const highlightedText = text.substring(startOffset, endOffset);
  
    if (highlightedText.length > 0) {
      const highlightedSpanNode = document.createElement('SPAN');
      highlightedSpanNode.classList.add(this.highlightClass);
    
      const startTextNode = document.createTextNode(text.substring(0, startOffset));
      const highlightedTextNode = document.createTextNode(highlightedText);
      const endTextNode = document.createTextNode(text.substring(endOffset));
    
      highlightedSpanNode.appendChild(highlightedTextNode);
    
      const newNodes = [];
      if (startTextNode.textContent) newNodes.push(startTextNode);
      newNodes.push(highlightedSpanNode);
      if (endTextNode.textContent) newNodes.push(endTextNode);
    
      return newNodes;
    }
    
    return [document.createTextNode(text)];
  }
}

/**
 * Gets an array of text nodes under the passed node
 *
 * @param {HTMLElement} node
 * @returns {[HTMLElement]} - array of text nodes
 */
 const textNodesUnder = (node: HTMLElement): Text[] => {
  let all: Text[] = [];

  // @ts-ignore
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (isTextNode(node)) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
};
