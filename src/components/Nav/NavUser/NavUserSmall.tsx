import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Collapse,
  Divider,
  Heading,
  HStack,
  Icon,
  Spacer,
  StackDivider,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NavMenuItems } from "../NavMenuItems";

export const NavUserSmall = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { userID } = useParams();
  const { pathname } = useLocation();
  return (
    <VStack
      w="full"
      position="sticky"
      top="80px"
      zIndex={10}
      filter="auto"
      backdropFilter="blur(25px) "
      p={2}
    >
      <HStack w="full" px={5} onClick={onToggle}>
        <Tag colorScheme="green">
          <Heading size="sm">
            {pathname === `/user/dashboard/${userID}`
              ? "Dashboard"
              : NavMenuItems?.map((itemsOject, key) => {
                  return (
                    pathname ===
                      `/user/info/${itemsOject.link}/${userID}` &&
                    itemsOject?.name
                  );
                })}
          </Heading>
        </Tag>
        <Spacer />
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon}></Icon>
      </HStack>
      {isOpen && <Divider />}
      <Collapse in={isOpen} animateOpacity>
        <VStack divider={<StackDivider />} w={300}>
          {NavMenuItems.map((menuObject, key) => {
            return (
              <HStack w="full" px={5} key={key}>
                <Text
                  w="full"
                  fontSize="sm"
                  onClick={() => {
                    onToggle();
                    navigate(menuObject.link);
                  }}
                >
                  {menuObject?.name}
                </Text>
                {menuObject.icon}
              </HStack>
            );
          })}
        </VStack>
      </Collapse>
    </VStack>
  );
};
