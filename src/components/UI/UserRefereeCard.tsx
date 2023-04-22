import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  ButtonProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Tag,
  Text,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { FaUser } from "react-icons/fa";
import { useIDAccount } from "../../hooks/ReferralHooks";
import { UserAddressActionButton } from "./UserAddressActionButton";

export const UserRefereeCard = ({
  userID,
  style,
  onClick,
}: {
  userID?: string;
  style?: ButtonProps;
  onClick?: () => void;
}) => {
  const userIDAccount = useIDAccount(userID);
  const { onCopy, hasCopied } = useClipboard(userIDAccount?.owner);
  return (
    <VStack
      p={5}
      bgColor={useColorModeValue("white", "whiteAlpha.200")}
      borderRadius="25px"
    >
      <Icon as={FaUser} boxSize={7} onClick={onClick}></Icon>
      <Tag colorScheme="green">User ID: {userID}</Tag>
      <Text fontSize="sm">{shortenAddress(userIDAccount?.owner)}</Text>
      <UserAddressActionButton address={userIDAccount?.owner} style={style} />
    </VStack>
  );
};
