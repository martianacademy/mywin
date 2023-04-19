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
import { Children } from "react";
import { IconType } from "react-icons";

export const BalancesCard = ({
  currencyName,
  currencyValue,
  logo,
  icon,
  lottie,
}: {
  currencyName: string;
  currencyValue: string;
  logo?: string;
  icon?: IconType;
  lottie?: any;
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
          <VStack>
            <Heading size="sm" color="pink.500" fontWeight="semibold">
              {currencyName}
            </Heading>
            <Heading size="sm" wordBreak="break-all" fontWeight="semibold">
              {currencyValue}
            </Heading>
          </VStack>
          <Spacer />
          {logo && <Image src={logo} boxSize={7} color="pink.500"></Image>}
          {icon && <Icon as={icon} boxSize={7} color="pink.500"></Icon>}
          {lottie && lottie}
        </HStack>
      </Card>
    </Skeleton>
  );
};
