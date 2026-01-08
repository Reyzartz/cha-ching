import { memo, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Modal, Button, Input, Icon } from "@/components/ui";
import { usePaymentMethods } from "@/hooks";

const AddPaymentMethodModal = memo(() => {
  const [open, setOpen] = useState(false);
  const { createPaymentMethod, loading } = usePaymentMethods();

  const [name, setName] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;

    await createPaymentMethod({
      name: name.trim(),
    });

    setName("");
    setOpen(false);
  }, [name, createPaymentMethod]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setName("");
  }, []);

  const isFormValid = name.trim().length > 0;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="absolute z-10 right-4 bottom-4 bg-blue-500 rounded-full p-4 shadow-lg"
      >
        <Icon name="plus" size={24} color="#fff" />
      </Pressable>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header title="Add Payment Method" />
        <Modal.Body>
          <View className="gap-4">
            <Input
              label="Name"
              placeholder="Enter payment method name"
              value={name}
              onChangeText={setName}
            />
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onPress={handleClose}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} disabled={!isFormValid || loading}>
            Add Payment Method
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

AddPaymentMethodModal.displayName = "AddPaymentMethodModal";

export { AddPaymentMethodModal };
