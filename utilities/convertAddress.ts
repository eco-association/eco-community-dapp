const ConvertStringToAddress = (address: string): `0x${string}` => {
  const value = address.startsWith("0x") ? address.split("0x")[1] : address;
  return `0x${value}`;
};

export default ConvertStringToAddress;
