export const abi = [
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_votersId",
        "type": "uint8"
      }
    ],
    "name": "Voting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "areYouACandidate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchVotersList",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "votersId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "votecount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "Name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "Slogan",
            "type": "string"
          }
        ],
        "internalType": "struct VotingDappByOleanji.Voters[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_slogan",
        "type": "string"
      }
    ],
    "name": "jointhecandidateList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxnumofAppliableCandidates",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numofappliedCandidates",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "votedAlready",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
export const OleanjiVotinDapp_CONTRACT_ADDRESS = "0x3F484E941240315abe4d029e7D0Ac61Fc1543B21";