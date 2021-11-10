import { Sources, Layers } from "../data";

class MapService {
  getSources() {
    return new Promise((resolve, reject) => {
      resolve(Sources);
    });
  }

  getLayers() {
    return new Promise((resolve, reject) => {
      resolve(Layers);
    });
  }
}

const instance = new MapService();
Object.freeze(instance);

export default instance;
