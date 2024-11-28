import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {SolanaGoalChain} from '../target/types/solana_goal_chain'

describe('solana_goal_chain', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.SolanaGoalChain as Program<SolanaGoalChain>

  const solana_goal_chainKeypair = Keypair.generate()

  it('Initialize SolanaGoalChain', async () => {
    await program.methods
      .initialize()
      .accounts({
        solana_goal_chain: solana_goal_chainKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solana_goal_chainKeypair])
      .rpc()

    const currentCount = await program.account.solana_goal_chain.fetch(solana_goal_chainKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment SolanaGoalChain', async () => {
    await program.methods.increment().accounts({ solana_goal_chain: solana_goal_chainKeypair.publicKey }).rpc()

    const currentCount = await program.account.solana_goal_chain.fetch(solana_goal_chainKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment SolanaGoalChain Again', async () => {
    await program.methods.increment().accounts({ solana_goal_chain: solana_goal_chainKeypair.publicKey }).rpc()

    const currentCount = await program.account.solana_goal_chain.fetch(solana_goal_chainKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement SolanaGoalChain', async () => {
    await program.methods.decrement().accounts({ solana_goal_chain: solana_goal_chainKeypair.publicKey }).rpc()

    const currentCount = await program.account.solana_goal_chain.fetch(solana_goal_chainKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solana_goal_chain value', async () => {
    await program.methods.set(42).accounts({ solana_goal_chain: solana_goal_chainKeypair.publicKey }).rpc()

    const currentCount = await program.account.solana_goal_chain.fetch(solana_goal_chainKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solana_goal_chain account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solana_goal_chain: solana_goal_chainKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solana_goal_chain.fetchNullable(solana_goal_chainKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
