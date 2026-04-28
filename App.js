import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RickMortyScreen from './screens/RickMortyScreen';

// Importamos nuestros componentes de pantalla
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailScreen';
import ExampleScreen from './screens/Exapmle'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Example" component={ExampleScreen}/>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Details" component={DetailsScreen} options={{headerShown: false}}/>
          <Stack.Screen name="RickMorty" component={RickMortyScreen} options={{ title: 'API Rick and Morty' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}