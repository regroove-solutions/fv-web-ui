package ca.firstvoices.workers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import static ca.firstvoices.utils.FVExportConstants.ON_DEMAND_WORKER_CATEGORY;


public class FVExportWorker extends FVAbstractWork
{
    private static final Log log = LogFactory.getLog(FVExportWorker.class);

    @Override
    public String getCategory() {
        return ON_DEMAND_WORKER_CATEGORY;
    }

    @Override
    public String getTitle() {
        return "Produce formatted document when triggered by user.";
    }

    public FVExportWorker( String id ) { super( id );}

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
