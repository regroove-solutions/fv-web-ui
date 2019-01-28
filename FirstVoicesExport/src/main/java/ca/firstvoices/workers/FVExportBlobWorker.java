package ca.firstvoices.workers;

import ca.firstvoices.utils.FVExportWorkInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;
import java.io.*;

import static ca.firstvoices.utils.FVExportConstants.*;

public class FVExportBlobWorker extends FVAbstractExportWork
{
    private static final Log log = LogFactory.getLog(FVExportBlobWorker.class);

    @Override
    public String getCategory() {
        return BLOB_WORKER;
    }

    @Override
    public String getTitle() {
        return "Move an export file to blob and create a wrapper.";
    }

    public FVExportBlobWorker(String id, FVExportWorkInfo info )
    {
        super( id );
        super.setWorkInfo( info );
    }

    @Override
    public void work()
    {
        try
        {
            LoginContext lctx = Framework.login();
            CoreSession session = CoreInstance.openCoreSession("default");


            File file = new File(workInfo.filePath);
            FileBlob fileBlob = new FileBlob(file, "text/csv", "UTF-8" );

            DocumentModel wrapper =  workInfo.wrapper;

            wrapper.setPropertyValue( "file:content", fileBlob );

            workInfo.workDuration = (System.currentTimeMillis() - workInfo.workDuration) / MILLISECONDS;
            workInfo.setExportProgress( "EXPORT: Total work time : " + workInfo.workDuration + "seconds while processing " + workInfo.originalWorkloadSize + " documents." );
            workInfo.setExportProgressValue( 100.0 );

            session.saveDocument( wrapper ); // ?
            session.save();

            lctx.logout();
            session.close();
        }
        catch ( Exception e)
        {
            e.printStackTrace();
        }
    }
}
