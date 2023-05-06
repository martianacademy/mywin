import { Box, Center, Heading, Image, VStack, Icon } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ConnectWalletButton } from '../../components/ConnectWalletButton/ConnectWalletButton';
// @ts-ignore
import ModelViewer from '@metamask/logo';

export const ConnectWalletPage = () => {
  useEffect(() => {
    const container = document.getElementById('logo-container');
    if (!container) return;

    const viewer = ModelViewer({
      // pxNotRatio: true,
      width: 0.1,
      // height: 400,
      followMouse: true,
      slowDrift: true,
    });

    container.appendChild(viewer.container);

    return () => {
      viewer.stopAnimation();
      container.removeChild(viewer.container);
    };
  }, []);
  return (
    <Center w="full" minH="100vh">
      <VStack>
        <div id="logo-container"></div>
        {/* <Box id="logo-container" boxSize={100}/> */}
        <Heading textAlign="center" fontWeight={200}>
          Please connect wallet to continue
        </Heading>
        <ConnectWalletButton />
      </VStack>
    </Center>
  );
};
