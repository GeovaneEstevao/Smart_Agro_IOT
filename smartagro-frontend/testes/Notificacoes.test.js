import React from "react";
import { render } from "@testing-library/react-native";
import Notificacoes from "../screens/Notificacoes";


jest.mock("expo-linear-gradient", () => {
  const View = require("react-native").View;
  return {
    LinearGradient: View,
  };
});

describe("Componente Notificacoes", () => {
  it("renderiza o título corretamente", () => {
    const { getByText } = render(<Notificacoes />);
    expect(getByText("Notificações")).toBeTruthy();
  });

  it("renderiza todas as mensagens de notificação", () => {
    const { getByText } = render(<Notificacoes />);
    expect(getByText("• Umidade do solo abaixo do mínimo!")).toBeTruthy();
    expect(getByText("• Bomba ativada automaticamente.")).toBeTruthy();
    expect(getByText("• Temperatura acima do ideal.")).toBeTruthy();
  });

  it("renderiza exatamente 3 notificações", () => {
    const { getAllByText } = render(<Notificacoes />);
    const items = getAllByText(/• /);
    expect(items.length).toBe(3);
  });
});
