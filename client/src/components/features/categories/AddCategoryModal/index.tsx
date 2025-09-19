import { memo, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Modal, Button, Input, Icon } from "@/components/ui";
import { useCategories } from "@/hooks";

const AddCategoryModal = memo(() => {
  const [open, setOpen] = useState(false);
  const { createCategory, loading } = useCategories();

  const [name, setName] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return;

    await createCategory({
      name: name.trim(),
    });

    setName("");
    setOpen(false);
  }, [name, createCategory]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setName("");
  }, []);

  const isFormValid = name.trim().length > 0;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="absolute right-4 bottom-4 bg-blue-500 rounded-full p-4 shadow-lg"
      >
        <Icon name="plus" size={24} color="#fff" />
      </Pressable>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header title="Add Category" />
        <Modal.Body>
          <View className="gap-4 min-w-96">
            <Input
              label="Name"
              placeholder="Enter category name"
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
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

AddCategoryModal.displayName = "AddCategoryModal";

export { AddCategoryModal };
