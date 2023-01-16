import { ethers } from "ethers";
import delegateContract from "@jbx-protocol/juice-nft-rewards/out/JBTiered721Delegate.sol/JBTiered721Delegate.json";
import creditMap from "./creditMap";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ADMIN_KEY = process.env.ADMIN_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const EDEN_721DELEGATE_ADDRESS = process.env.EDEN_721DELEGATE_ADDRESS;
const ALCHEMY_WEBSOCKET_URL = process.env.ALCHEMY_WEBSOCKET_URL;
const GATEWAY_URL = process.env.GATEWAY_URL;

async function main() {
  const address = EDEN_721DELEGATE_ADDRESS as string;
  const provider = new ethers.providers.WebSocketProvider(
    ALCHEMY_WEBSOCKET_URL as string
  );
  const contract = new ethers.Contract(address, delegateContract.abi, provider);
  console.log("Listening for events...");
  contract.on(
    "Mint",
    async (tokenId, tierId, beneficiary, totalAmountContributed, caller) => {
      let info = {
        tokenId: tokenId.toString(),
        tierId: tierId.toString(),
        beneficiary: beneficiary,
        totalAmountContributed: totalAmountContributed.toString(),
        caller: caller,
      };
      console.log(info);
      const amount = creditMap[info.tierId].credits;
      console.log(
        `Crediting wallet ${info.beneficiary} with ${amount} credits`
      );
      try {
        await axios.post(
          `${GATEWAY_URL}/credits/modify`,
          {
            userId: info.beneficiary,
            amount,
          },
          {
            headers: {
              "x-api-key": ADMIN_KEY,
              "x-api-secret": ADMIN_SECRET,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  );
}

main();
