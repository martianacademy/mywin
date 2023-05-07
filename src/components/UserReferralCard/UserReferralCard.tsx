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
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { shortenAddress } from '@usedapp/core';
import { IconType } from 'react-icons';

import { FaShoppingCart, FaUsers } from 'react-icons/fa';
import { GiStairsGoal } from 'react-icons/gi';
import { HiUser, HiUsers } from 'react-icons/hi';
import { AddressZero, MyUSDLogo } from '../../constants';
import { useIDAccount, userIDAccountType } from '../../hooks/ReferralHooks';
import { CardContainer, UserAddressActionButton } from './../UI';
import { UserCard } from './UserCard';

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
  const userIDAccountJson = JSON.stringify(userIDAccount);

  return (
    <>
      <UserCard
        heading={heading}
        icon={icon}
        onOpen={onOpen!}
        userIDAccountJSON={userIDAccountJson}
      ></UserCard>
    </>
  );
};
