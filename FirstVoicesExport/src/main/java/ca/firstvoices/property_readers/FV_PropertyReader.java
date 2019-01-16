package ca.firstvoices.property_readers;

import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PropertyReader extends FV_AbstractPropertyReader
{

    public FV_PropertyReader( String ptr, String cnfo )
    {
        super( ptr, cnfo );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();
        Object prop = word.getPropertyValue(propertyToRead);

        if( prop != null )
        {
            String propertyValue = (String) word.getPropertyValue(propertyToRead);

            readValues.add(new FV_PropertyValueWithColumnName(propertyValue, columnNameForOutput));
        }
        else
        {
            readValues.add(new FV_PropertyValueWithColumnName(" ", columnNameForOutput) );
        }

        return readValues;
    }


}
