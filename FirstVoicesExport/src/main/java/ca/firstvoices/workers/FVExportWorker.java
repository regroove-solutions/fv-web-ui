package ca.firstvoices.workers;

import ca.firstvoices.format_producers.FV_CSV_Producer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import java.util.List;

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

        if( !getDocuments().isEmpty() )
        {
            List listToProcess = getDocuments();

            FV_CSV_Producer fileOutputProducer = new FV_CSV_Producer(id);

            while( !listToProcess.isEmpty() )
            {
                int size = listToProcess.size();

                String  guid = (String)listToProcess.get( size - 1 );
                listToProcess.remove( size -1 );


            }


            fileOutputProducer.close();
        }

        try
        {
            log.warn("FVExportWorker is not implemented yet.");
        }
        catch (Exception e) {
            log.warn(e);
        }
    }
}
