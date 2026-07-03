import React from "react";
import * as TestingLibrary from "@testing-library/react-native";
import ControleScreen from "../screens/ControleScreen";
import { Alert } from "react-native";



jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }) => children,
}));

global.fetch = jest.fn();
jest.spyOn(Alert, "alert");

describe("ControleScreen", () => {
  beforeEach(() => {
    fetch.mockReset();
    Alert.alert.mockClear();
  });

  it("carrega dados iniciais corretamente", async () => {

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        umidade_minima: 30,
        umidade_maxima: 70,
      }),
    });

    const { getByText } = TestingLibrary.render(<ControleScreen />);

    await TestingLibrary.waitFor(() => {
      expect(getByText("Umidade mínima: 30%")).toBeTruthy();
      expect(getByText("Umidade máxima: 70%")).toBeTruthy();
    });

    expect(fetch).toHaveBeenCalledWith("http://192.168.0.X:3001/api/controle/1");
  });

  it("altera sliders e salva configurações", async () => {

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        umidade_minima: 35,
        umidade_maxima: 55,
      }),
    });


    fetch.mockResolvedValueOnce({ ok: true });

    const { getByText, getByTestId } = TestingLibrary.render(<ControleScreen />);

    await TestingLibrary.waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const minUmidadeSlider = getByTestId("minUmidadeSlider");
    const maxUmidadeSlider = getByTestId("maxUmidadeSlider");
    const salvarBtn = getByText("Salvar Configurações");


    TestingLibrary.fireEvent(minUmidadeSlider, "valueChange", 40);
    TestingLibrary.fireEvent(maxUmidadeSlider, "valueChange", 75);

    TestingLibrary.fireEvent.press(salvarBtn);

    await TestingLibrary.waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://192.168.0.X:3001/api/controle/1",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            umidade_minima: 40,
            umidade_maxima: 75,
          }),
        })
      );

      expect(Alert.alert).toHaveBeenCalledWith("Sucesso", "Configurações salvas com sucesso!");
    });
  });
});
