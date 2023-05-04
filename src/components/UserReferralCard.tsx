import {
  Avatar,
  AvatarBadge,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  Tag,
  Text,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { IconType } from "react-icons";

import { FaShoppingCart, FaUsers } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { HiUser, HiUsers } from "react-icons/hi";
import { AddressZero, MyUSDLogo} from "../constants";
import { useIDAccount } from "../hooks/ReferralHooks";
import { CardContainer, UserAddressActionButton } from "./UI";

export const UserReferralCard = ({
  id,
  heading,
  scale,
  icon,
  onOpen,
}: {
  id: string;
  heading: string;
  scale?: number;
  icon: IconType;
  onOpen?: () => void;
}) => {
  const userIDAccount = useIDAccount(id);

  return (
    <>
      <CardContainer
        props={{
          maxW: 300,
        }}
        onClick={onOpen}
      >
        <VStack spacing={5}>
          <VStack spacing={0} color="orange.500">
            <Heading size="sm">{heading} ID</Heading>
            <Heading size="md">{userIDAccount.id}</Heading>
          </VStack>
          {userIDAccount.id && (
            <VStack spacing={0} color="orange.500">
              <Heading size="sm">Old ID</Heading>
              <Heading size="md">{userIDAccount.oldId}</Heading>
            </VStack>
          )}

          <Divider />
          <VStack>
            <Avatar icon={<Icon as={icon} boxSize={7}></Icon>} bg="orange.500">
              <AvatarBadge
                boxSize={5}
                bgColor={userIDAccount?.isActive ? "green" : "red"}
              ></AvatarBadge>
            </Avatar>

            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme={
                userIDAccount?.owner !== AddressZero ? "green" : "red"
              }
              borderColor={
                userIDAccount?.owner !== AddressZero ? "transparent" : "red"
              }
              borderWidth="thin"
            >
              {userIDAccount?.owner === AddressZero
                ? "Address not updated"
                : shortenAddress(userIDAccount?.owner)}
            </Tag>
            {userIDAccount?.owner !== AddressZero && (
              <UserAddressActionButton
                address={userIDAccount?.owner}
                style={{
                  size: "sm",
                }}
              ></UserAddressActionButton>
            )}

            <Tag colorScheme={userIDAccount?.isActive ? "green" : "red"}>
              Status: {userIDAccount?.isActive ? "green" : "red"}
            </Tag>
            <HStack>
              <Tag p={2} borderRadius="xl">
                <HStack color="orange.500">
                  <Icon as={HiUsers} boxSize={5}></Icon>
                  <Heading size="md">
                    {userIDAccount?.refereeIds?.length}
                  </Heading>
                </HStack>
              </Tag>
              <Tag p={2} borderRadius="xl">
                <HStack color="orange.500">
                  <Icon as={FaUsers} boxSize={5}></Icon>
                  <Heading size="md">{userIDAccount?.teamIds?.length}</Heading>
                </HStack>
              </Tag>
            </HStack>
          </VStack>
          <Wrap align="center" justify="center">
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="orange"
            >
              <HStack>
                <Icon as={HiUser}></Icon>
                <Icon as={FaShoppingCart}></Icon>
                <Text>
                  {(userIDAccount?.selfBusinessOld +
                    userIDAccount?.selfBusiness).toFixed(2)}
                </Text>
                <Image src={MyUSDLogo} boxSize={3}></Image>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="orange"
            >
              <HStack>
                <Icon as={HiUsers}></Icon>
                <Icon as={FaShoppingCart}></Icon>
                <Text>
                  {(userIDAccount?.directBusinessOld +
                    userIDAccount?.directBusiness).toFixed(2)}
                </Text>
                <Image src={MyUSDLogo} boxSize={3}></Image>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="orange"
            >
              <HStack>
                <Icon as={FaUsers}></Icon>
                <Icon as={FaShoppingCart}></Icon>
                <Text>
                  {(userIDAccount?.teamBusinessOld +
                    userIDAccount?.teamBusiness).toFixed(2)}
                </Text>
                <Image src={MyUSDLogo} boxSize={3}></Image>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="orange"
            >
              <HStack>
                <Icon as={GiStairsGoal}></Icon>
                <Text>{userIDAccount?.royaltyClubPackageId}</Text>
              </HStack>
            </Tag>
          </Wrap>
        </VStack>
      </CardContainer>
    </>
  );
};
