import {
  Avatar,
  AvatarBadge,
  Button,
  Divider,
  HStack,
  Icon,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEthers } from "@usedapp/core";
import { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaIdCard,
  FaMoon,
  FaSun,
  FaTelegram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TokenSymbol } from "../../../constants";
import { ConnectWalletButton } from "../../ConnectWalletButton/ConnectWalletButton";
import { UserAddressActionButton } from "../../UI/UserAddressActionButton";

const MenuItemComponent = ({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon?: IconType;
  onClick?: () => void;
}) => {
  return (
    <MenuItem
      borderRadius="xl"
      bgColor="transparent"
      _hover={{
        boxShadow: "base",
        color: useColorModeValue("pink.500", "pink"),
      }}
      onClick={onClick}
    >
      <HStack w="full">
        <Text fontSize="sm">{name}</Text>
        <Spacer />
        {icon && <Icon as={icon} color="orange.500"></Icon>}
      </HStack>
    </MenuItem>
  );
};

export const NavMenu = () => {
  const { toggleColorMode } = useColorMode();
  const { account } = useEthers();
  const navigate = useNavigate();

  return (
    <MenuList
      borderRadius="3xl"
      p={5}
      bgColor={useColorModeValue("white", "gray.900")}
    >
      {account && (
        <>
          <VStack pb={[5, 10]}>
            <Avatar size="lg">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            {/* <Heading size="md">Name</Heading> */}
            {/* <HStack spacing={0} fontSize="sm">
              <Text>@</Text>
              <Text>username</Text>
            </HStack> */}

            <ConnectWalletButton
              style={{
                w: "full",
              }}
            />
            <UserAddressActionButton
              address={account}
              style={{
                size: "sm",
              }}
            />
          </VStack>
          <Divider />
          <VStack flex={1} justify="center" py={[5, 10]}>
            <MenuItemComponent
              name={"UserIDs"}
              icon={FaIdCard}
              onClick={() => navigate("/user")}
            ></MenuItemComponent>
          </VStack>
        </>
      )}

      <VStack py={5}>
        <Button
          borderRadius="xl"
          colorScheme="orange"
          rightIcon={<FontAwesomeIcon icon={faCrown}></FontAwesomeIcon>}
          bg="orange.500"
          _hover={{
            bg: "orange.600",
          }}
          onClick={() => {
            navigate("/");
          }}
          as={MenuItem}
        >
          Join {TokenSymbol}
        </Button>
      </VStack>
      <Divider />
      <VStack py={5}>
        <MenuItemComponent
          name={useColorModeValue("Light Theme", "Dark Theme")}
          icon={useColorModeValue(FaSun, FaMoon)}
          onClick={toggleColorMode}
        ></MenuItemComponent>
      </VStack>
      <VStack>
        <HStack w="70%" justify="space-around">
          <Icon cursor="pointer" as={FaTelegram}></Icon>
          <Icon cursor="pointer" as={FaTwitter}></Icon>
          <Icon cursor="pointer" as={FaGithub}></Icon>
          <Icon cursor="pointer" as={FaFacebook}></Icon>
          <Icon cursor="pointer" as={FaYoutube}></Icon>
        </HStack>
      </VStack>
    </MenuList>
  );
};
