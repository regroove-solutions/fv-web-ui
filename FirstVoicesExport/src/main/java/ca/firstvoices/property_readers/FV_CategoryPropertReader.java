package ca.firstvoices.property_readers;

import java.util.List;

public class FV_CategoryPropertReader extends FV_AbstractPropertyReader
{
    public FV_CategoryPropertReader( String ptr, String cnfo, Integer mc )
    {
        super( ptr, cnfo, mc );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        return null;
    }
}
