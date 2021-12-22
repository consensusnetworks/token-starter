const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("Hello, world!");
    await token.deployed();

    expect(await token.greet()).to.equal("Hello, world!");

    const setGreetingTx = await token.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await token.greet()).to.equal("Hola, mundo!");
  });
});
