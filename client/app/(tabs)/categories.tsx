import { AppHeader, CategoriesList, AddCategoryModal } from "@/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Categories() {
  return (
    <SafeAreaView className="flex-1 items-center">
      <AppHeader />

      <CategoriesList />

      <AddCategoryModal />
    </SafeAreaView>
  );
}
