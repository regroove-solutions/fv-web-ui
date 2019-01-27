package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_PropertyReader;
import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import ca.firstvoices.property_readers.FV_SimpleListPropertyReader;
import ca.firstvoices.property_readers.FV_WordTranslationReader;
import ca.firstvoices.utils.FVExportConstants;
import ca.firstvoices.utils.FVExportProperties;
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
        super();

        FV_PhraseExportCSVColumns phraseExportCSVColumns = new FV_PhraseExportCSVColumns();

        try
        {
            addReaders( phraseExportCSVColumns, columns );

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
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.TITLE,                         FVExportConstants.ExportCSVLabels.PHRASE, 1) );
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.DESCR,                         FVExportConstants.ExportCSVLabels.DESCR, 1) );
        propertyReaders.add(new FV_WordTranslationReader(FVExportProperties.DEFINITION,             FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION, 4) );
        propertyReaders.add(new FV_SimpleListPropertyReader(FVExportProperties.CULTURAL_NOTE,       FVExportConstants.ExportCSVLabels.CULTURAL_NOTE, 4) );
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.REFERENCE,                     FVExportConstants.ExportCSVLabels.REFERENCE, 1) );
    }
}