package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

import java.util.HashMap;
import java.util.Map;

@Operation(id=FVGenerateDocumentWithFormat.ID, category= Constants.CAT_DOCUMENT, label="Export Document with format", description="Export word or phrase documents with format (CSV or PDF).")
public class FVGenerateDocumentWithFormat
{
    public static final String ID = "Document.ExportDocumentWithFormat";

    @Param( name = "query" )
    protected String query;

    @Param( name = "columns" )
    protected StringList columns;

    @Param( name = "format", values = {"CSV", "PDF"} )
    protected String format = "CSV";

    protected AutomationService automation = Framework.getService(AutomationService.class);

    @Context
    protected CoreSession session;

    @Context
    protected OperationContext ctx;


    @OperationMethod
    public String run(DocumentModel input)
    {
        Map<String, Object> parameters = new HashMap<String, Object>();
        String result = "";

        try
        {
            parameters.put("message", "Error: While attempting to export documents in " + format);

            automation.run(ctx, "WebUI.AddInfoMessage", parameters);
        }
        catch (OperationException e)
        {
            e.printStackTrace();
        }

        return result;
    }
}