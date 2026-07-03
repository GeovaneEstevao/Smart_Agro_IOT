import React from "react";
import { render } from "@testing-library/react-native";
import PerfilUsuario from "../screens/PerfilUsuario";

describe("PerfilUsuario", () => {
  it("renders correctly", () => {
    render(<PerfilUsuario />);
  });
});

