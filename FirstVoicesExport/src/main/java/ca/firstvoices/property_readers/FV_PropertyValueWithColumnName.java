package ca.firstvoices.property_readers;

import org.nuxeo.ecm.automation.core.util.StringList;

import java.lang.reflect.Array;
import java.util.List;

public class FV_PropertyValueWithColumnName
{
    protected Object readPropertyValue;
    protected String outputColumnName;
    protected Object[] properties;

    public FV_PropertyValueWithColumnName(String ocn, Object rp )
    {
        readPropertyValue = rp;
        outputColumnName = ocn;
    }

    public Object getReadProperty() { return readPropertyValue; }
    public String getOutputColumnName() { return outputColumnName; }
    public String getKey() {  return outputColumnName; }

    public int getNumberOfCompoundColumn()
    {
        if( isMultiLine() )
        {
                return ((List)readPropertyValue).size();
        }

        return 1;
    }

    public Object getColumnObject( int index )
    {
        if( !isMultiLine() ) return null;

        if( properties == null )
        {
            properties = ((List)readPropertyValue).toArray();
        }

        if( properties.length > index )
        {
            return properties[index];
        }

        return null;
    }

    public Boolean isMultiLine()
    {
        return readPropertyValue instanceof List;
    }

    public int outputLinesInProperty()
    {
        if( isMultiLine() )
        {
            return ((List)readPropertyValue).size();
        }

        return 1;
    }

    public Object getListOfColumnObjects()
    {
        if( isMultiLine() )
        {
            return readPropertyValue;
        }

        return null;
    }
}
