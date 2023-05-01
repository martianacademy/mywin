import {
  Box,
  chakra,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
  VStack,
  Button,
  Image,
  Icon,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import {
  FaInstagram,
  FaShieldAlt,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import { Logo } from '../Logo/Logo';
import {
  MyUSDLogo,
  ProjectName,
  useSupportedNetworkInfo,
} from '../../constants';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export function Footer() {
  const currentNetwork = useSupportedNetworkInfo[50000];
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      w="full"
      boxShadow="base"
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Logo />
            <Text fontSize={'sm'}>
              © 2022-2023 {ProjectName}. All rights reserved
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Link href={'#'}>About us</Link>
            <Link href={'#'}>Exchange</Link>
            <Link href={'#'}>Staking</Link>
            <Link href={'#'}>Testimonials</Link>
            <Link href={'#'}>Contact us</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Support</ListHeader>
            <Link href={'#'}>Help Center</Link>
            <Link href={'#'}>Terms of Service</Link>
            <Link href={'#'}>Legal</Link>
            <Link href={'#'}>Privacy Policy</Link>
            <Link href={'#'}>Satus</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={'row'}>
              <Input placeholder={'Your email address'} borderRadius="xl" />
              <IconButton
                bg={useColorModeValue('green.400', 'green.800')}
                color={useColorModeValue('white', 'gray.800')}
                _hover={{
                  bg: 'green.600',
                }}
                aria-label="Subscribe"
                icon={<BiMailSend />}
              />
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Contracts</ListHeader>
            <VStack justify="flex-start" align="flex-start">
              <Button
                as="a"
                target="_blank"
                href={`${currentNetwork?.Network?.getExplorerAddressLink(
                  currentNetwork?.MYUSD?.ContractAddress
                )}`}
                w={300}
                borderRadius="xl"
                h={12}
                color="pink.500"
                leftIcon={<Image src={MyUSDLogo} boxSize={7}></Image>}
                rightIcon={<ExternalLinkIcon />}
              >
                MyUSD
              </Button>
              <Button
                as="a"
                target="_blank"
                href={`${currentNetwork?.Network?.getExplorerAddressLink(
                  currentNetwork?.referralContractAddress
                )}`}
                w={300}
                borderRadius="xl"
                h={12}
                color="pink.500"
                leftIcon={<Icon as={FaUsers}></Icon>}
                rightIcon={<ExternalLinkIcon />}
              >
                Referral
              </Button>
              <Button
                as="a"
                target="_blank"
                href={`${currentNetwork?.Network?.getExplorerAddressLink(
                  currentNetwork?.stakingContractAddress
                )}`}
                w={300}
                borderRadius="xl"
                h={12}
                color="pink.500"
                leftIcon={<Icon as={FaShieldAlt}></Icon>}
                rightIcon={<ExternalLinkIcon />}
              >
                Future Secure Wallet
              </Button>
            </VStack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
