package ca.firstvoices.utils;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;

import java.io.File;
import java.util.Map;

import static ca.firstvoices.utils.FVExportConstants.DIALECT_RESOURCES_TYPE;

public class FVExportUtils
{
    public static DocumentModel findDialectChildWithRef( CoreSession session, DocumentRef dialectRef, String dialectChildType )
    {
        DocumentModelList children = session.getChildren( dialectRef );

        DocumentModel foundChild = null;

        for (DocumentModel child : children)
        {
            if (child.getType().equals(dialectChildType))
            {
                foundChild = child;
                break;
            }
        }

        return foundChild;
    }

    public static DocumentModel findDialectChild( DocumentModel dialect, String dialectChildType )
    {
       return findDialectChildWithRef( dialect.getCoreSession(), dialect.getRef(), dialectChildType );
    }

    //TODO: replace with query
    public static DocumentModel findChildWithName( CoreSession session, DocumentRef parentRef, String childName )
    {
        DocumentModelList children = session.getChildren( parentRef );

        DocumentModel foundChild = null;

        for (DocumentModel child : children)
        {
            if (child.getName().equals(childName))
            {
                foundChild = child;
                break;
            }
        }

        return foundChild;
    }

    public static DocumentModel findExportFileWithName( CoreSession session, DocumentRef dialectRef, String exportFileName )
    {
        DocumentModel resDoc = findDialectChildWithRef( session, dialectRef, DIALECT_RESOURCES_TYPE );
        DocumentModel exportDoc = findChildWithName( session, resDoc.getRef(), exportFileName );

        return exportDoc;
    }


    //ctx.getProperty(INITIATING_PRINCIPAL)+"-"+ctx.getProperty(DIALECT_NAME_EXPORT)+"-"+ctx.getProperty(EXPORT_FORMAT);

    public static String makeExportFileName( String principalName, String dialectName, String format )
    {
        return principalName + "-" + dialectName + "-" + format;
    }

    // TODO: need to find how this is handled in the production
    private static String getNuxeoBinariesPath()
    {
        Map<String, String> env = System.getenv();
        String nuxeo_binaries = env.get("PWD" );
        nuxeo_binaries = nuxeo_binaries + "/nxserver/data/binaries/";

        return nuxeo_binaries;
    }

    public static String getTEMPBlobDirectoryPath()
    {
        String nuxeo_tmp_path = getNuxeoBinariesPath();

        nuxeo_tmp_path = nuxeo_tmp_path + "tmp/";

        return nuxeo_tmp_path;
    }

    public static String getDataBlobDirectoryPath()
    {
        String nuxeo_data_path = getNuxeoBinariesPath();

        nuxeo_data_path = nuxeo_data_path + "data/";

        return nuxeo_data_path;

    }

    public static String getPathToChildInDialect(CoreSession session, DocumentModel dialect, String childType )
    {
         DocumentModel resourceFolder =  findDialectChildWithRef( session, dialect.getRef(), childType );

         return resourceFolder.getPathAsString() + "/";
    }
}

