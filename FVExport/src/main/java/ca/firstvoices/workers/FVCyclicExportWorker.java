package ca.firstvoices.workers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.work.AbstractWork;


public class FVCyclicExportWorker extends AbstractWork
{
    private static final Log log = LogFactory.getLog(FVCyclicExportWorker.class);

    public static final String CYCLIC_EXPORT_WORKER = "cyclicExportWorker";

    @Override
    public String getCategory() {
        return CYCLIC_EXPORT_WORKER;
    }

    @Override
    public String getTitle() {
        return "Produce formatted document when triggered by cron.";
    }

    public FVCyclicExportWorker() {
        super("cyclic-export-worker");
    }

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
