package ca.firstvoices.workers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.work.AbstractWork;


public class FVExportWorker extends AbstractWork
{
    private static final Log log = LogFactory.getLog(FVExportWorker.class);

    public static final String ON_DEMAND_EXPORT_WORKER_ = "demandExportWorker";

    @Override
    public String getCategory() {
        return ON_DEMAND_EXPORT_WORKER_;
    }

    @Override
    public String getTitle() {
        return "Produce formatted document when triggered by user.";
    }

    public FVExportWorker() {
        super("on-demand-export-worker");
    }

    @Override
    public void work()
    {
        try
        {
            log.warn("FVExportWorker is not implemented yet.");
        }
        catch (Exception e) {
            log.warn(e);
        }
    }
}
