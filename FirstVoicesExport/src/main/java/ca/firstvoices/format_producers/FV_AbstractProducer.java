package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_AbstractPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;

import java.util.ArrayList;
import java.util.List;

abstract public class FV_AbstractProducer
{
    protected FV_SimpleCSVWriter csvWriter;

    protected List<FV_AbstractPropertyReader> propertyReaders;

    FV_AbstractProducer()
    {
        propertyReaders = new ArrayList<FV_AbstractPropertyReader>();
    }

    abstract void writeColumnNames();
    abstract void writeRowData( List<FV_PropertyValueWithColumnName> rowData  );
    abstract public void close();

    public List<FV_PropertyValueWithColumnName> readPropertiesWithReadersFrom( Object o )
    {
        List<FV_PropertyValueWithColumnName> listToReturn = new ArrayList<>();

        for( FV_AbstractPropertyReader pr : propertyReaders )
        {

            List<FV_PropertyValueWithColumnName> listToAdd = pr.readPropertyFromObject( o );

            listToReturn.addAll( listToAdd );
        }

        return listToReturn;
    }

    public List<String> createLineFromData( List<FV_PropertyValueWithColumnName> data )
    {
        List<String> output = new ArrayList<>();

        for( FV_PropertyValueWithColumnName column : data )
        {
            output.add( column.getReadProperty() );
        }

        return output;
    }

    public List<String> getColumnNames()
    {
        List<String> output = new ArrayList<>();

        for( FV_AbstractPropertyReader reader : propertyReaders )
        {
            Integer colCount = reader.expectedColumnCount();

            if( colCount > 1 )
            {
                String modColumnName = reader.getColumnNameForOutput();
                Integer counter = 1;

                for( Integer col = 0; col < colCount; col++ )
                {
                    output.add(modColumnName);
                    modColumnName = reader.getColumnNameForOutput() + "_" + counter.toString();
                    counter++;
                }
            }
            else
            {
                output.add(reader.getColumnNameForOutput());
            }
        }

        return  output;
    }
}
