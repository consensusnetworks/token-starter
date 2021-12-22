const { expect } = require("chai");
const { formatUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Token", function () {
  it("Should return the new token once it's deployed", async function () {
    const Token = await ethers.getContractFactory("Token");

    const name = process.env.NAME || "TestToken";
    const symbol = process.env.SYMBOL || "TST";
    const decimals = parseInt(process.env.DECIMALS || "18");
    const supply = parseInt(process.env.SUPPLY || "100");

    const token = await Token.deploy(name, symbol, decimals, supply);
    await token.deployed();

    expect(await token.name()).to.equal(name);
    expect(await token.symbol()).to.equal(symbol);
    expect(await token.decimals()).to.equal(decimals);
    expect(parseInt(
      formatUnits(await token.totalSupply(), decimals)
    )).to.equal(supply);
  });
});
