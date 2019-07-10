import * as React from 'react';
// tslint:disable-next-line:import-name
import Tinlake from 'tinlake';
import { Box, FormField, TextInput, Button, Heading } from 'grommet';
import Alert from '../Alert';
import Link from 'next/link';
import SecondaryHeader from '../SecondaryHeader';
import { LinkPrevious } from 'grommet-icons';

interface Props {
  tinlake: Tinlake;
}

interface State {
  tokenId: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string;
}

const SUCCESS_STATUS = '0x1';

class MintNFT extends React.Component<Props, State> {
  state: State = {
    tokenId: `0x${Math.floor(Math.random() * (10 ** 15))}`,
    is: null,
    errorMsg: '',
  };

  mint = async () => {
    this.setState({ is: 'loading' });

    try {
      // console.log(`Calling tinlake.mintNFT(${this.props.tinlake.ethConfig.from}, ` +
      //   `${this.state.tokenId})`);
      const res = await this.props.tinlake.mintNFT(
        this.props.tinlake.ethConfig.from, this.state.tokenId);
      if (res.status === SUCCESS_STATUS && res.events[0].event.name === 'Transfer') {
        this.setState({ is: 'success' });
      } else {
        console.log(res);
        this.setState({ is: 'error' });
      }
    } catch (e) {
      console.log(e);
      this.setState({ is: 'error', errorMsg: e.message });
    }
  }

  render() {
    const { is, tokenId, errorMsg } = this.state;

    return <Box>
      <SecondaryHeader>
        <Box direction="row" gap="small" align="center">
          <Link href="/admin">
            <LinkPrevious />
          </Link>
          <Heading level="3">Mint NFT</Heading>
        </Box>

        <Button primary onClick={this.mint} label="Mint NFT" />
      </SecondaryHeader>

      <Box pad={{ horizontal: 'medium' }}>
        {is === 'loading' && 'Minting...'}
        {is === 'success' && <Alert type="success">
          Successfully minted NFT for Token ID {tokenId}<br />
          <br />
          <Link href={`/admin/whitelist-nft?tokenId=${tokenId}`}>
            <a>Proceed to whitelisting</a></Link></Alert>}
        {is === 'error' && <Alert type="error">
          <strong>Error minting NFT for Token ID {tokenId}, see console for details</strong>
          {errorMsg && <div><br />{errorMsg}</div>}
        </Alert>}

        <Alert type="info">
          This is a temporary page that will be removed once integrated with Centrifuge Gateway.
        </Alert>

        <Box direction="row" gap="medium" margin={{ vertical: 'large' }}>
          <Box basis={'1/4'} gap="medium">
            <FormField label="Token ID">
              <TextInput
                value={this.state.tokenId}
                onChange={e => this.setState({ tokenId: e.currentTarget.value })}
              />
            </FormField>
          </Box>
        </Box>
      </Box>
    </Box>;
  }
}

export default MintNFT;
