# **Ampora: Decentralized Green Energy Microgrid Exchange**

A blockchain-based platform that enables peer-to-peer green energy trading, transparent renewable certification, and decentralized microgrid governance through smart contracts on the Stacks blockchain.

---

## **Overview**

Ampora is designed to solve inefficiencies in local green energy markets by enabling producers and consumers to directly exchange surplus renewable power, earn NFT-backed renewable energy certificates (RECs), and govern localized microgrids through DAO mechanisms.

This system consists of **eight smart contracts**, each responsible for a key aspect of the green energy ecosystem:

1. **Energy Tokenization Contract** – Converts surplus kWh into tradable tokens  
2. **Marketplace Contract** – Facilitates peer-to-peer energy token trading  
3. **Oracle Verification Contract** – Validates real-world energy generation via IoT feeds  
4. **REC NFT Contract** – Issues verifiable Renewable Energy Certificates as NFTs  
5. **Microgrid DAO Contract** – Local governance for microgrid rules and funding  
6. **Staking & Incentives Contract** – Rewards sustainable behavior through staking  
7. **Escrow & Settlement Contract** – Manages secure energy transactions and payments  
8. **Compliance Registry Contract** – Tracks regulatory and sustainability compliance  

---

## **Features**

- Tokenized surplus energy trading  
- Automated REC issuance via verified generation  
- Local microgrid DAO governance  
- Real-time validation via oracles and smart meters  
- Staking incentives for green behavior  
- Escrow-secured transactions  
- Transparent sustainability reporting  

---

## **Smart Contracts**

### **Energy Tokenization Contract**

- Converts verified kWh into fungible tokens  
- Handles producer registration and limits  
- Burn/mint logic tied to actual energy supply  

### **Marketplace Contract**

- Order book and atomic swaps for energy tokens  
- Price discovery mechanisms  
- Geo-filtered market segmentation  

### **Oracle Verification Contract**

- Accepts real-time data from solar/wind/hydro IoT meters  
- Certifies legitimacy of energy production  
- Interfaces with off-chain oracles  

### **REC NFT Contract**

- Mints ERC-721-style NFTs as Renewable Energy Certificates  
- Metadata includes timestamp, source, and validator  
- Tradable or burnable for compliance claims  

### **Microgrid DAO Contract**

- Stake-weighted voting on rules, tariffs, and funding  
- Proposals for new grid infrastructure or partnerships  
- Treasury governance for local reinvestment  

### **Staking & Incentives Contract**

- Users stake $AMP to receive rewards for verified consumption  
- Dynamic reward rates based on community goals  
- Slashing logic for false data submission  

### **Escrow & Settlement Contract**

- Atomic payment-for-energy fulfillment  
- Dispute resolution and rollback logic  
- Multi-sig support for high-value trades  

### **Compliance Registry Contract**

- Tracks and verifies environmental impact data  
- Interfaces with national or local regulatory APIs  
- Public access to green audit trails  

---

## **Installation**

1. Install [Clarinet CLI](https://docs.stacks.co/clarity/clarinet-cli)  
2. Clone this repository  
3. Run tests:  
   ```bash
   npm test
   ```
4. Deploy contracts:
    ```bash
    clarinet deploy
   ```
## **Usage**

Each smart contract is modular and can be deployed independently or in coordinated sets depending on grid architecture and local policies. See each contract's subdirectory for API specs and deployment scripts.

## **Testing**

Tests are written using Vitest and can be run with:
```bash
npm test
```

## **License**

MIT License

