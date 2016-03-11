import alt from '../alt';
import Request from 'request';


// Configuration
import ConfGlobal from 'conf/local.json';

//import RunActions from '../actions/RunActions';
//import UserApiUtils from '../utils/UserApiUtils';
//import RunApiUtils from '../utils/RunApiUtils';
//import logError from '../utils/logError'

class UserActions {

  login(client, username, password) {

    return (dispatch) => {
      // TODO: Better way of handling this HACK (logging out)
      Request({url: ConfGlobal.baseURL + "/logout", method: "GET"}, function (error, response, body) {
        client.login({auth: {method: 'basic', username: username, password: password}}).then((user) => {
          dispatch(user);
          // Close box
          //_this._handleClose();
        }).catch((error) => { throw error });
      });
    }

      //var _this = this;



      

    /*UserApiUtils.fetchCurrentUser().then((user) => {
      this.actions.receivedCurrentUser(user);

      // Now fetch queries for that user.
      return RunApiUtils.fetchForUser(user);
    }).then((results) => {
      RunActions.addMultipleRuns(results);
    }).catch();*/
  }
}

module.exports = alt.createActions(UserActions);