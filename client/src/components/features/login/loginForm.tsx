import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { Card, Input, Button } from "@/components/ui";
import { ILoginPayload } from "@/services/api/auth";
import { NetworkError } from "@/utils/NetworkError";

interface ILoginFormProps {
  onLogin: (payload: ILoginPayload) => void;
  error: NetworkError | null;
}

const LoginForm = ({ onLogin, error }: ILoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setIsValid(false);
      return;
    }

    setIsValid(true);

    onLogin({ email, password });
  }, [email, password, onLogin]);

  return (
    <Card className="p-4 w-11/12 max-w-md">
      <Text className="text-xl font-bold text-center mb-4">Login</Text>

      {error && (
        <Text className="text-red-500 text-center mb-2">{error.message}</Text>
      )}

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="mb-4"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        className="mb-4"
      />

      <Button onPress={handleLogin} className="mt-2" disabled={!isValid}>
        Login
      </Button>
    </Card>
  );
};

export { LoginForm };
