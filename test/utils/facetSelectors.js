const facetSelectors = {
    DiamondCutFacet: {
        'diamondCut((address,uint8,bytes4[])[],address,bytes)': '0x1f931c1c'
    },
    DiamondLoupeFacet: {
        'facetAddress(bytes4)': null,
        'facetAddresses()': null,
        'facetFunctionSelectors(address)': null,
        'facets()': null,
        'supportsInterface(bytes4)': null
    },
    OwnershipFacet: {
        'owner()': null,
        'transferOwnership(address)': null,
    },
    PlayersFacet: {
        'checkPlayerBalance()': null,
        'depositETH()': null,
        'placeBet((uint256,uint8,uint8)[])': null,
        'rawFulfillRandomWords(uint256,uint256[])': null,
        'setVrfInfo((uint64,address,bytes32))': null,
        'withdrawDAI()': null
    }


}

exports.facetSelectors = facetSelectors