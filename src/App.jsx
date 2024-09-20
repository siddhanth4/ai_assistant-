// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Step from './Step';
import Chat from './Chat';
import Second from './Second';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Step />} />
        <Route path="/second" element={<Second />} />
        <Route path="/chat" element={<Chat />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
