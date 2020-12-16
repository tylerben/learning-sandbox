import { Map } from "./components/Map";
import "./base.css";

const App = () => {
  console.log(process.env);
  return (
    <div className="App">
      <Map />
    </div>
  );
};

export default App;
