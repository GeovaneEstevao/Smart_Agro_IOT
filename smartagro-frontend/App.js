import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import ControleScreen from './screens/ControleScreen';
import CadastroScreen from './screens/CadastroScreen';
import PerfilUsuario from './screens/PerfilUsuario';
import Telemetria from './screens/Telemetria';
import Configuracoes from './screens/Configuracoes';
import Notificacoes from './screens/Notificacoes';
import IrrigacaoScreen from './screens/IrrigacaoScreen';
import SensoresScreen from './screens/SensoresScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} />
        <Stack.Screen name="Controle" component={ControleScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
        <Stack.Screen name="Telemetria" component={Telemetria} />
        <Stack.Screen name="Configuracoes" component={Configuracoes} />
        <Stack.Screen name="Notificacoes" component={Notificacoes} />
        <Stack.Screen name="Irrigacao" component={IrrigacaoScreen} />
        <Stack.Screen name="Sensores" component={SensoresScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
