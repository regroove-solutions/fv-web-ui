package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.runtime.api.Framework;

import java.util.HashMap;
import java.util.Map;

@Operation(id=FVFormattedDocumentGetter.ID, category= Constants.CAT_DOCUMENT, label="Get formatted document", description="Retrieve formatted (CSV or PDF) document from principals home directory.")

public class FVFormattedDocumentGetter {
    public static final String ID = "Document.GetFormattedDocument";

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
            parameters.put("message", "Error: While attempting to retrieve formatted documents from your ("+ ctx.getPrincipal().getName() + ") home directory." );

            automation.run(ctx, "WebUI.AddInfoMessage", parameters);
        }
        catch (OperationException e)
        {
            e.printStackTrace();
        }

        return result;
    }
}
