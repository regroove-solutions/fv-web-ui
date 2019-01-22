package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as CSV.
*/

import ca.firstvoices.property_readers.*;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.utils.FVExportConstants;
import ca.firstvoices.utils.FVExportWordProperties;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.CSV_FORMAT;

public class FV_WordCSVProducer extends FV_AbstractProducer
{
    protected FV_SimpleCSVWriter csvWriter;

    public FV_WordCSVProducer(String fileName )
    {
        super();

        try
        {
            propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.TITLE,                         FVExportConstants.ExportCSVLabels.WORD_VALUE) );
            propertyReaders.add(new FV_PartOfSpeechPropertyReader(FVExportWordProperties.PART_OF_SPEECH_ID, FVExportConstants.ExportCSVLabels.PART_OF_SPEECH));
            propertyReaders.add(new FV_SimpleListPropertyReader(FVExportWordProperties.CULTURAL_NOTE,       FVExportConstants.ExportCSVLabels.CULTURAL_NOTE, 6));
            propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.PHONETIC_INFO,                 FVExportConstants.ExportCSVLabels.PHONETIC_INFO));
            propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.ASSIGNED_USR_ID,               FVExportConstants.ExportCSVLabels.ASSIGNED_USR_ID));
            propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.CHANGE_DTTM,                   FVExportConstants.ExportCSVLabels.CHANGE_DTTM));
            propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.IMPORT_ID,                     FVExportConstants.ExportCSVLabels.WORD_ID));
            propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.REFERENCE,                     FVExportConstants.ExportCSVLabels.REFERENCE));
            propertyReaders.add(new FV_BooleanPropertyReader(FVExportWordProperties.AVAILABLE_IN_CHILDRENS_ARCHIVE, FVExportConstants.ExportCSVLabels.AVAILABLE_IN_CHILDRENS_ARCHIVE));
            propertyReaders.add(new FV_BooleanPropertyReader(FVExportWordProperties.AVAILABLE_IN_GAMES,     FVExportConstants.ExportCSVLabels.AVAILABLE_IN_GAMES));
        //  propertyReaders.add(new FV_PropertyReader(FVExportWordProperties.STATUS_ID,                     FVExportConstants.ExportCSVLabels.WORD_STATUS));
            propertyReaders.add(new FV_WordTranslationReader(FVExportWordProperties.TRANSLATION,            FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_WORD_VALUE, 6));
            propertyReaders.add(new FV_WordTranslationReader(FVExportWordProperties.DEFINITION,             FVExportConstants.ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION, 6));

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

    public void writeColumnNames()
    {
        List<String> outputLine = getColumnNames();

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

    public void writeRowData(List<FV_PropertyValueWithColumnName> data )
    {
        List<String> outputLine = createLineFromData( data );

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

    @Override
    public void close(CoreSession session, DocumentModel dialect, FVExportWorkInfo info )
    {
        try
        {
            csvWriter.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        // always call super to generate blob and a wrapper document
        super.close( session, dialect, info );
    }

}
