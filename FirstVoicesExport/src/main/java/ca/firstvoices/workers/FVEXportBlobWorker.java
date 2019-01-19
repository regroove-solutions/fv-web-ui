package ca.firstvoices.workers;

import org.apache.commons.codec.digest.DigestUtils;
import ca.firstvoices.utils.FVExportCompletionInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.ecm.core.blob.binary.Binary;
import org.nuxeo.ecm.core.blob.binary.DefaultBinaryManager;
import org.nuxeo.ecm.core.blob.binary.LocalBinaryManager;
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

            // this is a test to get a digest using MD5
            // I am not sure if this is done automatically later
//            byte[] blobData = convertFileContentToBlob( workInfo.filePath );
//            BlobManager.BlobInfo blobInfo = new BlobManager.BlobInfo();
//            blobInfo.digest = DigestUtils.md5Hex(blobData);
//            blobInfo.filename = workInfo.filePath;
//            blobInfo.length = workInfo.fileLength;
//            blobInfo.mimeType = "text/csv";
//            blobInfo.encoding = "UTF-8";
            File file = new File(workInfo.filePath);
            //FileInputStream inputStream = new FileInputStream( file );

            FileBlob fileBlob = new FileBlob(file, "text/csv", "UTF-8" );
            //fileBlob.setDigest( DigestUtils.md5Hex(blobData) );

            // I am assuming I have to use binaryMgr to bring this into location we want
            // apparently if the file/document do not exist ... provider has to be used
            // if document exists manager needs to be used - needs to be understood better
            // and confirmed
            // DefaultBinaryManger is suppose deal with large files
            // there is also LocalBinaryManager which is less desirable to use.
            //TODO: need to get org.nuxeo.ecm.core.storage.binary.BinaryManagerService
            // I dunno why I cannnot make it happen
            // through this service we will get DefaultBinaryManager

            //DefaultBinaryManager defaultBinaryManager; // bmgrs.getBinaryManager("default"); // default is the repository
            // Binary bin = defaultBinaryManager.getBinary( fileBlob );

            // this is the only call which saved the data in the location in binaries/data/
            // DocumentModel doc = session.getDocument( new IdRef(workInfo.dialectGUID));

            //  DocumentModel doc = session.createDocumentModel("fvexport");

            // bp.writeBlob();

            // DocumentModel doc = session.getDocument( new IdRef(workInfo.dialectGUID));
            //

            lctx.logout();
            session.close();
        }
        catch ( Exception e)
        {
            e.printStackTrace();
        }
    }

    // early experiment
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
