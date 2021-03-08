/**
 * Gets an array of text nodes under the passed node
 *
 * @param {HTMLElement} node
 * @returns {[HTMLElement]} - array of text nodes
 */
 const textNodesUnder = (node) => {
  let all = [];
  // eslint-disable-next-line no-param-reassign
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === 3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
};

const getAbsolutePositions = (el, startTextNode, startOffset, endTextNode, endOffset) => {
  const textNodes = textNodesUnder(el);
  
  let currentIndex = 0;
  let startIndex = 0;
  let endIndex = 0;

  textNodes.forEach((node) => {
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

const highlightNode = (text, startOffset, endOffset) => {
  const highlightedText = text.substring(startOffset, endOffset);

  if (highlightedText.length > 0) {
    const highlightedSpanNode = document.createElement('SPAN');
    highlightedSpanNode.classList.add('highlight');
  
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

export const highlight = (el) => {
  const selection = window.getSelection();

  // If there's no selection object
  if (!selection) return;
  
  const range = selection.getRangeAt(0);
  const { startContainer, endContainer, startOffset,endOffset } = range;

  const positions = getAbsolutePositions(el, startContainer, startOffset, endContainer, endOffset);

  // If no content's actually been selected
  if (startContainer === endContainer && endOffset === startOffset) return;

  if (startContainer === endContainer) {
    // If the selection occurs inside the same text node
    const newNodes = highlightNode(startContainer.textContent, startOffset, endOffset)
    startContainer.replaceWith(...newNodes);
  } else {
    const textNodes = textNodesUnder(el);

    let startFound = false;
    textNodes.some((textNode) => {
      // Handle highlighting the starting text node
      if (textNode === startContainer) {
        const newStartNodes = highlightNode(textNode.textContent, startOffset, textNode.textContent.length);
        textNode.replaceWith(...newStartNodes);

        // Start collecting text nodes in between
        startFound = true;
        
        return false;
      } else if (textNode === endContainer) {
        // Handle highlighting the end text node
        const newEndNodes = highlightNode(textNode.textContent, 0, endOffset);
        textNode.replaceWith(...newEndNodes);

        return true; // Stop the loop
      } else if (startFound) {
        // Handle highlighting nodes in between start and end
        const newEndNodes = highlightNode(textNode.textContent, 0, textNode.textContent.length);
        textNode.replaceWith(...newEndNodes);
      }
      
      return false;
    });

  }

  selection.removeAllRanges();

  return { positions };
}