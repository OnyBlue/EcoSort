import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importamos nuestros componentes de pantalla
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailScreen';
import ExampleScreen from './screens/Exapmle';
import PokemonScreen from './screens/PokemonScreen';
import RickMortyScreen from './screens/RickMortyScreen';
import ChuckNorrisScreen from './screens/ChuckNorrisScreen';
import Weather from './screens/Weather';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen 
            name="Example" 
            component={ExampleScreen}
          />

          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="Pokemon" 
            component={PokemonScreen} 
            options={{ title: 'API Pokémon' }}
          />

          <Stack.Screen 
            name="RickMorty" 
            component={RickMortyScreen} 
            options={{ title: 'API Rick and Morty' }}
          />
          <Stack.Screen 
            name="ChuckNorris" 
            component={ChuckNorrisScreen} 
            options={{ title: 'API de Chuck Norris' }}
          />

          <Stack.Screen 
            name="Weather" 
            component={Weather} 
            options={{ title: 'Estado del Clima' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
