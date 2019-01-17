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
}

