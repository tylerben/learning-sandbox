import "./App.css";
import { Layout } from "./components/Layout";
import { Map } from "./components/Map";

function App() {
  return (
    <div className="App">
      <Layout>
        <Map />
      </Layout>
    </div>
  );
}

export default App;
