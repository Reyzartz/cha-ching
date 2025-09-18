import { Pressable, Text, Modal as UIModal, View } from "react-native";
import { createContext, memo, PropsWithChildren, useContext } from "react";
import { Icon } from "../Icon";

interface IModalContext {
  onClose: () => void;
}

const ModalContext = createContext<IModalContext>({
  onClose: () => {},
});

interface IModalProps {
  open: boolean;
  onClose: () => void;
}

const Modal = memo(
  ({ open: visible, onClose, children }: PropsWithChildren<IModalProps>) => {
    return (
      <ModalContext.Provider value={{ onClose }}>
        <UIModal
          visible={visible}
          onRequestClose={onClose}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
        >
          <View className="justify-center items-center bg-black bg-opacity-50 p-10 h-full">
            <View className="rounded-lg overflow-hidden bg-white">
              {children}
            </View>
          </View>
        </UIModal>
      </ModalContext.Provider>
    );
  }
);

Modal.displayName = "Modal";

interface IModalHeaderProps {
  title: string;
}

const Header = memo(({ title }: PropsWithChildren<IModalHeaderProps>) => {
  const { onClose } = useContext(ModalContext);
  return (
    <View className="flex-row justify-between items-center px-5 py-3 bg-white border-b border-gray-200">
      <Text className="text-lg font-semibold">{title}</Text>

      <Pressable onPress={onClose}>
        <Icon name="close" size={20} color="#aaa" />
      </Pressable>
    </View>
  );
});

Header.displayName = "Header";

const Body = memo(({ children }: PropsWithChildren) => {
  return <View className="flex-1 p-5">{children}</View>;
});

Body.displayName = "Body";

const Footer = memo(({ children }: PropsWithChildren) => {
  return (
    <View className="flex-row px-5 py-3 bg-white border-t border-gray-200 justify-end gap-2">
      {children}
    </View>
  );
});

Footer.displayName = "Footer";

const ModalWithComponents = Object.assign(Modal, {
  Header,
  Body,
  Footer,
});

export { ModalWithComponents as Modal };
