import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UaiTokenModule = buildModule("UaiTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", 1000000n); // 1 million tokens

  const uaiToken = m.contract("UaiToken", [initialSupply]);

  return { uaiToken };
});

export default UaiTokenModule;
