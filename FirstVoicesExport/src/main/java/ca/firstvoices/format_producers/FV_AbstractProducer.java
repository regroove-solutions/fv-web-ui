package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_AbstractPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import ca.firstvoices.utils.FVExportCompletionInfo;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventProducer;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static ca.firstvoices.utils.FVExportConstants.BlOB_WORK_INFO;
import static ca.firstvoices.utils.FVExportConstants.FINISH_EXPORT_BY_WRAPPING_BLOB;
import static ca.firstvoices.utils.FVExportUtils.getTEMPBlobDirectoryPath;

abstract public class FV_AbstractProducer
{
    protected List<FV_AbstractPropertyReader> propertyReaders;
    File outputFile;
    String originalFileName;

    FV_AbstractProducer()
    {
        propertyReaders = new ArrayList<>();
    }

    abstract void writeColumnNames();
    abstract void writeRowData( List<FV_PropertyValueWithColumnName> rowData  );

    // this close has to be called after subclass completes its own close
    public void close( CoreSession session, DocumentModel input, FVExportCompletionInfo info )
    {
        EventProducer eventProducer = Framework.getService( EventProducer.class );
        // finish by generating event for the listener to move created temp file to a blob within Nuxeo data space
        DocumentEventContext blob_worker_ctx =  new DocumentEventContext( session, session.getPrincipal(), input );
        info.fileNameAsSaved  = outputFile.getName();
        info.fileName = originalFileName;
        info.filePath = outputFile.getPath();
        info.fileLength = outputFile.length();
        blob_worker_ctx.setProperty( BlOB_WORK_INFO, info );

        Event event = blob_worker_ctx.newEvent( FINISH_EXPORT_BY_WRAPPING_BLOB );
        eventProducer.fireEvent(event);
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
