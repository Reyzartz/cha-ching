import { SignUpForm } from "@/components/features/signup/SignUpForm";
import { useUser } from "@/hooks/useUser";
import { View } from "react-native";

function SignUp() {
  const { createUser, error } = useUser();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <SignUpForm onSignUp={createUser} error={error} />
    </View>
  );
}

export default SignUp;
