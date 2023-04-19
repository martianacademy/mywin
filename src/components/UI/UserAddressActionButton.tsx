import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  ButtonProps,
  HStack,
  IconButton,
  Link,
  useClipboard,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useSupportedNetworkInfo } from "../../constants";

export const UserAddressActionButton = ({
  address,
  style,
}: {
  address: string | undefined;
  style?: ButtonProps;
}) => {
  const { chainId } = useEthers();
  const currenNetwork = useSupportedNetworkInfo[chainId!];
  const { onCopy, hasCopied } = useClipboard(address!);
  return (
    <HStack>
      <IconButton
        variant="outline"
        aria-label="User Address Copy Button"
        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
        onClick={onCopy}
        borderRadius="xl"
        {...style}
      ></IconButton>
      <Link
        href={currenNetwork?.Network?.getExplorerAddressLink(address!)}
        target="_blank"
      >
        <IconButton
          variant="outline"
          aria-label="User Address Explorer Link Icon"
          icon={<ExternalLinkIcon />}
          borderRadius="xl"
          {...style}
        ></IconButton>
      </Link>
    </HStack>
  );
};
