import { Stack } from "expo-router";
import { ExpensesProvider } from '@/context/expenses';
import "../styles/global.css";

export default function RootLayout() {
	return (
		<ExpensesProvider>
			<Stack >
				<Stack.Screen name="index" options={{ headerShown: false }} />
			</Stack>
		</ExpensesProvider>
	);
}
