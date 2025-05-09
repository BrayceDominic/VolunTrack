import { Stack } from 'expo-router';

export default function RootLayout() {
  console.log("✅ Layout rendered");

  return (
      <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="Login" />
  <Stack.Screen name="Signup" />
  <Stack.Screen name="forgotPassword" />
  {/* Add others as needed */}
</Stack>

  );
}
