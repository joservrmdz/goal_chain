'use client'

import {getSolanaGoalChainProgram, getSolanaGoalChainProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useSolanaGoalChainProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanaGoalChainProgramId(cluster.network as Cluster), [cluster])
  const program = getSolanaGoalChainProgram(provider)

  const accounts = useQuery({
    queryKey: ['solana_goal_chain', 'all', { cluster }],
    queryFn: () => program.account.solana_goal_chain.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['solana_goal_chain', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ solana_goal_chain: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSolanaGoalChainProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolanaGoalChainProgram()

  const accountQuery = useQuery({
    queryKey: ['solana_goal_chain', 'fetch', { cluster, account }],
    queryFn: () => program.account.solana_goal_chain.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['solana_goal_chain', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ solana_goal_chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['solana_goal_chain', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ solana_goal_chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['solana_goal_chain', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ solana_goal_chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['solana_goal_chain', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ solana_goal_chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
