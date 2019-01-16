package ca.firstvoices.format_producers;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.StringJoiner;

public class FV_SimpleCSVWriter
{
    protected FileWriter fileHandle;

    FV_SimpleCSVWriter(FileWriter writer)
    {
        fileHandle = writer;
    }

    public void writeNext( List<String> row ) throws IOException
    {
        StringJoiner joiner = new StringJoiner(",");

        for( String s : row )
        {
            joiner.add(s);
        }

        fileHandle.write( joiner.toString() );
    }

    public void flush() throws IOException
    {
        fileHandle.flush();
    }

    public void close() throws IOException
    {
        fileHandle.close();
    }
}
