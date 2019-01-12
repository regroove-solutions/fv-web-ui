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
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static ca.firstvoices.utils.FVExportConstants.*;

@Operation(id=FVGenerateDocumentWithFormat.ID, category= Constants.CAT_DOCUMENT, label="Export Document with format", description="Export word or phrase documents with format (CSV or PDF).")
public class FVGenerateDocumentWithFormat
{
    public static final String ID = "Document.FVGenerateDocumentWithFormat";

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
    public void run(DocumentModel input)
    {
        Map<String, Object> parameters = new HashMap<String, Object>();

        try
        {
            ArrayList<String> docsToProcess = getWordDocumentIDs( "*", input.getId() );

            if( docsToProcess != null )
            {
                EventProducer eventProducer = Framework.getService( EventProducer.class );
                DocumentEventContext export_ctx =  new DocumentEventContext( session, session.getPrincipal(), input );
                export_ctx.setProperty( DIALECT_NAME_EXPORT, input.getName() );
                export_ctx.setProperty( QUERY_TO_PREPARE_WORK_FOR_EXPORT, query );
                export_ctx.setProperty( WORDS_TO_EXPORT, docsToProcess );
                export_ctx.setProperty( INITIATING_PRINCIPAL, session.getPrincipal().getName() );
                export_ctx.setProperty( EXPORT_FORMAT, CSV_FORMAT );
                export_ctx.setProperty( COLUMNS_TO_EXPORT, columns );
                export_ctx.setProperty( DIALECT_GUID, input.getId() );

                Event event = export_ctx.newEvent( PRODUCE_FORMATTED_DOCUMENT );
                eventProducer.fireEvent(event);

                parameters.put( "message", "Query to export documents in " + format + " was successfully submitted" );
            }
            else
            {
                // return information
                parameters.put("message", "Error: While attempting to export documents in " + format);
            }

            automation.run(ctx, "WebUI.AddInfoMessage", parameters);

        }
        catch (OperationException e)
        {
            e.printStackTrace();
        }
    }


    private ArrayList<String> getWordDocumentIDs( String query, String dialectID )
    {
        DocumentModelList docs;

        if( query.equals("*") )
        {
            docs = session.query("SELECT * FROM FVWord WHERE ecm:ancestorId = '" + dialectID + "' AND ecm:currentLifeCycleState <> 'deleted' AND ecm:isProxy = 0 AND ecm:isVersion = 0 ORDER BY ecm:name"); // TODO: be weary of limits of how many records will be returned

            if( docs.size() == 0 ) return null;
        }
        else
        {
            return null; // one day there will be a user query here
        }

        ArrayList<String> docsToProcess = new ArrayList<>();

        for( DocumentModel word: docs )
        {
            docsToProcess.add( word.getId() );
        }

        return docsToProcess;
    }
}