import * as React from 'react';
import Tinlake, { Address } from 'tinlake';
import { AuthState, authUser } from '../../ducks/auth';
import { connect } from 'react-redux';
import { authTinlake } from '../../services/tinlake';

interface Props {
  tinlake: Tinlake;
  render: (isAdmin: boolean) => React.ReactElement | null;
  auth?: AuthState;
  authUser?: (tinlake: Tinlake, address: Address) => Promise<void>;
  allowUnauth?: boolean;
}

class AdminSwitch extends React.Component<Props> {
  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { tinlake, auth, authUser, allowUnauth } = this.props;

    if (!allowUnauth) {
      await authTinlake();
    }

    if (auth!.state === 'loading' || auth!.state === 'loaded') { return; }

    await authUser!(tinlake, tinlake.ethConfig.from);
  }

  render() {
    const { auth } = this.props;

    if (auth!.state === 'loading' || auth!.state === null) { return null; }

    return this.props.render(!!auth!.user && auth!.user!.isAdmin);
  }
}

export default connect(state => state, { authUser })(AdminSwitch);
