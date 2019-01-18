package ca.firstvoices.workers;

import org.apache.commons.codec.digest.DigestUtils;
import ca.firstvoices.utils.FVExportCompletionInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.blob.binary.BinaryBlobProvider;
import org.nuxeo.ecm.core.blob.binary.BinaryManager;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

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
            DocumentModel doc = session.createDocumentModel("fvexport");

            byte[] blobData = convertFileContentToBlob( workInfo.filePath );
//            BlobManager.BlobInfo blobInfo = new BlobManager.BlobInfo();
//            blobInfo.digest = DigestUtils.md5Hex(blobData);
//            blobInfo.filename = workInfo.filePath;
//            blobInfo.length = workInfo.fileLength;
//            blobInfo.mimeType = "text/csv";
//            blobInfo.encoding = "UTF-8";

            File file = new File(workInfo.filePath);
            Blob blob = Blobs.createBlob( file, "text/csv", "UTF-8", workInfo.filePath );
            blob.setDigest( DigestUtils.md5Hex(blobData) );

            BinaryManager blobBinaryManager = Framework.getService(BinaryManager.class);
            BinaryBlobProvider bp = new BinaryBlobProvider( blobBinaryManager );

            //bp.writeBlob();


            // DocumentModel doc = session.getDocument( new IdRef(workInfo.dialectGUID));
            //String key = blobManager. // .writeBlob( blob, doc );
            //

            lctx.logout();
            session.close();
        }
        catch ( Exception e)
        {
            e.printStackTrace();
        }
    }

    public static byte[] convertFileContentToBlob(String filePath) throws IOException
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
