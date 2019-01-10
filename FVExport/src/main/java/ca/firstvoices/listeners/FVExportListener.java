package ca.firstvoices.listeners;

import ca.firstvoices.workers.FVCyclicExportWorker;
import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

public class FVExportListener implements EventListener
{
    private static final Log log = LogFactory.getLog(FVExportListener.class);

    public static final String PRODUCE_FORMATTED_DOCUMENT = "produceFormattedDocument";
    public static final String AUTO_PRODUCE_FORMATTED_DOCUMENT = "autoProduceFormattedDocument";

    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Override
    public void handleEvent(Event event)
    {
        switch( event.getName() )
        {
            case PRODUCE_FORMATTED_DOCUMENT:
                FVExportWorker doExportFormattedDoc = new FVExportWorker(); // TODO: pass arguments attached to event
                workManager.schedule(doExportFormattedDoc, true);
                break;

            case AUTO_PRODUCE_FORMATTED_DOCUMENT:
                FVCyclicExportWorker doAutoExportFormattedDoc = new FVCyclicExportWorker(); // TODO: pass arguments attached to event
                workManager.schedule(doAutoExportFormattedDoc, true);
                break;
        }
    }
}
