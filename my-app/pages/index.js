import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { OleanjiVotinDapp_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedvoting keeps track of whether the current metamask address has joined the VOTING CANDIDATES or not
  const [joinedvoting, setJoinedvoting] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState([]);

  const [name, setName] = useState('');
  const [num, setNum] = useState([]);

  const [slogan, setSlogan] = useState('');
  
  const [voteCountofCandidates, setVoteCountofCandidates] = useState(0);

  const [alreadyVoted, setAlreadyVoted] = useState(false);
  // numberOfCandidates tracks the number of addresses's joined
  const [numberOfCandidates, setNumberOfCandidates] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Ropsten network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 3) {
      window.alert("Change the network to Ropsten");
      throw new Error("Change network to Ropsten");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /**
   * addAddressToVotableCandidates: Adds the current connected address to the candidates list
   */
  const addAddressToVotableCandidates = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const votingContract = new Contract(
        OleanjiVotinDapp_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToVotableCandidates from the contract
      const tx = await votingContract.jointhecandidateList(name, slogan);
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the candidates list
      await getNumberOfCandidates();
      setJoinedvoting(true);
      fetchCandidates();
      console.log(name, slogan)
    } catch (err) {
      console.error(err);
    }
  };

  
  const checkIfAlreadyVoted = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const votingContract = new Contract(
        OleanjiVotinDapp_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _alreadyvoted = await votingContract.votedAlready(address);
      setAlreadyVoted(_alreadyvoted);
      fetchCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  
  const fetchCandidates= async () => {
    try {
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const votingContract = new Contract(
        OleanjiVotinDapp_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // const candidates = [];
       const data = await votingContract.fetchVotersList()
       const candidates = await Promise.all(data.map(async i => {
      
       
        let candidateList = {
         Index : i.votersId.toNumber(),
         Votecount : i.votecount.toNumber(),
         Name: i.Name,
         Slogan :i.Slogan
        }
        return candidateList
      }))
     
      setCandidates(candidates);
      console.log(candidates);
       // const numm = candidates.filter(i => i.votersId.toNumber())
      // setNum(numm)
      
    } catch (error) {
      console.error(error);
    }
  };




  const Voting = async (Id) => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const votingContract = new Contract(
        OleanjiVotinDapp_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToVotableCandidates from the contract
      const tx = await votingContract.Voting(Id);
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // // get the updated number of addresses in the candidates list
      // await getNumberOfCandidates();
      setAlreadyVoted(true);
      fetchCandidates();
    } catch (err) {
      console.error(err);
    }
  };



  /**
   * getNumberOfCandidates:  gets the number of candidates  addresses
   */
  const getNumberOfCandidates = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const votingContract = new Contract(
        OleanjiVotinDapp_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfAppliedCandidates = await votingContract.numofappliedCandidates();
      setNumberOfCandidates(_numberOfAppliedCandidates);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checkIfAddressInWhitelist: Checks if the address is in whitelist
   */
  const checkIfAddressInCandidateList = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const votingContract = new Contract(
        OleanjiVotinDapp_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedCandidatelist = await votingContract.areYouACandidate(address);
      setJoinedvoting(_joinedCandidatelist);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInCandidateList();
      checkIfAlreadyVoted();
      getNumberOfCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      if (joinedvoting) {
        return (
          <div>
            <div className={styles.description}>
              You have successfully joined the list of candidates to be voted for;
            </div>

            <br/>
            <br/>
            <br/>
            <div>
                <table className={styles.table}>
                  <tr className={styles.tr}>
                    <th className={styles.th}>Voters Id</th>
                    <th className={styles.th}>Voters name</th>
                    <th className={styles.th}>Slogan</th>
                    <th className={styles.th}>Vote Count</th>
                  </tr>
                  {
                    // here we loop through the nft that was set and using i as index and key we get each item in the nft
                    candidates.map((candidate, i) => (
                      <tr key={i} className={styles.tr}>
                        <td className={styles.td}>
                          {candidate.Index}
                        </td>
                        <td className={styles.td}>
                          {candidate.Name}
                          
                        </td>
                        <td className={styles.td}>
                          {candidate.Slogan}
                        </td>
                        <td className={styles.td}>
                          {candidate.Votecount}
                        </td>
                      </tr> 
            
                    ))
                  }
                </table>
    
            </div>
          </div>


        );
      } else if (loading) {
        return <button className={styles.button}>...Processing...</button>;
      } else if (alreadyVoted) {
        return(
        <div>
           <div className={styles.description}>
              You have successfully voted for a candidate;
            </div>

            <br/>
            <br/>
            <br/>
              {/* {
                  Boolean(!num == 0) && (  */}
                    <table className={styles.table}>
                      <tr className={styles.tr}>
                        <th className={styles.th}>Voters Id</th>
                        <th className={styles.th}>Voters name</th>
                        <th className={styles.th}>Slogan</th>
                        <th className={styles.th}>Vote Count</th>
                      </tr>
                      {
                        // here we loop through the nft that was set and using i as index and key we get each item in the nft
                        candidates.map((candidate, i) => (
                          <tr key={i} className={styles.tr}>
                            <td className={styles.td}>
                              {candidate.Index}
                            </td>
                            <td className={styles.td}>
                             {candidate.Name}
                              
                            </td>
                            <td className={styles.td}>
                              {candidate.Slogan}
                            </td>
                            <td className={styles.td}>
                              {candidate.Votecount}
                            </td>
                          </tr> 
               
                        ))
                      }
                    </table>
                  {/* ) */}
                {/* } */}
            </div>
        )
      }
      else {
        return (
          <div>
          <div>
          <input
          type="text"
           placeholder="name"
            
             onChange={e => setName(e.target.value)}
             
           />
         </div>
         <div>
           <input
             type="text"
             placeholder="Slogan"
            
             onChange={e => setSlogan(e.target.value)}
             
           />
         </div>
          <button onClick={addAddressToVotableCandidates} className={styles.button}>
            Join the Candidate List
          </button>

          <br/>
          <br/>
          <br/>
          <br/>
          <div>
              {/* {
                  Boolean(!num == 0) && (  */}
                    <table className={styles.table}>
                      <tr className={styles.tr}>
                        <th className={styles.th}>Voters Id</th>
                        <th className={styles.th}>Voters name</th>
                        <th className={styles.th}>Slogan</th>
                        <th className={styles.th}>Vote</th>
                      </tr>
                      {
                        // here we loop through the nft that was set and using i as index and key we get each item in the nft
                        candidates.map((candidate, i) => (
                          <tr key={i} className={styles.tr}>
                            <td className={styles.td}>
                              {candidate.Index}
                            </td>
                            <td className={styles.td}>
                             {candidate.Name}
                              
                            </td>
                            <td className={styles.td}>
                              {candidate.Slogan}
                            </td>
                           

                            <td className={styles.td}>
                                <button className={styles.button} onClick={
                                () => Voting(candidate.Index)
                              }> Vote</button>
                             
                            </td>
                          </tr> 
               
                        ))
                      }
                    </table>
                  {/* ) */}
                {/* } */}
            </div>
        </div>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "ropsten",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>OleanjiDAO</title>
        <meta name="description" content="OleanjiDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>This is OleanjiFutureDao Voting Application</h1>
          <div className={styles.description}>
           Its an application for members of the Dao to apply to join the Candidate list if interested.
          </div>
          <div className={styles.description}>
            {numberOfCandidates} member(s) have already joined the Canadidate list
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src= "./Oleanji-The-Creator.jpg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by OleanjiFutureDao Group of members
      </footer>
    </div>
  );
}