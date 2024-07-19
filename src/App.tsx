// import Icon from './assets/icon.png';
import './App.css';
import AppRoute from './features/AppRoute';

function App() {

  return (
    <div style={{ minHeight: window.innerHeight }} className={"application"}>
      {/* <div className={css.applicationHeader}>
        <img src={Icon} alt="logo" />
        <img src={Icon} alt="logo" />
      </div> */}
      <AppRoute />
    </div>
  );
}

export default App;
