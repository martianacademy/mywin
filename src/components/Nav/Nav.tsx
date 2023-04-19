import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";

import { CiMenuKebab } from "react-icons/ci";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";
import { Logo } from "../Logo/Logo";
import { NavMenu } from "./NavMenu/NavMenu";

export const Nav = () => {
  return (
    <HStack
      w="full"
      p={5}
      bgColor={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={11111}
    >
      <Logo />
      <Spacer></Spacer>
      <ConnectWalletButton />
      <Menu>
        <MenuButton>
          <Icon as={CiMenuKebab} cursor="pointer"></Icon>
        </MenuButton>
        <NavMenu />
      </Menu>
      <ColorModeSwitcher />
    </HStack>
  );
};
