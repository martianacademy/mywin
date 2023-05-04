import {
  Divider,
  Heading,
  Hide,
  HStack,
  Show,
  Spacer,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { Outlet, useParams } from 'react-router-dom';
import { NavUser } from '../../../components';
import { NavUserSmall } from '../../../components/Nav/NavUser/NavUserSmall';

export const Dashboard = () => {
  const { userID } = useParams();
  return (
    <VStack w="full">
      <Show below="md">
        <NavUserSmall />
      </Show>
      <VStack p={5} w="full">
        <HStack w="full" align="flex-start" spacing={5}>
          <Hide below="md">
            <NavUser />
          </Hide>
          <VStack
            minH="80vh"
            flex={1}
            bgColor={useColorModeValue('white', 'gray.900')}
            borderRadius="50px"
            w="full"
            py={10}
            px={5}
          >
            <HStack w="full">
              <Heading size="md">Hey! Welcome</Heading>
              <Spacer />
              <Heading size="sm" color="orange.500">User ID: {userID}</Heading>
            </HStack>
            <Divider />
            <Outlet />
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
