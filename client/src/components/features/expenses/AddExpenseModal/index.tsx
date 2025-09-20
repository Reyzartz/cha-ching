import { memo, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Modal, Button, Input, Icon, Select } from "@/components/ui";
import { useCategories, useExpenses, usePaymentMethods } from "@/hooks";

const AddExpenseModal = memo(() => {
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();
  const { paymentMethods } = usePaymentMethods();
  const { createExpense, loading } = useExpenses();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    categoryId: 0,
    paymentMethodId: 0,
  });

  const handleSubmit = useCallback(() => {
    if (
      !form.amount ||
      !form.categoryId ||
      !form.paymentMethodId ||
      !form.title
    )
      return;

    createExpense({
      userId: 1, // Hardcoded for now, should come from auth context
      title: form.title,
      amount: Number(form.amount),
      categoryId: form.categoryId,
      paymentMethodId: form.paymentMethodId,
      expenseDate: new Date().toISOString(),
    });

    setForm({
      title: "",
      amount: "",
      categoryId: 0,
      paymentMethodId: 0,
    });

    setOpen(false);
  }, [form, createExpense]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const isFormValid = form.amount && form.categoryId && form.paymentMethodId;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="absolute z-10 right-4 bottom-4 bg-blue-500 rounded-full p-4 shadow-lg"
      >
        <Icon name="plus" size={24} color="#fff" />
      </Pressable>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header title="Add Expense" />
        <Modal.Body>
          <View className="gap-4 min-w-96">
            <Input
              label="Title"
              placeholder="Enter title"
              value={form.title}
              onChangeText={(text: string) => setForm({ ...form, title: text })}
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
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onPress={handleClose}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} disabled={!isFormValid || loading}>
            Add Expense
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

AddExpenseModal.displayName = "AddExpenseModal";

export { AddExpenseModal };
