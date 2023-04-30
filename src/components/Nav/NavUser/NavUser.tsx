import {
  Avatar,
  AvatarBadge,
  Button,
  Divider,
  HStack,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { BiLogInCircle } from "react-icons/bi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIDAccount } from "../../../hooks/ReferralHooks";
import { ConnectWalletButton } from "../../ConnectWalletButton/ConnectWalletButton";
import { UserAddressActionButton } from "../../UI";
import { NavMenuItems } from "../NavMenuItems";

export const NavUser = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { deactivate, account } = useEthers();
  const { userID } = useParams();
  const userIDAccount = useIDAccount(userID);
  return (
    <VStack
      w={250}
      bgColor={useColorModeValue("white", "gray.900")}
      minH="80vh"
      borderRadius="50px"
      position="sticky"
      top={0}
      py={10}
      spacing={10}
    >
      <VStack spacing={5}>
        <VStack>
          <Avatar>
            <AvatarBadge
              boxSize={5}
              bg={userIDAccount?.isActive ? "green" : "red"}
            ></AvatarBadge>
          </Avatar>
          <ConnectWalletButton
            style={{
              colorScheme: "green",
            }}
          />
          <UserAddressActionButton address={account}></UserAddressActionButton>
        </VStack>
        <VStack color="orange.500">
          <Text>ID: {userIDAccount?.id}</Text>
          {userIDAccount?.oldID.length > 0 && (
            <Text>oldID: {userIDAccount?.oldID}</Text>
          )}
        </VStack>
      </VStack>
      <Divider />
      <VStack flex={1}>
        {NavMenuItems?.map((itemsOject, key) => {
          return (
            <Button
              w="full"
              key={key}
              variant={
                pathname === `/user/dashboard/${userID}/${itemsOject?.link}`
                  ? "solid"
                  : "ghost"
              }
              fontSize="sm"
              borderRadius="xl"
              onClick={() => navigate(itemsOject?.link)}
              leftIcon={itemsOject.icon}
            >
              {itemsOject?.name}
            </Button>
          );
        })}
      </VStack>
      <HStack w="full" px={5}>
        {/* <ColorModeSwitcher size="lg" /> */}
        <Spacer />
        <Icon
          as={BiLogInCircle}
          cursor="pointer"
          boxSize={7}
          color="pink.500"
          onClick={deactivate}
        ></Icon>
      </HStack>
    </VStack>
  );
};
