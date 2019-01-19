package ca.firstvoices.utils;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

import java.util.Map;

public class FVExportUtils
{
    public static DocumentModel findDialectChild(DocumentModel dialect, String dialectChildType )
    {
        DocumentModelList children = dialect.getCoreSession().getChildren(dialect.getRef());

        DocumentModel dictionary = null;

        for (DocumentModel child : children)
        {
            if (child.getType().equals(dialectChildType))
            {
                dictionary = child;
                break;
            }
        }

        return dictionary;
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
}

