import { Routes, Route } from 'react-router-dom';

import routes from './routes';

function App() {
  return (
    <Routes>
      {routes.map(({ path, element }, i) => (
        <Route path={path} element={element} key={i} />
      ))}

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
