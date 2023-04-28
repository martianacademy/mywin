import {
  Card,
  Heading,
  HStack,
  Icon,
  Image,
  Skeleton,
  Spacer,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { IconType } from "react-icons";

export const BalancesCard = ({
  heading,
  currencyValue,
  currencySymbol,
  logo,
  icon,
}: {
  heading: string;
  currencyValue: string;
  currencySymbol: string;
  logo?: string;
  icon?: IconType;
}) => {
  const { account } = useEthers();
  const userNativeBalance = useEtherBalance(account);
  return (
    <Skeleton
      borderRadius="25px"
      isLoaded={userNativeBalance ? true : false}
      w="full"
    >
      <Card borderRadius="3xl" w="full" p={3} minW={200}>
        <HStack justify="space-around">
          <VStack w="full">
            <Heading size="sm" color="orange.500" fontWeight="semibold">
              {heading}
            </Heading>
            <Heading size="sm" wordBreak="break-all" fontWeight="semibold">
              {currencyValue}
            </Heading>
            <Heading
              size="xs"
              wordBreak="break-all"
              fontWeight="semibold"
              fontStyle="oblique"
              opacity={0.75}
            >
              {currencySymbol}
            </Heading>
          </VStack>
          <Spacer />
          {logo && <Image src={logo} boxSize={10} color="orange.500"></Image>}
          {icon && <Icon as={icon} boxSize={10} color="orange.500"></Icon>}
        </HStack>
      </Card>
    </Skeleton>
  );
};
