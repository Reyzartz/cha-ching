import { memo, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { useExpenses } from "@/context/expenses";
import { Modal, Button, Input, Icon } from "@/components/ui";

const AddExpenseModal = memo(() => {
  const [open, setOpen] = useState(false);
  const { addExpense } = useExpenses();
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const handleSubmit = useCallback(() => {
    if (!form.name || !form.amount || !form.category) return;

    addExpense({
      name: form.name,
      amount: Number(form.amount),
      category: form.category,
      date: new Date().toISOString(),
    });

    setForm({
      name: "",
      amount: "",
      category: "",
    });

    setOpen(false);
  }, [form, addExpense]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const isFormValid = form.name && form.amount && form.category;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="absolute right-4 bottom-4 bg-blue-500 rounded-full p-4 shadow-lg"
      >
        <Icon name="plus" size={24} color="#fff" />
      </Pressable>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header title="Add Expense" />
        <Modal.Body>
          <View className="gap-4 min-w-96">
            <Input
              label="Expense Name"
              placeholder="Enter expense name"
              value={form.name}
              onChangeText={(text: string) => setForm({ ...form, name: text })}
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

            <Input
              label="Category"
              placeholder="Enter category"
              value={form.category}
              onChangeText={(text: string) =>
                setForm({ ...form, category: text })
              }
            />
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onPress={handleClose}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} disabled={!isFormValid}>
            Add Expense
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

AddExpenseModal.displayName = "AddExpenseModal";

export { AddExpenseModal };
