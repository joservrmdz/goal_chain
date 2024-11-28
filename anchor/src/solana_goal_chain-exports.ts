// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolanaGoalChainIDL from '../target/idl/solana_goal_chain.json'
import type { SolanaGoalChain } from '../target/types/solana_goal_chain'

// Re-export the generated IDL and type
export { SolanaGoalChain, SolanaGoalChainIDL }

// The programId is imported from the program IDL.
export const SOLANA_GOAL_CHAIN_PROGRAM_ID = new PublicKey(SolanaGoalChainIDL.address)

// This is a helper function to get the SolanaGoalChain Anchor program.
export function getSolanaGoalChainProgram(provider: AnchorProvider) {
  return new Program(SolanaGoalChainIDL as SolanaGoalChain, provider)
}

// This is a helper function to get the program ID for the SolanaGoalChain program depending on the cluster.
export function getSolanaGoalChainProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the SolanaGoalChain program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return SOLANA_GOAL_CHAIN_PROGRAM_ID
  }
}
