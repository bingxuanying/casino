const { diamondInit1 } = require("./utils/utils");
async function main() {
  await deployStakerFacet();
  await copyArtifacts();
}

async function deployStakerFacet() {
  const facet = "PlayersFacet";
  const facetFactory = await ethers.getContractFactory(facet, {
    libraries: {},
  });
  console.log(`Deploying ${facet}`);
  const deployedFactory = await facetFactory.deploy();
  await deployedFactory.deployed();
  console.log(`${facet} deployed: ${deployedFactory.address}`);
  saveDiamondAddress(deployedFactory.address);
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
    "./artifacts/contracts/AdminFacet.sol/AdminFacet.json",
    "./frontend/src/contracts/AdminFacet.json"
  );
  fs.copyFileSync(
    "./artifacts/contracts/diamond/facets/DiamondLoupeFacet.sol/DiamondLoupeFacet.json",
    "./frontend/src/contracts/DiamondLoupeFacet.json"
  );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
