import {
  Heading,
  Input,
  VStack,
  Icon,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import React from "react";
import { IconType } from "react-icons";
import { FaUserGraduate } from "react-icons/fa";
import { UserAddressActionButton } from "./UserAddressActionButton";

export const UserCardTeam = ({
  address,
  heading,
  icon,
  explorerLink,
  onClick,
}: {
  address: string | undefined;
  heading: string;
  icon: IconType;
  explorerLink: string;
  onClick?: () => void;
}) => {
  return (
    <Card w={300} borderRadius="50px">
      <CardHeader>
        {heading && (
          <Heading size="sm" w="full" textAlign="center">
            {heading}
          </Heading>
        )}
      </CardHeader>
      <CardBody>
        <VStack spacing={5}>
          <Icon as={icon} boxSize={10} onClick={onClick}></Icon>
          <Tooltip label={address} borderRadius="xl">
            <Heading size="sm">{shortenAddress(address!)}</Heading>
          </Tooltip>
          <UserAddressActionButton address={address}></UserAddressActionButton>
        </VStack>
      </CardBody>
    </Card>
  );
};
