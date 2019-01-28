package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_SimpleListPropertyReader extends FV_AbstractPropertyReader
{

    public FV_SimpleListPropertyReader(CoreSession session, ExportColumnRecord spec )
    {
        super( session, spec );
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

        if( prop != null )
        {
            if (prop instanceof String[])
            {
                String[] stl = (String[]) prop;
                String modColumnName = columnNameForOutput;
                Integer counter = 1;
                Integer stlCounter = -1;

                for (Integer c = 0; c < maxColumns; c++)
                {
                    if (c < stl.length)
                    {
                        stlCounter++;
                        readValues.add(new FV_PropertyValueWithColumnName(modColumnName, stl[stlCounter] ));
                    }
                    else
                    {
                        readValues.add(new FV_PropertyValueWithColumnName( modColumnName, " "));
                    }

                    modColumnName = columnNameForOutput + "_" + counter.toString();
                    counter++;

                }
            } else
            {
                readValues.add(new FV_PropertyValueWithColumnName( columnNameForOutput, "unknown instance" ));
            }
        }
        else
        {
            readValues.add(new FV_PropertyValueWithColumnName( columnNameForOutput," ") );
        }

        return readValues;
    }
}
