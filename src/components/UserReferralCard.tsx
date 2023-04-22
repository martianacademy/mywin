import {
  Avatar,
  Card,
  CardBody,
  Divider,
  Heading,
  VStack,
  Icon,
  AvatarBadge,
  Tag,
  Wrap,
  Image,
  HStack,
  Text,
} from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { motion } from "framer-motion";
import React from "react";
import { IconType } from "react-icons";

import {
  FaShoppingBasket,
  FaShoppingCart,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { HiUsers, HiUser } from "react-icons/hi";
import { AddressZero, MyUSDLogo } from "../constants";
import { useIDAccount } from "../hooks/ReferralHooks";
import { UserAddressActionButton } from "./UI";

const MotionCard = motion(Card);

export const UserReferralCard = ({
  id,
  heading,
  scale,
  icon,
}: {
  id: string;
  heading: string;
  scale?: number;
  icon: IconType;
}) => {
  const userIDAccount = useIDAccount(id);
  console.log(userIDAccount);
  return (
    <MotionCard
      borderRadius="50px"
      maxW={300}
      animate={{
        scale: scale,
      }}
      whileHover={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 700,
      }}
    >
      <CardBody>
        <VStack spacing={3}>
          <VStack spacing={0} color="pink.500">
            <Heading size="md">{heading} ID</Heading>
            <Heading>{userIDAccount.id}</Heading>
          </VStack>
          <Divider />
          <VStack>
            <Avatar icon={<Icon as={icon} boxSize={7}></Icon>} bg="pink.500">
              <AvatarBadge
                boxSize={5}
                bgColor={userIDAccount?.isDisabled ? "red" : "green.400"}
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

            <Tag colorScheme={userIDAccount?.isDisabled ? "red" : "green"}>
              Status: {userIDAccount?.isDisabled ? "Inactive" : "Active"}
            </Tag>
          </VStack>
          <Wrap align="center" justify="center">
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="pink"
            >
              <HStack>
                <Icon as={FaUsers}></Icon>
                <Text>{userIDAccount?.teamIDs?.length}</Text>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="pink"
            >
              <HStack>
                <Icon as={HiUser}></Icon>
                <Icon as={FaShoppingCart}></Icon>
                <Text>{userIDAccount?.selfBusinessUSD}</Text>
                <Image src={MyUSDLogo} boxSize={3}></Image>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="pink"
            >
              <HStack>
                <Icon as={HiUsers}></Icon>
                <Icon as={FaShoppingCart}></Icon>
                <Text>{userIDAccount?.directBusinessUSD}</Text>
                <Image src={MyUSDLogo} boxSize={3}></Image>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="pink"
            >
              <HStack>
                <Icon as={FaUsers}></Icon>
                <Icon as={FaShoppingCart}></Icon>
                <Text>{userIDAccount?.teamBusinessUSD}</Text>
                <Image src={MyUSDLogo} boxSize={3}></Image>
              </HStack>
            </Tag>
            <Tag
              borderRadius="lg"
              _hover={{
                transform: "scale(1.05)",
              }}
              colorScheme="pink"
            >
              <HStack>
                <Icon as={GiStairsGoal}></Icon>
                <Text>{userIDAccount?.royaltyClubPackageID}</Text>
              </HStack>
            </Tag>
          </Wrap>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};
