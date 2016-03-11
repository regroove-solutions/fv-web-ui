import alt from '../alt';
import UserActions from 'actions/UserActions';

class UserStore {
  constructor() {

    //this.bindAction(UserActions.login, this.onUserLogin);

    this.bindListeners({
      onUserLogin: UserActions.login
    });
/*
    this.exportPublicMethods({
      getDefaultUser: this.getDefaultUser,
      getCurrentUser: this.getCurrentUser
    });

    this.user = this.getDefaultUser();*/
    this.state = {
      currentUser: this.getDefaultUser()
    }
  }
/*
  onReceivedCurrentUser(user) {
    this.user = user;
  }
*/
  getDefaultUser() {
    return {
      properties: {
        username: "Guest"
      }
    };
  }

  onUserLogin(user) {
    this.setState({ currentUser: user });
  }
/*
  getCurrentUser() {
    return this.getState().user;
  }*/
}

export default alt.createStore(UserStore, 'UserStore');