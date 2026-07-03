import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CadastroScreen from "../screens/CadastroScreen";
import { Alert } from "react-native";


jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }) => children,
}));
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));


const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };


global.fetch = jest.fn();


jest.spyOn(Alert, "alert");

describe("CadastroScreen - fluxo de cadastro", () => {
  beforeEach(() => {
    fetch.mockReset();
    Alert.alert.mockClear();
    mockNavigate.mockClear();
  });

  it("deve cadastrar com sucesso e redirecionar para login", async () => {

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    const { getByPlaceholderText, getByText } = render(
      <CadastroScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Nome completo"), "Maria Silva");
    fireEvent.changeText(getByPlaceholderText("E-mail"), "maria@email.com");
    fireEvent.changeText(getByPlaceholderText("Senha"), "senha123");
    fireEvent.changeText(getByPlaceholderText("Confirmar senha"), "senha123");

    fireEvent.press(getByText("Cadastrar"));

    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/cadastro"), expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Maria Silva",
          email: "maria@email.com",
          senha: "senha123",
        }),
      }));

      expect(Alert.alert).toHaveBeenCalledWith("Cadastro", "Conta criada com sucesso!");
      expect(mockNavigate).toHaveBeenCalledWith("Login");
    });
  });
});
