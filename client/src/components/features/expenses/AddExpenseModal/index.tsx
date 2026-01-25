import { memo, useCallback, useState, useMemo } from "react";
import { Pressable, View } from "react-native";
import {
  Modal,
  Button,
  Input,
  Icon,
  Select,
  AutocompleteInput,
} from "@/components/ui";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import type { AutocompleteOption } from "@/components/ui/AutocompleteInput";
import {
  IExpense,
  useCategories,
  useExpenses,
  useExpensesSearch,
  usePaymentMethods,
} from "@/hooks";

interface AddExpenseModalProps {
  expense: IExpense | null;
  onClose: () => void;
  onOpen: () => void;
  visible: boolean;
}

const AddExpenseModal = memo(
  ({ expense, onClose, onOpen, visible }: AddExpenseModalProps) => {
    const { categories } = useCategories();
    const { paymentMethods } = usePaymentMethods();
    const { createExpense, updateExpense, loading } = useExpenses();

    const [searchQuery, setSearchQuery] = useState("");
    const { expenses: searchResults, loading: searchLoading } =
      useExpensesSearch(searchQuery);

    const [form, setForm] = useState({
      title: expense?.title ?? "",
      amount: expense?.amount?.toString() ?? "",
      categoryId: expense?.categoryId ?? 0,
      paymentMethodId: expense?.paymentMethodId ?? 0,
      expenseDate: expense?.expenseDate
        ? new Date(expense.expenseDate)
        : new Date(),
    });

    const autocompleteOptions = useMemo<AutocompleteOption[]>(() => {
      return searchResults.map((exp) => ({
        id: exp.id,
        label: exp.title,
        categoryId: exp.category?.id,
        paymentMethodId: exp.paymentMethod?.id,
      }));
    }, [searchResults]);

    const resetForm = useCallback(() => {
      setForm({
        title: "",
        amount: "",
        categoryId: 0,
        paymentMethodId: 0,
        expenseDate: new Date(),
      });
      setSearchQuery("");
    }, []);

    const handleSubmit = useCallback(() => {
      if (
        !form.amount ||
        !form.categoryId ||
        !form.paymentMethodId ||
        !form.title
      )
        return;

      const expensePayload = {
        title: form.title,
        amount: Number(form.amount),
        categoryId: form.categoryId,
        paymentMethodId: form.paymentMethodId,
        expenseDate: form.expenseDate.toISOString(),
      };

      if (expense) {
        updateExpense({
          id: expense.id,
          expense: expensePayload,
        });
      } else {
        createExpense(expensePayload);
      }

      resetForm();

      onClose();
    }, [form, expense, resetForm, onClose, updateExpense, createExpense]);

    const handleSelectExpense = useCallback((option: AutocompleteOption) => {
      console.log("Selected option:", option);
      setForm((prev) => ({
        ...prev,
        title: option.label,
        categoryId: option.categoryId,
        paymentMethodId: option.paymentMethodId,
      }));
    }, []);

    const handleClose = useCallback(() => {
      resetForm();
      onClose();
    }, [onClose, resetForm]);

    const handleOpen = useCallback(() => {
      resetForm();
      onOpen();
    }, [onOpen, resetForm]);

    const isFormValid = form.amount && form.categoryId && form.paymentMethodId;

    return (
      <>
        <Pressable
          onPress={handleOpen}
          className="absolute z-10 right-4 bottom-4 bg-blue-500 rounded-full p-4 shadow-lg"
        >
          <Icon name="plus" size={24} color="#fff" />
        </Pressable>

        <Modal open={visible} onClose={handleClose}>
          <Modal.Header title={expense ? "Edit Expense" : "Add Expense"} />
          <Modal.Body>
            <View className="gap-4">
              <AutocompleteInput
                label="Title"
                placeholder="Search or enter title"
                value={form.title}
                onChangeText={(text: string) => {
                  setForm({ ...form, title: text });
                  setSearchQuery(text);
                }}
                onSelectOption={handleSelectExpense}
                options={autocompleteOptions}
                loading={searchLoading}
              />

              <Input
                label="Amount"
                placeholder="Enter amount"
                value={form.amount}
                onChangeText={(text: string) =>
                  setForm({ ...form, amount: text })
                }
                keyboardType="numeric"
              />

              <Select
                label="Category"
                placeholder="Select a category"
                value={form.categoryId}
                items={categories}
                onChange={(categoryId: number) =>
                  setForm({ ...form, categoryId })
                }
              />

              <Select
                label="Payment Method"
                placeholder="Select a payment method"
                value={form.paymentMethodId}
                items={paymentMethods}
                onChange={(paymentMethodId: number) =>
                  setForm({ ...form, paymentMethodId })
                }
              />

              <DatePickerInput
                label="Expense Date"
                value={form.expenseDate}
                onChange={(date) => setForm({ ...form, expenseDate: date })}
                maxDate={new Date()}
              />
            </View>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onPress={handleClose}>
              Cancel
            </Button>
            <Button onPress={handleSubmit} disabled={!isFormValid || loading}>
              {expense
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Adding..."
                  : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
);

AddExpenseModal.displayName = "AddExpenseModal";

export { AddExpenseModal };
