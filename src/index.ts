import { ethers } from "ethers";
import delegateContract from "@jbx-protocol/juice-nft-rewards/out/JBTiered721Delegate.sol/JBTiered721Delegate.json";
import creditMap from "./creditMap";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const address = process.env.EDEN_721DELEGATE_ADDRESS as string;
  const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_WEBSOCKET_URL as string
  );
  const contract = new ethers.Contract(address, delegateContract.abi, provider);
  console.log("Listening for events...");
  contract.on(
    "Mint",
    (tokenId, tierId, beneficiary, totalAmountContributed, caller) => {
      let info = {
        tokenId: tokenId.toString(),
        tierId: tierId.toString(),
        beneficiary: beneficiary,
        totalAmountContributed: totalAmountContributed.toString(),
        caller: caller,
      };
      console.log(info);
      const credits = creditMap[info.tierId].credits;
      console.log(
        `Crediting wallet ${info.beneficiary} with ${credits} credits`
      );
    }
  );
}
main();
