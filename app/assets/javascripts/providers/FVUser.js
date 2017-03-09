import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';
import UserOperations from 'operations/UserOperations';

const key = 'USER';

/**
* Single User Actions
*/
const fetchUser = 
        function fetch(username, messageStart = null, messageSuccess = null, messageError = null) {
			return function (dispatch) {

			    dispatch( { type: key + '_FETCH_START', username: username, message: (messageStart || 'Fetch started...') } );

				    return UserOperations.getUser(username, { headers: {} })
				    .then((response) => {
				      dispatch( { type: key + '_FETCH_SUCCESS', message: messageSuccess, response: response, username: username } )
				    }).catch((error) => {
				        dispatch( { type: key + '_FETCH_ERROR', message: (messageError || error), username: username } )
				    });
			}
		};

const createUser =
        function create(user) {
			return function (dispatch) {

			    dispatch( { type: key + '_CREATE_START', user: user } );

                return UserOperations.createUser(user).then((response) => {
                    dispatch( { type: key + '_CREATE_SUCCESS', message: 'User account created successfully!', response: response, user: user } )
                }).catch((error) => {
                    dispatch( { type: key + '_CREATE_ERROR', message: error, user: user } )
                });
			}
		};

const inviteUser = RESTActions.execute('FV_USER_INVITE', 'User.Invite', { reducerIdOverride: 'test' });

const updateUser = null;
const deleteUser = null;

const computeUserFetchFactory = RESTReducers.computeFetch('user');
const computeUserDeleteFactory = RESTReducers.computeDelete('delete_user');
const computeUserInviteOperation = RESTReducers.computeOperation('user_invite');

const actions = { fetchUser, createUser, inviteUser, deleteUser, updateUser };

const reducers = {
  computeUser: computeUserFetchFactory.computeUser,
  computeUserInvite: computeUserInviteOperation.computeUserInvite,
  computeDeleteUser: computeUserDeleteFactory.computeDeleteUser
};

const middleware = [thunk];

export default { actions, reducers, middleware };