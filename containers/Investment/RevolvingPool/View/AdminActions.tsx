import * as React from 'react'
import { Box, Button, Heading, FormField } from 'grommet'
import { baseToDisplay, displayToBase } from '@centrifuge/tinlake-js'
import NumberInput from '../../../../components/NumberInput'
import { loadPool, PoolDataV3, PoolState } from '../../../../ducks/pool'
import { ITinlake as ITinlakeV3 } from '@centrifuge/tinlake-js-v3'
import { toPrecision } from '../../../../utils/toPrecision'
import { addThousandsSeparators } from '../../../../utils/addThousandsSeparators'
import { createTransaction, useTransactionState, TransactionProps } from '../../../../ducks/transactions'
import { connect, useSelector } from 'react-redux'

interface Props extends TransactionProps {
  tinlake: ITinlakeV3
  loadPool?: (tinlake: any) => Promise<void>
}

const AdminActions: React.FC<Props> = (props: Props) => {
  const pool = useSelector<any, PoolState>((state) => state.pool)

  const [minJuniorRatio, setMinJuniorRatio] = React.useState('0')
  const [maxJuniorRatio, setMaxJuniorRatio] = React.useState('0')
  const [maxReserve, setMaxReserve] = React.useState('0')

  React.useEffect(() => {
    if (pool && pool.data) {
      setMinJuniorRatio(pool.data.minJuniorRatio.toString())
      setMaxJuniorRatio((pool.data as PoolDataV3).maxJuniorRatio.toString())
      setMaxReserve((pool.data as PoolDataV3).maxReserve.toString())
    }
  }, [pool?.data])

  React.useEffect(() => {
    props.loadPool && props.loadPool(props.tinlake)
  }, [props.tinlake])

  const [minRatioStatus, , setMinRatioTxId] = useTransactionState()

  const saveMinJuniorRatio = async () => {
    const txId = await props.createTransaction(`Set min TIN risk buffer`, 'setMinJuniorRatio', [
      props.tinlake,
      minJuniorRatio.toString(),
    ])
    setMinRatioTxId(txId)
  }

  const [maxRatioStatus, , setMaxRatioTxId] = useTransactionState()

  const saveMaxJuniorRatio = async () => {
    const txId = await props.createTransaction(`Set max TIN risk buffer`, 'setMaxJuniorRatio', [
      props.tinlake,
      maxJuniorRatio.toString(),
    ])
    setMaxRatioTxId(txId)
  }

  const [maxReserveStatus, , setMaxReserveTxId] = useTransactionState()

  const saveMaxReserve = async () => {
    console.log(maxReserve.toString())
    const txId = await props.createTransaction(`Set max reserve`, 'setMaxReserve', [
      props.tinlake,
      maxReserve.toString(),
    ])
    setMaxReserveTxId(txId)
  }

  React.useEffect(() => {
    if (minRatioStatus === 'succeeded') {
      props.loadPool && props.loadPool(props.tinlake)
    }
  }, [minRatioStatus])

  React.useEffect(() => {
    if (maxRatioStatus === 'succeeded') {
      props.loadPool && props.loadPool(props.tinlake)
    }
  }, [maxRatioStatus])

  React.useEffect(() => {
    if (maxReserveStatus === 'succeeded') {
      props.loadPool && props.loadPool(props.tinlake)
    }
  }, [maxReserveStatus])

  return (
    <>
      {pool && pool.data && (
        <Box direction="row" gap="medium">
          <Box width="medium" pad="medium" elevation="small" round="xsmall" margin={{ bottom: 'medium' }}>
            <Box direction="row" margin={{ top: '0', bottom: 'small' }}>
              <Heading level="5" margin={'0'}>
                Min TIN risk buffer
              </Heading>
              <Heading level="4" margin={{ left: 'auto', top: '0', bottom: '0' }}>
                {addThousandsSeparators(toPrecision(baseToDisplay(pool.data.minJuniorRatio, 25), 2))}%
              </Heading>
            </Box>

            <FormField label="Set minimum TIN risk buffer">
              <NumberInput
                value={baseToDisplay(minJuniorRatio, 25)}
                precision={2}
                onValueChange={({ value }) => setMinJuniorRatio(displayToBase(value, 25))}
                disabled={minRatioStatus === 'unconfirmed' || minRatioStatus === 'pending'}
              />
            </FormField>

            <Box gap="small" justify="end" direction="row" margin={{ top: 'small' }}>
              <Button
                primary
                label="Apply"
                onClick={saveMinJuniorRatio}
                disabled={
                  minRatioStatus === 'unconfirmed' ||
                  minRatioStatus === 'pending' ||
                  minJuniorRatio === pool.data.minJuniorRatio.toString()
                }
              />
            </Box>
          </Box>

          <Box width="medium" pad="medium" elevation="small" round="xsmall" margin={{ bottom: 'medium' }}>
            <Box direction="row" margin={{ top: '0', bottom: 'small' }}>
              <Heading level="5" margin={'0'}>
                Max TIN risk buffer
              </Heading>
              <Heading level="4" margin={{ left: 'auto', top: '0', bottom: '0' }}>
                {addThousandsSeparators(toPrecision(baseToDisplay((pool.data as PoolDataV3).maxJuniorRatio, 25), 2))}%
              </Heading>
            </Box>

            <FormField label="Set maximum TIN risk buffer">
              <NumberInput
                value={baseToDisplay(maxJuniorRatio, 25)}
                precision={2}
                onValueChange={({ value }) => setMaxJuniorRatio(displayToBase(value, 25))}
                disabled={maxRatioStatus === 'unconfirmed' || maxRatioStatus === 'pending'}
              />
            </FormField>

            <Box gap="small" justify="end" direction="row" margin={{ top: 'small' }}>
              <Button
                primary
                label="Apply"
                onClick={saveMaxJuniorRatio}
                disabled={
                  maxRatioStatus === 'unconfirmed' ||
                  maxRatioStatus === 'pending' ||
                  maxJuniorRatio === (pool.data as PoolDataV3).maxJuniorRatio.toString()
                }
              />
            </Box>
          </Box>

          <Box width="medium" pad="medium" elevation="small" round="xsmall" margin={{ bottom: 'medium' }}>
            <Box direction="row" margin={{ top: '0', bottom: 'small' }}>
              <Heading level="5" margin={'0'}>
                Max reserve
              </Heading>
              <Heading level="4" margin={{ left: 'auto', top: '0', bottom: '0' }}>
                {addThousandsSeparators(toPrecision(baseToDisplay((pool.data as PoolDataV3).maxReserve, 18), 2))}
              </Heading>
            </Box>

            <FormField label="Set maximum reserve">
              <NumberInput
                value={baseToDisplay(maxReserve, 18)}
                precision={2}
                onValueChange={({ value }) => setMaxReserve(displayToBase(value, 18))}
                disabled={maxReserveStatus === 'unconfirmed' || maxReserveStatus === 'pending'}
              />
            </FormField>

            <Box gap="small" justify="end" direction="row" margin={{ top: 'small' }}>
              <Button
                primary
                label="Apply"
                onClick={saveMaxReserve}
                disabled={
                  maxReserveStatus === 'unconfirmed' ||
                  maxReserveStatus === 'pending' ||
                  maxReserve === (pool.data as PoolDataV3).maxReserve.toString()
                }
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default connect((state) => state, { loadPool, createTransaction })(AdminActions)
