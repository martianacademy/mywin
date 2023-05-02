import React, { useEffect, useState } from 'react';

export const Children = ({ coinPrice }: { coinPrice: number }) => {
  const [price, setPrice] = useState(0);
  useEffect(() => {
    setPrice(price);
  }, [coinPrice, price]);

  console.log('hello');

  return <div>child</div>;
};
