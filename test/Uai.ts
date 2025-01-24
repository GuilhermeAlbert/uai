import { expect } from "chai";
import { ethers } from "hardhat";

describe("UaiCoin", function () {
  it("Should deploy the contract with the correct total supply", async function () {
    const [owner] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const parsedSupply = ethers.parseEther(initialSupply.toString());

    expect(await uaicoin.totalSupply()).to.equal(parsedSupply);

    expect(await uaicoin.balanceOf(owner.address)).to.equal(parsedSupply);
  });

  it("Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const amountToTransfer = ethers.parseEther("1000");
    const halfAmount = ethers.parseEther("500");

    await uaicoin.transfer(addr1.address, amountToTransfer);
    expect(await uaicoin.balanceOf(addr1.address)).to.equal(amountToTransfer);

    await uaicoin.connect(addr1).transfer(addr2.address, halfAmount);
    expect(await uaicoin.balanceOf(addr2.address)).to.equal(halfAmount);
  });

  it("Should fail when transferring more than balance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const amountToTransfer = ethers.parseEther("1");

    await expect(
      uaicoin.connect(addr1).transfer(owner.address, amountToTransfer)
    ).to.be.reverted;
  });

  it("Should allow approved transfers", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const amountToApprove = ethers.parseEther("1000");

    await uaicoin.approve(addr1.address, amountToApprove);

    await uaicoin
      .connect(addr1)
      .transferFrom(owner.address, addr1.address, amountToApprove);

    expect(await uaicoin.balanceOf(addr1.address)).to.equal(amountToApprove);
  });

  it("Should emit a Transfer event", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const amountToTransfer = ethers.parseEther("1000");

    await expect(uaicoin.transfer(addr1.address, amountToTransfer))
      .to.emit(uaicoin, "Transfer")
      .withArgs(owner.address, addr1.address, amountToTransfer);
  });

  it("Should burn tokens and reduce total supply", async function () {
    const [owner] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const burnAmount = ethers.parseEther("1000");

    await uaicoin.burn(burnAmount);

    expect(await uaicoin.totalSupply()).to.equal(
      ethers.parseEther((initialSupply - 1000).toString())
    );

    expect(await uaicoin.balanceOf(owner.address)).to.equal(
      ethers.parseEther((initialSupply - 1000).toString())
    );
  });

  it("Should fail when trying to transfer more than approved", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const initialSupply = 100_000_000;
    const UaiCoin = await ethers.getContractFactory("UaiCoin");
    const uaicoin = await UaiCoin.deploy(initialSupply);

    const amountToApprove = ethers.parseEther("500");
    const amountToTransfer = ethers.parseEther("1000");

    await uaicoin.approve(addr1.address, amountToApprove);

    await expect(
      uaicoin
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, amountToTransfer)
    ).to.be.reverted;
  });
});
