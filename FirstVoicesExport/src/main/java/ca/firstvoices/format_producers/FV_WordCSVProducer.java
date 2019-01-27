package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as CSV.
*/

import ca.firstvoices.property_readers.*;
import ca.firstvoices.utils.*;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

public class FV_WordCSVProducer extends FV_AbstractProducer
{
    protected FV_SimpleCSVWriter csvWriter;

    public FV_WordCSVProducer(String fileName, StringList columns )
    {
        super();

        FV_WordExportCSVColumns wordColPropMapper = new FV_WordExportCSVColumns();

        try
        {
            addReaders( wordColPropMapper, columns );

            if( createTemporaryOutputFile( fileName, CSV_FORMAT ) )
            {
                csvWriter = new FV_SimpleCSVWriter(new FileWriter(outputFile));
            }
            else
            {
                throw new IOException( "FV_WordCSVProducer: error creating temporary file for export of " + fileName );
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    protected void writeLine( List<String> outputLine )
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
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.TITLE,                         FVExportConstants.ExportCSVLabels.WORD_VALUE, 1) );
        propertyReaders.add(new FV_PartOfSpeechPropertyReader(FVExportProperties.PART_OF_SPEECH_ID, FVExportConstants.ExportCSVLabels.PART_OF_SPEECH, 1));
        propertyReaders.add(new FV_SimpleListPropertyReader(FVExportProperties.CULTURAL_NOTE,       FVExportConstants.ExportCSVLabels.CULTURAL_NOTE, 6));
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.PHONETIC_INFO,                 FVExportConstants.ExportCSVLabels.PHONETIC_INFO, 1));
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.ASSIGNED_USR_ID,               FVExportConstants.ExportCSVLabels.ASSIGNED_USR_ID, 1));
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.CHANGE_DTTM,                   FVExportConstants.ExportCSVLabels.CHANGE_DTTM, 1));
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.IMPORT_ID,                     FVExportConstants.ExportCSVLabels.WORD_ID, 1));
        propertyReaders.add(new FV_PropertyReader(FVExportProperties.REFERENCE,                     FVExportConstants.ExportCSVLabels.REFERENCE, 1));
        propertyReaders.add(new FV_BooleanPropertyReader(FVExportProperties.AVAILABLE_IN_CHILDRENS_ARCHIVE, FVExportConstants.ExportCSVLabels.AVAILABLE_IN_CHILDRENS_ARCHIVE, 1));
        propertyReaders.add(new FV_BooleanPropertyReader(FVExportProperties.AVAILABLE_IN_GAMES,     FVExportConstants.ExportCSVLabels.AVAILABLE_IN_GAMES, 1));
        //  propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.STATUS_ID,                     FVExportConstants.ExportCSVLabels.WORD_STATUS, 1));
        propertyReaders.add(new FV_WordTranslationReader(FVExportProperties.TRANSLATION,            FVExportConstants.ExportCSVLabels.LITERAL_TRANSLATION, 6));
        propertyReaders.add(new FV_WordTranslationReader(FVExportProperties.DEFINITION,             FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION, 6));
        propertyReaders.add(new FV_CategoryPropertyReader(FVExportProperties.WORD_CATEGORIES,       FVExportConstants.ExportCSVLabels.CATEGORIES, 1));
        propertyReaders.add(new FV_CategoryPropertyReader(FVExportProperties.RELATED_PHRASES,       FVExportConstants.ExportCSVLabels.PHRASE_COLUMN, 1));


    }
}
