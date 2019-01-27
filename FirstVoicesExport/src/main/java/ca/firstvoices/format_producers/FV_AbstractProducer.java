package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_AbstractPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.utils.FV_CSVExportColumns;
import ca.firstvoices.utils.FV_WordExportCSVColumns;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.List;

import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.getTEMPBlobDirectoryPath;

abstract public class FV_AbstractProducer
{
    protected List<FV_AbstractPropertyReader> propertyReaders;
    protected File outputFile;
    protected String originalFileName;
    protected FV_CSVExportColumns spec;

    public CoreSession session;

    FV_AbstractProducer( FV_CSVExportColumns spec )
    {
        propertyReaders = new ArrayList<>();
        session = null;
        this.spec = spec;
    }

    abstract void writeLine( List<String> outputLine );
    abstract void createDefaultPropertyReaders();
    abstract void endProduction();

    public void writeColumnNames()
    {
        List<String> outputLine = getColumnNames();

        writeLine( outputLine );
    }

    public void writeRowData( List<FV_PropertyValueWithColumnName> rowData  )
    {
        List<String> outputLine = createLineFromData( rowData );

        writeLine( outputLine );
    }

    // this close has to be called after subclass completes its own close
    public void close( CoreSession session, DocumentModel dialect, FVExportWorkInfo workInfo )
    {
        endProduction();

        EventProducer eventProducer = Framework.getService( EventProducer.class );
        // finish by generating event for the listener to move created temp file to a blob within Nuxeo data space
        DocumentEventContext blob_worker_ctx =  new DocumentEventContext( session, session.getPrincipal(), dialect );
        workInfo.fileNameAsSaved  = outputFile.getName();
        workInfo.fileName = originalFileName;
        workInfo.filePath = outputFile.getPath();
        workInfo.fileLength = outputFile.length();
        blob_worker_ctx.setProperty( EXPORT_WORK_INFO, workInfo );

        Event event = blob_worker_ctx.newEvent( FINISH_EXPORT_BY_WRAPPING_BLOB );
        eventProducer.fireEvent(event);
    }

    public void addReaders(FV_CSVExportColumns readerGroup, StringList columns )
    {
        if (columns.contains("*"))
        {
            createDefaultPropertyReaders();
        }
        else
        {
            for(String  col : columns )
            {
                ExportColumnRecord colR = readerGroup.getColumnExportRecord(col);

                if (colR != null && colR.useForExport)
                {

                    try
                    {
                        Class<?> clazz = colR.requiredPropertyReader;
                        Constructor<?> constructor = clazz.getConstructor( ExportColumnRecord.class );
                        FV_AbstractPropertyReader instance = (FV_AbstractPropertyReader) constructor.newInstance( colR );
                        instance.session = session;
                        propertyReaders.add(instance);
                    }
                    catch (Exception e)
                    {
                        e.printStackTrace();
                    }
                }
                else
                {
                    // record wrong column
                }
            }
        }
    }

    public Boolean createTemporaryOutputFile( String fileName, String suffix )
    {
        try
        {
            String nuxeo_temp_path = getTEMPBlobDirectoryPath();
            File path = new File( nuxeo_temp_path );
            originalFileName = fileName;
            outputFile = File.createTempFile(fileName, "." + suffix.toLowerCase(), path );

            return true;
        }
        catch( IOException e )
        {
            e.printStackTrace();
        }

        return false;
    }

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
