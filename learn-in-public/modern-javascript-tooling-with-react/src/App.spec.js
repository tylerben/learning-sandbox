import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

describe("App", () => {
  it("Renders without crashing", () => {
    render(<App />);
  });
});
