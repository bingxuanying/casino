const { diamondInit1 } = require("../test/utils/utils");
const fs = require("fs");
const _ = require("lodash");
const chalk = require("chalk");
const {
  upgrade,
  upgradeWithNewFacets,
} = require("../scripts/libraries/diamond-util");
let diamondAddress;
async function main() {
  await copyArtifacts();
  return;
  diamondAddress = await readDiamondAddress();
  await upgradeStaker();
  // await checkStakerBalance();

  await readDiamondMap();
}
async function upgradeStaker() {
  await upgradeWithNewFacets({
    diamondAddress,
    facetNames: ["StakerFacet"],
    libraries: {
      //  RouletteFacet: ["LibRulette"],
    },
    librariesAddresses: {
      RouletteFacet: {
        LibRulette: "0x1Cc1161F4AB263a091c07e25e108B7720bF3183B",
      },
    },
    // selectorsToRemove = [],
    // initFacetName = undefined,
    // initArgs = [],
  });
}
async function readDiamondMap() {
  // console.log("diamondAddress", diamondAddress);
  const loupe = await ethers.getContractAt("DiamondLoupeFacet", diamondAddress);
  const facetAddresses = await loupe.facetAddresses();
  let deployDic = await readDeployDic();
  // console.log(facetAddresses);
  console.log("Facets:");
  let funcSelectorsPerfacet = [];
  // const getPromise = (facetAddr) => {
  //   return loupe.facetFunctionSelectors()
  // };
  // _.forEach(facetAddresses, (e) => {
  //   funcSelectorsPerfacet.push(loupe.facetFunctionSelectors(e))
  // });
  for (let index = 0; index < facetAddresses.length; index++) {
    const facetAddr = facetAddresses[index];
    const selectors = await loupe.facetFunctionSelectors(facetAddr);
    let facetName = deployDic[facetAddr];
    if (!facetName) {
      console.log(deployDic[selectors[0]], "************************");
      switch (deployDic[selectors[0]]) {
        case "diamondCut((address,uint8,bytes4[])[],address,bytes)":
          facetName = "DiamondCutFacet";
          break;
        case "facetAddress(bytes4)":
          facetName = "DiamondLoupeFacet";
          break;
        case "owner()":
          facetName = "OwnershipFacet";
          break;
        case "checkPlayerBalance()":
          facetName = "PlayersFacet";
          break;
        case "checkStakerBalance()":
          facetName = "StakerFacet";
          break;
        case "checkPlatformBalance()":
          facetName = "AdminFacet";
          break;
        case "getReqID()":
          facetName = "RouletteFacet";
          break;
      }
    }
    console.log("    ", chalk.green(facetAddr), facetName);
    // console.log(selectors);
    for (let iF = 0; iF < selectors.length; iF++) {
      const selector = selectors[iF];
      console.log(
        "          ",
        chalk.green(selector),
        chalk.blue(deployDic[selector])
      );
    }
  }

  /*'facetFunctionSelectors(address)' │ '0xadfca15e' │
│    3    │            'facets()'       */
}
async function updateGlpTokenAddress() {
  const stakerFacet = await ethers.getContractAt("StakerFacet", diamondAddress);
  await stakerFacet.setGLPTokenAddress(
    "0x2F5f2332aC95f40F966dcb71862D2204Dce012d9"
  );
}
async function checkStakerBalance() {
  const stakerFacet = await ethers.getContractAt("StakerFacet", diamondAddress);
  const StakerBalance = await stakerFacet.checkStakerBalance();
  console.log(StakerBalance);
}
async function readDeployDic() {
  let json = fs.readFileSync("deployDic.json");
  return JSON.parse(json);
}
async function deployDiamond() {
  await hre.network.provider.send("hardhat_reset");
  const res = await diamondInit1();
  const { diamondAddress } = res;
  const admin = await ethers.getContractAt("AdminFacet", diamondAddress);
  const resIsContractOwner = await admin.isContractOwner();
  console.log("resIsContractOwner", resIsContractOwner);

  await saveDiamondAddress(diamondAddress);
  await copyArtifacts();

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
}
async function deployStakerFacet() {
  const facet = "StakerFacet";
  const facetFactory = await ethers.getContractFactory(facet, {
    libraries: {},
  });
  console.log(`Deploying ${facet}`);
  const deployedFactory = await facetFactory.deploy();
  await deployedFactory.deployed();
  console.log(`${facet} deployed: ${deployedFactory.address}`);
  saveDiamondAddress(deployedFactory.address);
}

async function copyArtifacts() {
  const fs = require("fs");
  fs.copyFileSync(
    "./artifacts/contracts/PlayersFacet.sol/PlayersFacet.json",
    "./frontend/src/contracts/PlayersFacet.json"
  );
  fs.copyFileSync(
    "./artifacts/contracts/StakerFacet.sol/StakerFacet.json",
    "./frontend/src/contracts/StakerFacet.json"
  );
  fs.copyFileSync(
    "./artifacts/contracts/VaultFacet.sol/VaultFacet.json",
    "./frontend/src/contracts/VaultFacet.json"
  );
  fs.copyFileSync(
    "./artifacts/contracts/AdminFacet.sol/AdminFacet.json",
    "./frontend/src/contracts/AdminFacet.json"
  );
  fs.copyFileSync(
    "./artifacts/contracts/RouletteFacet.sol/RouletteFacet.json",
    "./frontend/src/contracts/RouletteFacet.json"
  );
  fs.copyFileSync(
    "./artifacts/contracts/diamond/facets/DiamondLoupeFacet.sol/DiamondLoupeFacet.json",
    "./frontend/src/contracts/DiamondLoupeFacet.json"
  );
}
async function readDiamondAddress() {
  const fs = require("fs");
  const content = `export const diamondAddress = '`;
  try {
    const diamondAddressPath = "./frontend/src/contracts/diamondAddress.js";
    let res = fs.readFileSync(diamondAddressPath, {
      encoding: "utf8",
      flag: "r",
    });
    // file written successfully
    res = res.replace(content, "");
    res = res.replace("';", "");
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
  // console.log('AdminFacet deployed to:', AdminFacet.address);
  //console.log("Diamond deployed to:", addr);
}
async function saveDiamondAddress(addr) {
  const fs = require("fs");
  const content = `export const diamondAddress = '${addr}';`;
  try {
    const diamondAddressPath = "./frontend/src/contracts/diamondAddress.js";
    fs.writeFileSync(diamondAddressPath, content);
    // file written successfully
    console.log(
      "Diamond address saved to",
      diamondAddressPath,
      "as\n",
      content
    );
  } catch (err) {
    console.error(err);
  }
  // console.log('AdminFacet deployed to:', AdminFacet.address);
  console.log("Diamond deployed to:", addr);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });