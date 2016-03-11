import alt from '../alt';
import ClientActions from 'actions/ClientActions';

class ClientStore {
  constructor() {

    this.bindListeners({
      onConnect: ClientActions.connect
    });

    this.state = {
      client: ClientActions.connect
    }
  }

  onConnect(client) {
    console.log(client);
    this.setState({ client: client });
  }
}

export default alt.createStore(ClientStore, 'ClientStore');