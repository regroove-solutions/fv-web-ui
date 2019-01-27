package ca.firstvoices.property_readers;

import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;

import java.util.ArrayList;
import java.util.List;

public class FV_CategoryPropertyReader extends FV_AbstractPropertyReader
{
    public FV_CategoryPropertyReader(String ptr, String cnfo, Integer mc )
    {
        super( ptr, cnfo, mc );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();
        String[] categoryIds = ( String[])word.getPropertyValue(propertyToRead);

        StringList categories = new StringList();
        String prePend = "";

        for (String categoryId : categoryIds)
        {
            if (categoryId == null)
            {
                log.warn("Null Category in FV_CategoryPropertyReader");
                continue;
            }

            try
            {
                DocumentModel categoryDoc = session.getDocument(new IdRef(categoryId));

                if( categoryDoc != null )
                {
                    categories.add( prePend + categoryDoc.getTitle() );
                    prePend = " | ";
                }
            }
            catch( Exception e )
            {
                log.warn("Null category document in FV_CategoryPropertyReader.");
                e.printStackTrace();
            }
        }

        readValues.add(new FV_PropertyValueWithColumnName( categories.toString(), columnNameForOutput) );

        return readValues;
    }
}
