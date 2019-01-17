package ca.firstvoices.workers;

import ca.firstvoices.utils.FVExportCompletionInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import static ca.firstvoices.utils.FVExportConstants.FINISH_EXPORT_BY_WRAPPING_BLOB;

public class FVEXportBlobWorker  extends FVAbstractExportWork
{
    private FVExportCompletionInfo workInfo;

    private static final Log log = LogFactory.getLog(FVExportWorker.class);

    @Override
    public String getCategory() {
        return FINISH_EXPORT_BY_WRAPPING_BLOB;
    }

    @Override
    public String getTitle() {
        return "Move an export file to blob and create a wrapper.";
    }

    public FVEXportBlobWorker(String id, FVExportCompletionInfo info )
    {
        super( id );
        workInfo = info;
    }

    @Override
    public void work()
    {

    }
}
