import { useState } from 'react';
import './App.css';
import EditorComponent from './Editor';
import useHighlighter from './useHighlighter';

function App() {
  const [positions, setPositions] = useState({ start: null, end: null });
  
  const handleOnHighlight = (positions) => {
    setPositions(positions);
  }

  const { init, highlighter } = useHighlighter({
    onHighlight: handleOnHighlight,
  });

  const initHighlighter = () => {
    console.log("INIT")
    init('.fr-element.fr-view');
  }

  const handleClearHighlights = () => {
    highlighter.clear();
  }

  const handleHighlightRange = () => {
    highlighter.highlightRange(200, 300);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 500 }}>
          <div style={{ width: '100%', marginBottom: 20 }}>
            <div>
              <div className="position">
                Start: {positions.start}
              </div>
            </div>
            <div className="position">End: {positions.end}</div>
          </div>
          <div>
            <button className="button" onClick={handleHighlightRange}>Highlight range</button>
            <button className="button" onClick={handleClearHighlights}>Clear</button>
          </div>
          <div id="ques-edit">
            <EditorComponent onInit={initHighlighter} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
