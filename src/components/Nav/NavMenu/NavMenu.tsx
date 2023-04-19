import {
  Avatar,
  AvatarBadge,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useClipboard,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { IconType } from "react-icons";
import {
  FaChartArea,
  FaFacebook,
  FaGithub,
  FaIdCard,
  FaMoon,
  FaPiggyBank,
  FaSun,
  FaTelegram,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from "react-icons/fa";
import { IoMdFlame } from "react-icons/io";
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useSupportedNetworkInfo, website } from "../../../constants";
import { ConnectWalletButton } from "../../ConnectWalletButton/ConnectWalletButton";
import { UserAddressActionButton } from "../../UI/UserAddressActionButton";
import { NavMenuItems } from "../NavMenuItems";

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
        {icon && <Icon as={icon}></Icon>}
      </HStack>
    </MenuItem>
  );
};

export const NavMenu = () => {
  const { toggleColorMode } = useColorMode();
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const navigate = useNavigate();
  const referralLink = website;
  const { onCopy, hasCopied } = useClipboard(`${referralLink}/${account}`);
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
            <Heading size="md">Name</Heading>
            <HStack spacing={0} fontSize="sm">
              <Text>@</Text>
              <Text>username</Text>
            </HStack>

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
          <Button
            borderRadius="xl"
            colorScheme={hasCopied ? "green" : "pink"}
            onClick={onCopy}
          >
            {hasCopied ? "Referral Link Copied" : "Copy Referral Link"}
          </Button>
        </>
      )}

      <VStack py={5}>
        <MenuItemComponent
          name={`Stake ${currentNetwork?.Native?.Symbol}`}
          icon={IoMdFlame}
          onClick={() => navigate("/")}
        ></MenuItemComponent>
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
