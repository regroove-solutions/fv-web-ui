package ca.firstvoices.property_readers;

import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_SimpleListPropertyReader extends FV_AbstractPropertyReader
{

    public FV_SimpleListPropertyReader( String ptr, String cnfo, int mc )
    {
        super( ptr, cnfo );
        maxColumns = mc;
    }

    public List<FV_PropertyValueWithColumnName>readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();

        Object prop = word.getPropertyValue(propertyToRead);

        if( prop instanceof String[] )
        {
            String[] stl = (String[])prop;
            String modColumnName = columnNameForOutput;
            Integer counter = 1;
            Integer stlCounter = -1;

            for( Integer c = 0; c < maxColumns; c++ )
            {
                if( c < stl.length )
                {
                    stlCounter++;
                    readValues.add(new FV_PropertyValueWithColumnName( stl[stlCounter], modColumnName) );
                }
                else
                {
                    readValues.add(new FV_PropertyValueWithColumnName(" ", modColumnName));
                }

                modColumnName = columnNameForOutput + "_" + counter.toString();
                counter++;

            }
        }
        else
        {
            readValues.add(new FV_PropertyValueWithColumnName("unknown", columnNameForOutput ));
        }

        return readValues;
    }
}
