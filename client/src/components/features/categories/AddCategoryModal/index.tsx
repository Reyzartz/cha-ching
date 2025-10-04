import { memo, useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Modal, Button, Input, Icon } from "@/components/ui";
import { ICategory, useCategories } from "@/hooks";

interface IAddCategoryModalProps {
  category: ICategory | null;
  onClose: () => void;
  onOpen: () => void;
  visible: boolean;
}

const AddCategoryModal = memo(
  ({ category, onClose, onOpen, visible }: IAddCategoryModalProps) => {
    const { createCategory, updateCategory, loading } = useCategories();

    const [name, setName] = useState(category?.name || "");
    const [budget, setBudget] = useState(category?.budget || 0);

    const handleSubmit = useCallback(async () => {
      if (!name.trim()) return;

      if (category) {
        await updateCategory({
          id: category.id,
          name: name.trim(),
          budget,
        });
      } else {
        await createCategory({
          name: name.trim(),
          budget,
        });
      }

      setName("");
      setBudget(0);
      onClose();
    }, [name, category, onClose, updateCategory, budget, createCategory]);

    const handleClose = useCallback(() => {
      onClose();
      setName("");
      setBudget(0);
    }, [onClose]);

    const handleOpen = useCallback(() => {
      onOpen();
      setName("");
      setBudget(0);
    }, [onOpen]);

    const isFormValid = name.trim().length > 0;

    return (
      <>
        <Pressable
          onPress={handleOpen}
          className="absolute z-10 right-4 bottom-4 bg-blue-500 rounded-full p-4 shadow-lg"
        >
          <Icon name="plus" size={24} color="#fff" />
        </Pressable>

        <Modal open={visible} onClose={handleClose}>
          <Modal.Header title={category ? "Edit Category" : "Add Category"} />
          <Modal.Body>
            <View className="gap-4 min-w-96">
              <Input
                label="Name"
                placeholder="Enter category name"
                value={name}
                onChangeText={setName}
              />

              <Input
                label="Budget"
                placeholder="Enter budget amount"
                value={budget ? budget.toString() : ""}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setBudget(numericValue ? parseInt(numericValue, 10) : 0);
                }}
                keyboardType="numeric"
              />
            </View>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline" onPress={handleClose}>
              Cancel
            </Button>
            <Button onPress={handleSubmit} disabled={!isFormValid || loading}>
              {category
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
  }
);

AddCategoryModal.displayName = "AddCategoryModal";

export { AddCategoryModal };
