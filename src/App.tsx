import './App.css';
import AppRoute from './features/AppRoute';

function App() {

  return (
    <div style={{ minHeight: window.innerHeight }} className={"application"}>
      <AppRoute />
    </div>
  );
}

export default App;
