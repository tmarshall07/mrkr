import { useState } from 'react';
import './App.css';
import EditorComponent from './Editor';
import useHighlighter from './useHighlighter';

function App() {
  const [positions, setPositions] = useState({ start: null, end: null });
  
  const handleOnHighlight = (positions) => {
    setPositions(positions);
  }

  const highlighter = useHighlighter({
    onHighlight: handleOnHighlight,
  });

  const init = () => {
    console.log("INIT")
    highlighter.init('.fr-element.fr-view');
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
          <div id="ques-edit">
            <EditorComponent onInit={init} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
