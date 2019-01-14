package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as CSV.
*/

import com.opencsv.CSVWriter;
import org.apache.commons.lang3.ArrayUtils;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class FV_CSV_Producer extends FV_AbstractProducer
{
    public FV_CSV_Producer(String file)
    {
        // Will be closed at the end of the software by GC
        try
        {
            fileStream = new FileOutputStream(file);
            csvWriter = new CSVWriter(new OutputStreamWriter(fileStream, "UTF-8"));
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    @Override
    public void writeRowData(String[] message, String exception)
    {
        csvWriter.writeNext(ArrayUtils.addAll(message, exception));

        try
        {
            csvWriter.flush();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    @Override
    public void close()
    {
        try
        {
            csvWriter.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

}
