import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
  Stack,
  Button,
} from "@chakra-ui/react";
import { TokenSymbol } from "../../constants";

export const ReferrerAddressInput = ({
  value,
  onChange,
  isDisabled,
  isInvalid,
  onClear,
  onSelectDefaultReferrer,
}: {
  value: string;
  onChange: (e: any) => void;
  isDisabled: boolean;
  isInvalid: boolean;
  onClear: () => void;
  onSelectDefaultReferrer: () => void;
}) => {
  return (
    <FormControl>
      <Stack>
        <FormHelperText>Please enter referrer address.</FormHelperText>
        <Input
          value={value}
          onChange={onChange}
          isReadOnly={isDisabled}
          isInvalid={isInvalid}
          placeholder={`Please enter the valid ${TokenSymbol} address.`}
          fontSize="sm"
        ></Input>
        <FormErrorMessage>Invalid referrer address.</FormErrorMessage>
        <HStack display={isDisabled ? "none" : "flex"}>
          <Button colorScheme="red" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            w="full"
            onClick={onSelectDefaultReferrer}
          >
            Use Default Referrer
          </Button>
        </HStack>
      </Stack>
    </FormControl>
  );
};
