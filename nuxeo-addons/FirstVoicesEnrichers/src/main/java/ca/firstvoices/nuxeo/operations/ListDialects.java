package ca.firstvoices.nuxeo.operations;


import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.DocumentModelList;

@Operation(id = ListDialects.ID, category = Constants.CAT_FETCH, label = "List dialect in FV tree.",
        description = "Returns a list of dialects which can be joined by new users")

public class ListDialects
{
    public static final String ID = "Document.ListDialects";

    public static final String ALL_DIALECTS          = "*";
    public static final String DIALECTS_TO_JOIN      = "to-join";
    public static final String ENABLED_DIALECTS      = "enabled";
    public static final String PUBLISHED_DIALECTS    = "published";
    public static final String DELETED_DIALECTS      = "deleted";

    @Context
    protected AutomationService automationService;

    @Param(name = "dialect_state", required = true, values = { ALL_DIALECTS, DIALECTS_TO_JOIN, ENABLED_DIALECTS, PUBLISHED_DIALECTS, DELETED_DIALECTS } )
    protected String dialect_state = DIALECTS_TO_JOIN;

    @OperationMethod
    public DocumentModelList run() throws OperationException
    {
        DocumentModelList dList = null;


        return dList;
    }
}

// "SELECT ecm:uuid, dc:title FROM FVDialect WHERE ecm:currentLifeCycleState <> 'deleted' AND ecm:isLatestVersion = 1 ORDER BY dc:title ASC"