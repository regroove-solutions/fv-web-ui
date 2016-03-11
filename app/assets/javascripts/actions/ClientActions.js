import alt from '../alt';
import Nuxeo from 'nuxeo';

// Configuration
import ConfGlobal from 'conf/local.json';

//import RunActions from '../actions/RunActions';
//import UserApiUtils from '../utils/UserApiUtils';
//import RunApiUtils from '../utils/RunApiUtils';
//import logError from '../utils/logError'

class ClientActions {

  static nuxeoArgs = {
      baseURL: ConfGlobal.baseURL,
      restPath: 'site/api/v1',
      automationPath: 'site/automation',
      timeout: 30000
  };

  connect() {
    return (dispatch) => {
      let client = new Nuxeo(this.nuxeoArgs);
      client.header('X-NXproperties', '*');

      dispatch(client);
    }
  }


}

module.exports = alt.createActions(ClientActions);