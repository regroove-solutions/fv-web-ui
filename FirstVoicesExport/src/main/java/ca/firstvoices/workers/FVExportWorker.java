package ca.firstvoices.workers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;

import static ca.firstvoices.utils.FVExportConstants.ON_DEMAND_WORKER_CATEGORY;

/*
        Worker description is in FVAbstractExportWorker file.
*/

public class FVExportWorker extends FVAbstractExportWork
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
        // open output file
        try
        {
            log.warn("FVExportWorker is not implemented yet.");
        }
        catch (Exception e) {
            log.warn(e);
        }
    }


}
