package ca.firstvoices.workers;

import ca.firstvoices.utils.FVBlobRelocatorAccessor;
import ca.firstvoices.utils.FVExportCompletionInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;
import java.io.*;

import static ca.firstvoices.utils.FVExportConstants.BLOB_WORKER;

public class FVEXportBlobWorker  extends FVAbstractExportWork
{
    private FVExportCompletionInfo workInfo;

    private static final Log log = LogFactory.getLog(FVExportWorker.class);


    @Override
    public String getCategory() {
        return BLOB_WORKER;
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
        try
        {
            LoginContext lctx = Framework.login();
            CoreSession session = CoreInstance.openCoreSession("default");

            File file = new File(workInfo.filePath);
            FileBlob fileBlob = new FileBlob(file, "text/csv", "UTF-8" );

            FVBlobRelocatorAccessor blobRelocator = new FVBlobRelocatorAccessor( fileBlob, workInfo );

            // relocates blob from tmp to data in $NUXEO_HOME/data/binaries/
            // creates 2 subdirectories from the provided digest
            // to keep structure exactly the same as NUXEO is doing
            String exportDocDigest = blobRelocator.relocateBlobExportFile();

            // TODO: this is temporary just to check things work correctly
            // it uses internal blobRelocator digest created during relocation
            Boolean bde = blobRelocator.checkIfDigestExists();

            // TODO: COMPLETE HERE!!!!!
            // - create FVExport wrapper
            // - attach exportDocDigest to the wrapper
            // - attach workInfo properties to the wrapper

            lctx.logout();
            session.close();
        }
        catch ( Exception e)
        {
            e.printStackTrace();
        }
    }

    // early experiment - leave it here
    public static byte[] experiment(String filePath) throws IOException
    {
        // create file object
        File file = new File(filePath);
        // initialize a byte array of size of the file
        byte[] fileContent = new byte[(int) file.length()];
        FileInputStream inputStream = null;

        try
        {
            // create an input stream pointing to the file
            inputStream = new FileInputStream(file);

            // read the contents of file into byte array
            inputStream.read(fileContent);
        }
        catch (IOException e)
        {
            throw new IOException("Unable to convert file to byte array. " + e.getMessage());
        }
        finally
        {
            // close input stream
            if (inputStream != null)
            {
                inputStream.close();
            }
        }

        return fileContent;
    }
}
