//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VotingDappByOleanji {


    uint8 public numofappliedCandidates;
    
    mapping(address => bool) public areYouACandidate;

    function jointhecandidateList() public{
        require(!areYouACandidate[msg.sender], "You are already a candidate to be voted for");

        areYouACandidate[msg.sender]=true;
        numofappliedCandidates +=1;
    }
}
