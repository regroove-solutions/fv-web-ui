package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_SimpleListPropertyReader extends FV_AbstractPropertyReader
{

    public FV_SimpleListPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
    }

    public ReaderType readerType()
    {
        return ReaderType.SIMPLE_LIST;
    }

    public List<FV_PropertyValueWithColumnName>readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();

        Object prop = word.getPropertyValue(propertyToRead);
        Object[] colA = columns.toArray();

        if( prop != null )
        {
            if (prop instanceof String[])
            {
                String[] stl = (String[]) prop;
                Integer stlCounter = -1; // stl - simple-type-list

                for (Integer c = 0; c < maxColumns; c++)
                {
                    if (c < stl.length)
                    {
                        stlCounter++;
                        readValues.add(new FV_PropertyValueWithColumnName( (String)colA[c], stl[stlCounter] ));
                    }
                    else
                    {
                        readValues.add(new FV_PropertyValueWithColumnName( (String)colA[c], " "));
                    }
                }
            }
            else
            {
                readValues = writeEmptyRow();
            }
        }
        else
        {
            readValues= writeEmptyRow();
        }

        return readValues;
    }
}
