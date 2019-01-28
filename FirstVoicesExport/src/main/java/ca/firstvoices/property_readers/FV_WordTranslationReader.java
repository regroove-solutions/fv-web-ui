package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.*;

public class FV_WordTranslationReader extends FV_AbstractPropertyReader
{
    public FV_WordTranslationReader(CoreSession session, ExportColumnRecord spec )
    {
        super( session, spec );
    }

    public ReaderType readerType()
    {
        return ReaderType.WORD_TRANSLATION;
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();

        Object prop = word.getPropertyValue(propertyToRead);

        if (prop!= null && prop instanceof List)
        {
            ArrayList<HashMap<String, String>> property = (ArrayList<HashMap<String, String>>) prop;
            Integer counter = 0;
            String columnLabel = columnNameForOutput;

            for( Integer i = 0; i < maxColumns; i++ )
            {
                if( property.size() > i )
                {
                    HashMap<String, String> map = property.get(counter);
                    Collection<String> hashMapValues = map.values();
                    Iterator iter = hashMapValues.iterator();

                    String output = (String)iter.next();
                    if( iter.hasNext() )
                    {
                        output = output + " (" + iter.next() + ")";
                    }

                    readValues.add( new FV_PropertyValueWithColumnName( columnLabel, output));
                }
                else
                {
                    readValues.add( new FV_PropertyValueWithColumnName( columnLabel," "));
                }

                columnLabel = columnNameForOutput + "_" + counter.toString();
                counter++;
            }
        }
        else
        {

            readValues = writeColumnDataWhenReceivingWrongType( readValues );
        }

        return readValues;
    }

    private  List<FV_PropertyValueWithColumnName> writeColumnDataWhenReceivingWrongType( List<FV_PropertyValueWithColumnName> readValues)
    {
        Integer counter = 1;
        String columnLabel = columnNameForOutput;

        for( Integer i = 0; i < maxColumns; i++ )
        {
            readValues.add(new FV_PropertyValueWithColumnName( columnLabel, "UNKNOWN TYPE"));
            columnLabel = columnNameForOutput + "_" + counter.toString();
            counter++;
        }

        return readValues;
    }
}
