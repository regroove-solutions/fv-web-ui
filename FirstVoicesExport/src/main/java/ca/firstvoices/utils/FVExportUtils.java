package ca.firstvoices.utils;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;

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
}

