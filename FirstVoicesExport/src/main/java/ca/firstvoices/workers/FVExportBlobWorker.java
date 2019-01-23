package ca.firstvoices.workers;

import ca.firstvoices.utils.FVBlobRelocatorAccessor;
import ca.firstvoices.utils.FVExportWorkInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;
import java.io.*;

import static ca.firstvoices.utils.FVExportConstants.BLOB_WORKER;
import static ca.firstvoices.utils.FVExportConstants.RESOURCES;
import static ca.firstvoices.utils.FVExportUtils.*;

public class FVExportBlobWorker extends FVAbstractExportWork
{
    private static final Log log = LogFactory.getLog(FVExportWorker.class);


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

            // TODO: this is temporary just to check things work correctly
            FVBlobRelocatorAccessor.deleteDigestAndPartialDirectoryStructureForName( workInfo.fileName );

            File file = new File(workInfo.filePath);
            FileBlob fileBlob = new FileBlob(file, "text/csv", "UTF-8" );

            // relocates blob from tmp to data in $NUXEO_HOME/data/binaries/
            // creates 2 subdirectories from the provided digest
            // to keep structure exactly the same as NUXEO
            FVBlobRelocatorAccessor blobRelocator = new FVBlobRelocatorAccessor( fileBlob, workInfo );
            String exportDocDigest = blobRelocator.relocateBlobExportFile();

            // check if wrapper already exists
            DocumentModel resFolder = findDialectChildWithRef( session, new IdRef(workInfo.dialectGUID), RESOURCES );
            DocumentModel wrapper = findChildWithName( session, resFolder.getRef(), workInfo.fileName);

            if( wrapper == null )
            {
                String pathToNewDocument = getPathToChildInDialect(session, session.getDocument(new IdRef(workInfo.dialectGUID)), RESOURCES );


                wrapper = session.createDocumentModel(pathToNewDocument, workInfo.fileName, "FVExport");
                wrapper = session.createDocument(wrapper);
            }

            wrapper.setPropertyValue( "fvexport:dialect",  workInfo.dialectGUID );
            wrapper.setPropertyValue( "fvexport:format",   workInfo.exportFormat );
            wrapper.setPropertyValue( "fvexport:digest",   exportDocDigest );
            wrapper.setPropertyValue( "fvexport:query",    workInfo.exportQuery );
            wrapper.setPropertyValue( "fvexport:columns", "*" ); // TODO: replace with string list rolled into a CSV string

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
