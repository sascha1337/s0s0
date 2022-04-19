import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export interface SosInstance {
  readonly contractAddress: string

  //Query
  query: (queryMsg: Record<string, unknown>) => Promise<any>

  //Execute
  execute: (
    senderAddress: string,
    msg: Record<string, unknown>
  ) => Promise<String>
}

export interface SosContract {
  instantiate: (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ) => Promise<InstantiateResponse>

  use: (contractAddress: string) => SosInstance
}

export const Sos = (
  client: SigningCosmWasmClient
): SosContract => {
  const use = (contractAddress: string): SosInstance => {

    //QUERY
    const query = async (
      queryMsg: Record<string, unknown>
    ): Promise<any> => {
      const res = await client.queryContractSmart(contractAddress, queryMsg)
      return res
    }

    /// EXECUTE
    const execute = async (
      senderAddress: string,
      msg: Record<string, unknown>
    ): Promise<String> => {
      const res = await client.execute(
        senderAddress,
        contractAddress,
        msg,
        'auto'
      )

      return res.transactionHash
    }

    return {
      contractAddress,
      query,
      execute
    }
  }

  const instantiate = async (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string
  ): Promise<InstantiateResponse> => {
    const result = await client.instantiate(
      senderAddress,
      codeId,
      initMsg,
      label,
      'auto',
      {
        admin,
      }
    )
    return {
      contractAddress: result.contractAddress,
      transactionHash: result.transactionHash,
    }
  }

  return { use, instantiate }
}
