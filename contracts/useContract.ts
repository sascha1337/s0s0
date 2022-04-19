import { useWallet } from '../contexts/wallet'
import { useCallback, useEffect, useState } from 'react'

import {
  Sos as initContract,
  SosContract,
  SosInstance,
} from './contract'

interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export interface UseSosContractProps {
  instantiate: (
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ) => Promise<InstantiateResponse>
  use: (customAddress: string) => SosInstance | undefined
  updateContractAddress: (contractAddress: string) => void
  getContractAddress: () => string | undefined
}

export function useSosContract(): UseSosContractProps {
  const wallet = useWallet()

  const [address, setAddress] = useState<string>('')
  const [sos, setSos] = useState<SosContract>()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    if (wallet.initialized) {
      const getSosBaseInstance = async (): Promise<void> => {
        const sosBaseContract = initContract(wallet.getClient())
        setSos(sosBaseContract)
      }

      getSosBaseInstance()
    }
  }, [wallet])

  const updateContractAddress = (contractAddress: string) => {
    setAddress(contractAddress)
  }

  const instantiate = useCallback(
    (codeId, initMsg, label, admin?): Promise<InstantiateResponse> => {
      return new Promise((resolve, reject) => {
        if (!sos) return reject('Contract is not initialized.')

        sos.instantiate(wallet.address, codeId, initMsg, label, admin)
          .then(resolve)
          .catch(reject)
      })
    },
    [sos, wallet]
  )

  const use = useCallback(
    (customAddress = ''): SosInstance | undefined => {
      return sos?.use(address || customAddress)
    },
    [sos, address]
  )
  const getContractAddress = (): string | undefined => {
    return address
  }

  return {
    instantiate,
    use,
    updateContractAddress,
    getContractAddress,
  }
}
