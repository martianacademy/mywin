import {
  Avatar,
  AvatarBadge,
  Button,
  Divider,
  HStack,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { BiLogInCircle } from 'react-icons/bi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useIDAccount } from '../../../hooks/ReferralHooks';
import { ConnectWalletButton } from '../../ConnectWalletButton/ConnectWalletButton';
import { UserAddressActionButton } from '../../UI';
import { BasePathMenu, NavMenuItems } from '../NavMenuItems';

export const NavUser = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { deactivate, account } = useEthers();
  const { userID } = useParams();
  const userIDAccount = useIDAccount(userID ?? '0');
  return (
    <VStack
      w={250}
      bgColor={useColorModeValue('white', 'gray.900')}
      minH="80vh"
      borderRadius="50px"
      position="sticky"
      top={0}
      py={10}
      spacing={10}
    >
      <VStack spacing={5}>
        <VStack>
          <Avatar>
            <AvatarBadge
              boxSize={5}
              bg={userIDAccount?.isActive ? 'green' : 'red'}
            ></AvatarBadge>
          </Avatar>
          <ConnectWalletButton
            style={{
              colorScheme: 'green',
            }}
          />
          <UserAddressActionButton address={account}></UserAddressActionButton>
        </VStack>
        <VStack color="orange.500">
          <Text>ID: {userIDAccount?.id}</Text>
          {userIDAccount?.oldId.length > 0 && (
            <Text>oldID: {userIDAccount?.oldId}</Text>
          )}
        </VStack>
      </VStack>
      <Divider />
      <VStack flex={1}>
      <Button
          w="full"
          variant={pathname === BasePathMenu.link ? 'solid' : 'ghost'}
          fontSize="sm"
          borderRadius="xl"
          onClick={() => navigate(`${BasePathMenu.link}`)}
          leftIcon={BasePathMenu.icon}
        >
          {BasePathMenu.name}
        </Button>
        {NavMenuItems?.map((itemsOject, key) => {
          return (
            <Button
              w="full"
              key={key}
              variant={
                pathname === `/user/info/${itemsOject?.link}/${userID}`
                  ? 'solid'
                  : 'ghost'
              }
              fontSize="sm"
              borderRadius="xl"
              onClick={() => navigate(`${itemsOject?.link}/${userID}`)}
              leftIcon={itemsOject.icon}
            >
              {itemsOject?.name}
            </Button>
          );
        })}
      </VStack>
      <Divider></Divider>
      <HStack w="full" px={5}>
        {/* <ColorModeSwitcher size="lg" /> */}
        <Spacer />
        <HStack onClick={deactivate} cursor="pointer">
          <Text fontSize="sm" color="red">
            Log Out
          </Text>
          <Icon as={BiLogInCircle} boxSize={5} color="red"></Icon>
        </HStack>
      </HStack>
    </VStack>
  );
};
