import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  ButtonProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Text,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { FaUser } from "react-icons/fa";
import { UserAddressActionButton } from "./UserAddressActionButton";

export const UserRefereeCard = ({
  address,
  style,
  onClick,
}: {
  address: string | undefined;
  style?: ButtonProps;
  onClick?: () => void;
}) => {
  const { onCopy, hasCopied } = useClipboard(address!);
  return (
    <VStack
      p={5}
      bgColor={useColorModeValue("white", "whiteAlpha.200")}
      borderRadius="25px"
    >
      <Icon as={FaUser} boxSize={7} onClick={onClick}></Icon>
      <Text fontSize="sm">{shortenAddress(address!)}</Text>
      <UserAddressActionButton address={address} style={style} />
    </VStack>
  );
};
