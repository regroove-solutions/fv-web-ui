package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_CompoundPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyReader;
import ca.firstvoices.utils.FVExportConstants;
import ca.firstvoices.utils.FV_PhraseExportCSVColumns;
import org.nuxeo.ecm.automation.core.util.StringList;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

public class FV_PhraseCSVProducer extends FV_AbstractProducer
{

    protected FV_SimpleCSVWriter csvWriter;

    public FV_PhraseCSVProducer(String fileName, StringList columns )
    {
        super( new FV_PhraseExportCSVColumns() );

        try
        {
            addReaders( spec, columns );

            if( createTemporaryOutputFile( fileName, CSV_FORMAT ) )
            {
                csvWriter = new FV_SimpleCSVWriter(new FileWriter(outputFile));
            }
            else
            {
                throw new IOException( "FV_PhraseCSVProducer: error creating temporary file for export of " + fileName );
            }
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }
    }

    public void writeLine( List<String> outputLine )
    {
        try
        {
            csvWriter.writeNext(outputLine );

            csvWriter.flush();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    protected void endProduction()
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


    protected void createDefaultPropertyReaders()
    {
        propertyReaders.add( new FV_PropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.PHRASE ) ) );
        propertyReaders.add( new FV_PropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.DESCR ) ) );
        propertyReaders.add( new FV_PropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION ) ) );
        propertyReaders.add( new FV_PropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.CULTURAL_NOTE ) ) );
        propertyReaders.add( new FV_PropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.REFERENCE ) ) );

        propertyReaders.add( new FV_CompoundPropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.IMAGE ) ) );
        propertyReaders.add( new FV_CompoundPropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.AUDIO ) ) );
        propertyReaders.add( new FV_CompoundPropertyReader( spec.getColumnExportRecord( FVExportConstants.ExportCSVLabels.VIDEO ) ) );
    }
}