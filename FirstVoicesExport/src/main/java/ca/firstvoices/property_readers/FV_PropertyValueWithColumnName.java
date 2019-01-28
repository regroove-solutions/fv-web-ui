package ca.firstvoices.property_readers;

public class FV_PropertyValueWithColumnName
{
    protected String readPropertyValue;
    protected String outputColumnName;

    public FV_PropertyValueWithColumnName(String ocn, String rp )
    {
        readPropertyValue = rp;
        outputColumnName = ocn;
    }

    public String getReadProperty() { return readPropertyValue; }
    public String getOutputColumnName() { return outputColumnName; }


}
