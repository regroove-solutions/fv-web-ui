package ca.firstvoices.workers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.work.AbstractWork;

import static ca.firstvoices.utils.FVExportConstants.CYCLIC_EXPORT_WORKER_CATEGORY;
import static ca.firstvoices.utils.FVExportConstants.CYCLIC_WORKER_ID;


public class FVCyclicExportWorker extends FVAbstractWork
{
    private static final Log log = LogFactory.getLog(FVCyclicExportWorker.class);

    @Override
    public String getCategory() {
        return CYCLIC_EXPORT_WORKER_CATEGORY;
    }

    @Override
    public String getTitle() {
        return "Produce formatted document when triggered by cron.";
    }

    public FVCyclicExportWorker() { super( CYCLIC_WORKER_ID ); } // we will not need more than one

    @Override
    public void work()
    {
        try
        {
            log.warn("FVCyclicExportWorker is not implemented yet.");
        }
        catch (Exception e)
        {
            log.warn(e);
        }
    }
}
