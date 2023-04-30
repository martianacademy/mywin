import {
  Flex,
  Heading,
  Icon,
  VStack,
  Wrap,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  HStack,
  Divider,
  useDisclosure,
  ModalBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowDown, FaUserAstronaut, FaUserCheck } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { UserReferralCard } from "../../../components";
import { useIDAccount } from "../../../hooks/ReferralHooks";

export const Team = () => {
  const { userID } = useParams();
  const userIDAccount = useIDAccount(userID!);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalID, setModalID] = useState("");
  return (
    <VStack py={10} px={5} spacing={10} w="full">
      <Heading>Your Team Object</Heading>
      {Number(userIDAccount.refererID) > 0 && (
        <VStack>
          <UserReferralCard
            heading="Referrer"
            icon={FaUserAstronaut}
            id={userIDAccount?.refererID}
            onOpen={() => {
              setModalID(userIDAccount?.refererID);
              onOpen();
            }}
          ></UserReferralCard>
          <Icon as={FaArrowDown} boxSize={10}></Icon>
        </VStack>
      )}
      <VStack>
        <UserReferralCard
          heading="Your"
          icon={FaUserCheck}
          id={userIDAccount?.id}
          onOpen={() => {
            setModalID(userIDAccount?.id);
            onOpen();
          }}
        ></UserReferralCard>
        <Icon as={FaArrowDown} boxSize={10}></Icon>
      </VStack>
      <VStack w="full">
        {userIDAccount?.refereeIDs.length > 0 ? (
          <Wrap justify="center"  w="full" spacing={5} overflow="visible">
            {userIDAccount?.refereeIDs.map((id: string, key: number) => {
              return (
                <UserReferralCard
                  heading="Referee"
                  icon={HiUsers}
                  id={id}
                  onOpen={() => {
                    setModalID(id);
                    onOpen();
                  }}
                ></UserReferralCard>
              );
            })}
          </Wrap>
        ) : (
          <Heading>You have no referee</Heading>
        )}
      </VStack>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="100vw"
        motionPreset="scale"
      >
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="10px" />
        <ModalContent
          borderRadius="50px"
          py={10}
          overflow="scroll"
          h="95vh"
          w="95vw"
          scrollBehavior="auto"
          bgColor={useColorModeValue("white", "gray.900")}
          borderWidth="thin"
        >
          <ModalHeader>
            <HStack w="full">
              <Heading size="sm">User Information</Heading>
              <Spacer />
              <Heading size="sm" color="orange.500">
                userID: {modalID}
              </Heading>
            </HStack>
          </ModalHeader>
          <Divider />
          <ModalBody py={10}>
            <UserReferralCard
              heading="Referee"
              icon={HiUsers}
              id={modalID}
            ></UserReferralCard>
          </ModalBody>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </VStack>
  );
};
