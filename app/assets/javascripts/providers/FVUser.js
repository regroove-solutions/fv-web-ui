import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';
import UserOperations from 'operations/UserOperations';
import IntlService from "views/services/intl";

const key = 'FV_USER';
const intl = IntlService.instance;

/**
 * Single User Actions
 */
const fetchUser = function fetch(username, messageStart = null, messageSuccess = null, messageError = null) {
    return function (dispatch) {

        dispatch({
            type: key + '_FETCH_START',
            pathOrId: username,
            message: (messageStart || intl.trans('providers.fetch_started', 'Fetch started', 'first') + '...')
        });

        return UserOperations.getUser(username, {headers: {}})
            .then((response) => {
                dispatch({
                    type: key + '_FETCH_SUCCESS',
                    message: messageSuccess,
                    response: response,
                    pathOrId: username
                })
            }).catch((error) => {
                dispatch({type: key + '_FETCH_ERROR', message: (messageError || error), pathOrId: username})
            });
    }
};

const createUser = function create(user) {
    return function (dispatch) {

        dispatch({type: key + '_CREATE_START', pathOrId: user.id, user: user});

        return UserOperations.createUser(user).then((response) => {
            dispatch({
                type: key + '_CREATE_SUCCESS',
                message: intl.trans('providers.user_account_created_successfully', 'User account created successfully!', 'first'),
                response: response,
                user: user,
                pathOrId: user.id
            })
        }).catch((error) => {
            dispatch({type: key + '_CREATE_ERROR', message: error, user: user, pathOrId: user.id})
        });
    }
};

const updateUser = function update(user) {
    return function (dispatch) {

        dispatch({type: key + '_UPDATE_START', user: user, pathOrId: user.id});

        return UserOperations.updateUser(user).then((response) => {
            dispatch({
                type: key + '_UPDATE_SUCCESS',
                message: intl.trans('providers.user_account_updated_successfully', 'User account updated successfully!', 'first'),
                response: response,
                user: user,
                pathOrId: user.id
            })
        }).catch((error) => {
            dispatch({type: key + '_UPDATE_ERROR', message: error, user: user, pathOrId: user.id})
        });
    }
};

const inviteUser = RESTActions.execute('FV_USER_INVITE', 'User.Invite', {});
const userSuggestion = RESTActions.execute('FV_USER_SUGGESTION', 'UserGroup.Suggestion', {headers: {'X-NXenrichers.document': ''}});

const computeUserFetchFactory = RESTReducers.computeFetch('user');
const computeUserSuggestion = RESTReducers.computeOperation('user_suggestion');

const computeUserInviteOperation = RESTReducers.computeOperation('user_invite');

const actions = {fetchUser, userSuggestion, createUser, inviteUser, updateUser};

const reducers = {
    computeUser: computeUserFetchFactory.computeUser,
    computeUserSuggestion: computeUserSuggestion.computeUserSuggestion,
    computeUserInvite: computeUserInviteOperation.computeUserInvite
};

const middleware = [thunk];

export default {actions, reducers, middleware};