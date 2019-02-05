package ca.firstvoices.operations;

import ca.firstvoices.services.FVMoveUserToDialectServiceImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

@Operation(id = FVChangeUserGroupToDialectGroup.ID, category = Constants.CAT_USERS_GROUPS, label = "FVChangeUserGroupToDialectGroup",
        description = "Language administrator operation to include user(s) in one of the dialect groups (members, recorders, recorders+)")
public class FVChangeUserGroupToDialectGroup
{

    public static final String ID = "FVChangeUserGroupToDialectGroup";

    private static final Log log = LogFactory.getLog(FVGetPendingUserRegistrations.class);

    @Context
    protected CoreSession session;

    @Param(name = "userNames" )
    protected StringList userNames = null;

    @Param(name = "groupName" )
    protected String groupName;

    @OperationMethod
    public String run( DocumentModel dialect )
    {
        FVMoveUserToDialectServiceImpl util = new FVMoveUserToDialectServiceImpl();

        try
        {
            for (String uName : userNames)
            {
                util.placeNewUserInGroup(dialect, groupName, uName);
                log.info("Moved user " + uName +" to group " + groupName );
            }
        }
        catch( Exception e)
        {
            log.error( e );
            return e.getMessage();
        }

        return "Updated.";
    }
}
