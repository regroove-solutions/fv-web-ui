package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

import java.util.ArrayList;
import java.util.List;

public class FV_IDPropertyReader extends FV_AbstractPropertyReader
{
    public FV_IDPropertyReader( ExportColumnRecord spec )
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
            DocumentModel refDoc = session.getDocument( new IdRef(propertyValue));

            if( refDoc != null )
            {
                readValues.add(new FV_PropertyValueWithColumnName( (String)refDoc.getPropertyValue( "dc:title"), columnNameForOutput));
            }
            else
            {
                readValues.add(new FV_PropertyValueWithColumnName(propertyValue, columnNameForOutput));
            }
        }
        else
        {
            readValues.add(new FV_PropertyValueWithColumnName(" ", columnNameForOutput) );
        }

        return readValues;
    }
}
