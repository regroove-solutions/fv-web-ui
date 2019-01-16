package ca.firstvoices.property_readers;

import java.util.List;

public abstract class FV_AbstractPropertyReader
{
    protected String propertyToRead;
    protected String columnNameForOutput;

    public FV_AbstractPropertyReader( String ptr, String cnfo )
    {
        propertyToRead = ptr;
        columnNameForOutput = cnfo;
    }

    public String getPropertyToRead() { return propertyToRead; }
    public String getColumnNameForOutput() { return columnNameForOutput; }

    public abstract List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o);
}
