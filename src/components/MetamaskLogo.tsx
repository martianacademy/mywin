import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
//@ts-ignore
import { ModelViewer } from '@metamask/logo';

export const MetamaskLogo: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById('logo-container');
    if (!container) return;

    const viewer = ModelViewer({
      pxNotRatio: true,
    //   width: 500,
    //   height: 400,
      followMouse: true,
      slowDrift: true,
    });

    container.appendChild(viewer.container);
    // viewer.lookAt({
    //   x: 100,
    //   y: 100,
    // });
    // viewer.setFollowMouse(true);

    return () => {
      viewer.stopAnimation();
    };
  }, []);

  return <Box id="logo-container" />;
};
