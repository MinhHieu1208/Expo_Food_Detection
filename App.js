import Pick from './screens/Pick'
import Result from './screens/Result'
import * as React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pick">
        <Stack.Screen name="Pick" component={Pick} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={Result} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
