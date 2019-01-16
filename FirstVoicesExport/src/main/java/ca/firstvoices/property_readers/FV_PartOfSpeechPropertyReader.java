package ca.firstvoices.property_readers;

import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PartOfSpeechPropertyReader extends FV_AbstractPropertyReader
{

    public FV_PartOfSpeechPropertyReader( String ptr, String cnfo )
    {
        super( ptr, cnfo );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();

        readValues.add( new FV_PropertyValueWithColumnName(" ", columnNameForOutput ));

        return readValues;
    }
}
