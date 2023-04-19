import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Heading,
  HStack,
  IconButton,
  Image,
  Spacer,
  useClipboard,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { shortenAddress, useEthers } from "@usedapp/core";
import React from "react";
import { FaClipboard, FaCopy, FaPaste } from "react-icons/fa";
import { useSupportedNetworkInfo } from "../../../../constants";

export const NetworkInfoCard = () => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { onCopy, hasCopied } = useClipboard(account!);
  return (
    <HStack
      w="full"
      p={5}
      borderRadius="3xl"
      align="center"
      justify="center"
      boxShadow="md"
      bgColor={useColorModeValue("green.100", "whiteAlpha.200")}
    >
      <Wrap align="center" justify="center">
        <Heading fontSize="sm">{shortenAddress(account!)}</Heading>
        <HStack>
          <IconButton
            aria-label="User Address Copy Button"
            icon={hasCopied ? <CheckIcon /> : <FaCopy />}
            size="sm"
            borderRadius="xl"
            onClick={onCopy}
          ></IconButton>
          <IconButton
            aria-label="User Address Copy Button"
            icon={<ExternalLinkIcon />}
            size="sm"
            borderRadius="xl"
            as="a"
            href={currentNetwork?.Network?.getExplorerAddressLink(account!)}
            target="_blank"
          ></IconButton>
        </HStack>
      </Wrap>
      <Spacer />
      <Wrap align="center" justify="center">
        <Image src={currentNetwork?.Native.Logo} boxSize={7}></Image>
        <Heading size="xs" textAlign="center">
          {currentNetwork?.Native.Name}
        </Heading>
      </Wrap>
    </HStack>
  );
};
