package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PropertyReader extends FV_AbstractPropertyReader
{

    public FV_PropertyReader( ExportColumnRecord spec )
    {
        super( spec );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();
        Object prop = word.getPropertyValue(propertyToRead);

        if( prop != null )
        {
            String propertyValue = (String) prop;

            readValues.add(new FV_PropertyValueWithColumnName(propertyValue, columnNameForOutput));
        }
        else
        {
            readValues.add(new FV_PropertyValueWithColumnName(" ", columnNameForOutput) );
        }

        return readValues;
    }


}
