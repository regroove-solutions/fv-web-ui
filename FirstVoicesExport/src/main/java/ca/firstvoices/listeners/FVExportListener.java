package ca.firstvoices.listeners;

import ca.firstvoices.workers.FVAbstractExportWork;
import ca.firstvoices.workers.FVCyclicExportWorker;
import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

import java.util.ArrayList;

import static ca.firstvoices.utils.FVExportConstants.*;

public class FVExportListener implements EventListener
{
    private static final Log log = LogFactory.getLog(FVExportListener.class);

    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Override
    public void handleEvent(Event event)
    {
        EventContext ctx = event.getContext();

        switch( event.getName() )
        {
            case PRODUCE_FORMATTED_DOCUMENT:
                String id = ctx.getProperty(INITIATING_PRINCIPAL)+"-"+ctx.getProperty(DIALECT_NAME_EXPORT)+"-"+ctx.getProperty(EXPORT_FORMAT);

                if( checkForRunningWorkerBeforeProceeding( id ) )
                {
                    // TODO: delete old file if exists and create a new one
                    workManager.schedule(produceWorker(ctx, new FVExportWorker( id )), true);
                }
                break;

            case AUTO_PRODUCE_FORMATTED_DOCUMENT:
                if( checkForRunningWorkerBeforeProceeding( CYCLIC_WORKER_ID ) )
                {
                    workManager.schedule( produceWorker(ctx, new FVCyclicExportWorker() ), true);
                }
                break;
        }
    }

    private boolean checkForRunningWorkerBeforeProceeding( String workId )
    {

        if( workManager.find( workId, null ) != null ) return false; // worker is running
        return true; // worker is not running
    }

    private FVAbstractExportWork produceWorker( EventContext ctx, FVAbstractExportWork work )
    {
        if( ctx.hasProperty( QUERY_TO_PREPARE_WORK_FOR_EXPORT) )
        {
            work.setExportQuery(ctx.getProperty( QUERY_TO_PREPARE_WORK_FOR_EXPORT ).toString());
            work.setInitiatorName(ctx.getProperty( INITIATING_PRINCIPAL ).toString());
            work.setDialectName(ctx.getProperty( DIALECT_NAME_EXPORT ).toString());
            work.setDialectGUID(ctx.getProperty( DIALECT_GUID).toString());
            work.setExportFormat(ctx.getProperty( EXPORT_FORMAT ).toString());
            work.setExportColumns( (ArrayList<String>) ctx.getProperty( COLUMNS_TO_EXPORT) );

            work.setDocuments("FV", (ArrayList<String>) ctx.getProperty( WORDS_TO_EXPORT ) );
        }
        else
        {
            work.setExportQuery( INHERITED_FROM_OTHER );
            work.setInitiatorName( "System" );
            work.setDialectName( INHERITED_FROM_OTHER );
            work.setDialectGUID( INHERITED_FROM_OTHER );
            work.setExportFormat( INHERITED_FROM_OTHER );
        }

        return work;
    }
}
