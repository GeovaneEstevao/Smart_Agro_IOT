import React from "react";
import { render } from "@testing-library/react-native";
import Telemetria from "../screens/Telemetria";

describe("Telemetria", () => {
  it("renders correctly", () => {
    render(<Telemetria />);
  });
});

