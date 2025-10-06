import { LoginForm } from "@/components/features/login/loginForm";
import { useAuth } from "@/hooks/useAuth";
import { View } from "react-native";
import { Link } from "expo-router";

function Login() {
  const { login, error } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <LoginForm onLogin={login} error={error} />
      <Link href="/signup" className="mt-4 text-blue-500">
        Don&apos;t have an account? Sign up here.
      </Link>
    </View>
  );
}

export default Login;
