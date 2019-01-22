package ca.firstvoices.listeners;

import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.workers.FVAbstractExportWork;
import ca.firstvoices.workers.FVCyclicExportWorker;
import ca.firstvoices.workers.FVExportBlobWorker;
import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

import java.util.*;


import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.makeExportFileName;

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
                FVExportWorkInfo info = (FVExportWorkInfo) ctx.getProperty( EXPORT_WORK_INFO );

                String id = makeExportFileName( info.initiatorName,
                                                info.dialectName,
                                                info.exportFormat );

                if( checkForRunningWorkerBeforeProceeding( id ) )
                {
                    // TODO: ??? delete old file if exists and create a new one
                    workManager.schedule(produceWorker(ctx, new FVExportWorker( id )), true);
                }
                break;


            case FINISH_EXPORT_BY_WRAPPING_BLOB:
                workManager.schedule( produceBlobWorker( ctx ), true);
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

    private FVAbstractExportWork produceBlobWorker( EventContext ctx )
    {
        FVExportWorkInfo info = (FVExportWorkInfo)ctx.getProperty( EXPORT_WORK_INFO );
        FVExportBlobWorker work = new FVExportBlobWorker( String.valueOf(System.nanoTime()), info );
        return work;
    }

    private FVAbstractExportWork produceWorker( EventContext ctx, FVAbstractExportWork work )
    {
        if( ctx.hasProperty( EXPORT_WORK_INFO) )
        {
            work.setWorkInfo( (FVExportWorkInfo)ctx.getProperty( EXPORT_WORK_INFO ) );

            List pc = work.getExportColumns();

            if( pc.size() == 1  )
            {
                work.setExportColumns( new ArrayList<>() );
            }

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
