import { createContext, memo, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPENSES_LOCAL_STORAGE_KEY } from "@/constants/storage";

interface ExpensesContext {
	expenses: TExpense[];
	addExpense: (expense: TExpense) => void;
}

export type TExpense = {
	name: string;
	amount: number;
	category: string;
	date: string;
};

const ExpenseContext = createContext<ExpensesContext>({
	expenses: [],
	addExpense: (expense: TExpense) => {},
});


const ExpensesProvider = memo(({ children }: { children: React.ReactNode }) => {
	const [expenses, setExpenses] = useState<TExpense[]>([]);

	const updateExpensesHandler = useCallback((expenses: TExpense[]) => {
		setExpenses(expenses);
		AsyncStorage.setItem(EXPENSES_LOCAL_STORAGE_KEY, JSON.stringify(expenses));
	}, []);

	const addExpense = useCallback((expense: TExpense) => {
		updateExpensesHandler([...expenses, expense]);
	},[updateExpensesHandler, expenses]);

	const setInitialExpenses = useCallback(async () => {
		const expensesString =await AsyncStorage.getItem(EXPENSES_LOCAL_STORAGE_KEY);
		if (expensesString !== null) {
			const expenses = JSON.parse(expensesString);
			updateExpensesHandler(expenses);
		}
	}, [updateExpensesHandler]);

	useEffect(() => {
		setInitialExpenses();
	}, []);

	return (
		<ExpenseContext.Provider value={{ expenses, addExpense }}>
			{children}
		</ExpenseContext.Provider>
	);
})

ExpensesProvider.displayName = "ExpensesProvider";

const useExpenses = () => {
	const context = useContext(ExpenseContext);

	if (!context) {
		throw new Error("useExpenses must be used within a ExpensesProvider");
	}

	return context;
};


export { ExpensesProvider, useExpenses };
