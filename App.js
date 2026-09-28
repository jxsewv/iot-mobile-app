import React from 'react';
import { NavigationContainer, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { colors } from './src/theme/colors';
import StatsScreen from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator();

const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
  },
};

const navTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.surface,
    primary: colors.primary,
    notification: colors.danger,
  },
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Historial" component={HistoryScreen} />
          <Stack.Screen name="Estadísticas" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}