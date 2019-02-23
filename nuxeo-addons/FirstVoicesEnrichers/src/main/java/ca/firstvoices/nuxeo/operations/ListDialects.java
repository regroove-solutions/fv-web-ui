package ca.firstvoices.nuxeo.operations;


import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;

@Operation(id = ListDialects.ID, category = Constants.CAT_DOCUMENT, label = "List dialects in FV tree.",
        description = "Returns a list of dialects which can be joined by new users")
public class ListDialects
{
    public static final String ID = "Document.ListDialects";

    public static final String ALL_DIALECTS          = "*";
    public static final String DIALECTS_TO_JOIN      = "to-join";
    public static final String ENABLED_DIALECTS      = "enabled";
    public static final String DISABLED_DIALECTS     = "disabled";
    public static final String PUBLISHED_DIALECTS    = "published";
    public static final String DELETED_DIALECTS      = "deleted";

    @Context
    protected AutomationService automationService;

    @Param(name = "dialectState", required = true, values = { DIALECTS_TO_JOIN, ALL_DIALECTS, ENABLED_DIALECTS, DISABLED_DIALECTS, PUBLISHED_DIALECTS, DELETED_DIALECTS } )
    protected String dialectState = DIALECTS_TO_JOIN;

    @OperationMethod
    public DocumentModelList run() throws Exception
    {
        LoginContext lctx = null;
        CoreSession session = null;

        DocumentModelList dList = null;
        lctx = Framework.login();
        session = CoreInstance.openCoreSession("default");

        String queryFront = "SELECT ecm:uuid, dc:title FROM FVDialect WHERE ";
        String queryEnd = "ecm:isLatestVersion = 1 ORDER BY dc:title ASC";
        String query = queryFront + queryEnd;

        switch( dialectState )
        {
            case ALL_DIALECTS:
                query = queryFront + queryEnd;
                break;
            case DIALECTS_TO_JOIN:
                query = queryFront + "(ecm:currentLifeCycleState = 'Enabled' OR  ecm:currentLifeCycleState = 'Published') AND " + queryEnd;
                break;
            case ENABLED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Enabled' AND " + queryEnd;
                break;
            case DISABLED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Disabled' AND " + queryEnd;
                break;
            case PUBLISHED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Published' AND " + queryEnd;
                break;
            case DELETED_DIALECTS:
                query = queryFront + "ecm:currentLifeCycleState = 'Deleted' AND " + queryEnd;
                break;
        }

        dList = session.query( query );

        lctx.logout();
        //session.close();

        return dList;
    }
}