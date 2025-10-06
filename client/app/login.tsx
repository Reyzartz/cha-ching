import { LoginForm } from "@/components/features/login/loginForm";
import { useAuth } from "@/hooks/useAuth";
import { View } from "react-native";

function Login() {
  const { login, error } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <LoginForm onLogin={login} error={error} />
    </View>
  );
}

export default Login;
