import { AppHeader, CategoriesList, AddCategoryModal } from "@/components";
import { ICategory } from "@/hooks/useCategories";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const onEditCategory = useCallback((category: ICategory) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
  }, []);

  const onOpenModal = useCallback(() => {
    setShowCategoryModal(true);
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center">
      <AppHeader />

      <CategoriesList onEditCategory={onEditCategory} />

      <AddCategoryModal
        key={selectedCategory ? selectedCategory.id : "new"}
        category={selectedCategory}
        onClose={onCloseModal}
        visible={showCategoryModal}
        onOpen={onOpenModal}
      />
    </SafeAreaView>
  );
}
