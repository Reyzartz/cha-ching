import {
  Platform,
  Pressable,
  Text,
  Modal as UIModal,
  View,
} from "react-native";
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
          animationType={Platform.OS === "web" ? "fade" : "slide"}
          presentationStyle="overFullScreen"
        >
          <View
            className={
              "bg-black bg-opacity-20 h-full " +
              Platform.select({
                web: "justify-center items-center p-10",
                default: "justify-end",
              })
            }
          >
            <View className="rounded-md overflow-hidden bg-white h-3/4 border border-gray-100 w-full max-w-lg">
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
    <View className="flex-row justify-between items-center px-3 py-2 bg-white border-b border-gray-100">
      <Text className="text-base font-semibold text-gray-900">{title}</Text>

      <Pressable onPress={onClose}>
        <Icon name="close" size={20} color="#aaa" />
      </Pressable>
    </View>
  );
});

Header.displayName = "Header";

const Body = memo(({ children }: PropsWithChildren) => {
  return <View className="flex-1 p-3 flex-shrink-0">{children}</View>;
});

Body.displayName = "Body";

const Footer = memo(({ children }: PropsWithChildren) => {
  return (
    <View className="flex-row px-3 py-2 bg-white border-t border-gray-100 justify-end gap-2">
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
