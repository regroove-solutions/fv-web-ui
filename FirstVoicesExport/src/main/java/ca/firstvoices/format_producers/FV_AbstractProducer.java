package ca.firstvoices.format_producers;

import com.opencsv.CSVWriter;
import java.io.FileOutputStream;

abstract public class FV_AbstractProducer
{
    protected CSVWriter csvWriter;
    protected FileOutputStream fileStream;

    abstract void writeRowData( String[] rowStr, String exception );
    abstract public void close();
}
