import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { Card, Input, Button } from "@/components/ui";
import { ICreateUserPayload } from "@/services/api/user";
import { NetworkError } from "@/utils/NetworkError";

interface ISignUpFormProps {
  onSignUp: (payload: ICreateUserPayload) => void;
  error: NetworkError | null;
}

const SignUpForm = ({ onSignUp, error }: ISignUpFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSignUp = useCallback(() => {
    if (!name || !email || !password) {
      setIsValid(false);
      return;
    }

    setIsValid(true);

    onSignUp({ name, email, password });
  }, [name, email, password, onSignUp]);

  return (
    <Card className="p-4 w-11/12 max-w-md">
      <Text className="text-xl font-bold text-center mb-4">Sign Up</Text>

      {error && (
        <Text className="text-red-500 text-center mb-2">{error.message}</Text>
      )}

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        className="mb-4"
      />
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

      <Button onPress={handleSignUp} className="mt-2" disabled={!isValid}>
        Sign Up
      </Button>
    </Card>
  );
};

export { SignUpForm };
