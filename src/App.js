import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import TimeControl from './containers/TimeControl/TimeControl';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" component={TimeControl} />
      </div>
    </BrowserRouter>
  );
}

export default App;
