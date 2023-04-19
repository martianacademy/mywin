import { ButtonProps, HStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export const ValueSelectButtons = ({
  onClick25,
  onClick50,
  onClick75,
  onClickMax,
  style,
}: {
  onClick25?: () => void;
  onClick50?: () => void;
  onClick75?: () => void;
  onClickMax?: () => void;
  style?: ButtonProps;
}) => {
  return (
    <HStack w="full" justify="space-around">
      <Button {...style} onClick={onClick25}>
        25
      </Button>
      <Button {...style} onClick={onClick50}>
        50
      </Button>
      <Button {...style} onClick={onClick75}>
        75
      </Button>
      <Button {...style} onClick={onClickMax}>
        Max
      </Button>
    </HStack>
  );
};
