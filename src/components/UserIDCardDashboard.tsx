import {
  CircularProgress,
  Divider,
  Heading,
  HStack,
  Tag,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import {
  useGetIDRewardPaid,
  useGetIDTeam,
  useGetIDTotalBusiness,
} from "../hooks/ReferralHooks";

const MotionVStack = motion(VStack);

const backgrounds = [
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED64A6' /%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%23F56565' /%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%2338B2AC' /%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED8936' /%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
  `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
];

export const UserIDCardDashboard = ({ id }: { id: number }) => {
  const getIDBusiness = useGetIDTotalBusiness(id);
  const getIDTeam = useGetIDTeam(id);
  const getIDReward = useGetIDRewardPaid(id);

  return (
    <VStack
      zIndex={1}
      position={"relative"}
      _before={{
        content: '""',
        position: "absolute",
        zIndex: "-1",
        height: "full",
        width: "full",
        filter: "blur(40px)",
        backgroundSize: "cover",
        transform: "scale(0.9)",
        top: 0,
        left: 0,
        backgroundImage: backgrounds[id % 4],
      }}
    >
      <MotionVStack
        borderWidth="thin"
        p={5}
        borderRadius="50px"
        cursor="pointer"
        spacing={5}
        bgColor={useColorModeValue("white", "gray.900")}
        maxW={300}
        whileHover={{
          y: -10,
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.97,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
        }}
      >
        <HStack w="full" justify="space-around">
          <VStack>
            <Heading>{id}</Heading>
            <Tag colorScheme="green">active</Tag>
          </VStack>
          <CircularProgress
            value={30}
            size="100px"
            thickness="15px"
          ></CircularProgress>
        </HStack>
        <Divider />
        <Wrap justify="center" align="center" maxW={300}>
          <Tag colorScheme="blue">Value: ${getIDBusiness.selfBusinessUSD}</Tag>
          <Tag colorScheme="blue">
            Reward: ${getIDReward.totalRewardPaid.toFixed(2)}
          </Tag>
          <Tag colorScheme="blue">Team: {getIDTeam.teamCount}</Tag>
          <Tag colorScheme="blue">
            Business: ${getIDBusiness.teamBusinessUSD}
          </Tag>
        </Wrap>
      </MotionVStack>
    </VStack>
  );
};
