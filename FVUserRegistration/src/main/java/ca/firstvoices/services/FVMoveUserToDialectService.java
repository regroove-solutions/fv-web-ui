package ca.firstvoices.services;

import org.nuxeo.ecm.core.api.DocumentModel;

public interface FVMoveUserToDialectService {

    public void placeNewUserInGroup( DocumentModel dialect, String groupName, String newUsername ) throws Exception;
    public void moveUserBetweenGroups( DocumentModel dialect, String userName, String fromGroupName, String toGroupName ) throws Exception;
    public void removeUserFromGroup( DocumentModel dialect, String fromGroupName );
    public void addUserToGroup( DocumentModel dialect, String toGroupName );
}

