import { Wrap } from "@chakra-ui/react";
import { IDDashboard } from "./IDDashboard/IDDashboard";

export const UserDashboard = () => {
  return (
    <Wrap w="full" justify="center" p={5} spacing={10}>
      <IDDashboard></IDDashboard>
    </Wrap>
  );
};
