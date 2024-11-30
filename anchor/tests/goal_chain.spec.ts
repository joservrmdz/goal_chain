import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import {Keypair, PublicKey} from "@solana/web3.js";
import {GoalChain} from '../target/types/goal_chain';
import { startAnchor} from "solana-bankrun";
import {BankrunProvider} from "anchor-bankrun";

const IDL = require("../target/idl/goal_chain.json");


const game_address = new PublicKey("39o3Jfso4ncRMNAcyNVscZLxbDrkXGePP4xpzJzoamXm");
describe("Fantasy League", () => {

    it("Initialize Game", async () => {
        const context =  await startAnchor("", [{name: "goal_chain", programId: game_address}], []);
        const provider = new BankrunProvider(context);

        const gameProgram = new Program<GoalChain>(
          IDL,
          provider
        );

        await gameProgram.methods.initializeGame(
            new anchor.BN(1),
            "Arsenal vs FC Barcelona",
            new anchor.BN(1732890715),
            new anchor.BN(1732908795)
        ).rpc();
    });
});
