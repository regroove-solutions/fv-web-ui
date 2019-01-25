package ca.firstvoices.property_readers;

import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PartOfSpeechPropertyReader extends FV_AbstractPropertyReader
{

    public FV_PartOfSpeechPropertyReader( String ptr, String cnfo, Integer mc )
    {
        super( ptr, cnfo, mc );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();
        Object prop = word.getPropertyValue(propertyToRead);

        if( prop instanceof String )
        {
            readValues.add(new FV_PropertyValueWithColumnName((String)prop, columnNameForOutput));
        }
        else
        {
            readValues.add(new FV_PropertyValueWithColumnName("unknown", columnNameForOutput));
        }
        return readValues;
    }
}
