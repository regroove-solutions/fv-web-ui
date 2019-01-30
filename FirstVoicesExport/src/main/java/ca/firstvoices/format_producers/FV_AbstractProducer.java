package ca.firstvoices.format_producers;

import ca.firstvoices.property_readers.FV_AbstractPropertyReader;
import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.utils.FV_CSVExportColumns;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
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

import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.getTEMPBlobDirectoryPath;
import static ca.firstvoices.utils.FVExportUtils.makePropertyReader;

abstract public class FV_AbstractProducer
{
    protected static final Log log = LogFactory.getLog(FV_AbstractProducer.class);
    protected List<FV_AbstractPropertyReader>   propertyReaders;
    protected File                              outputFile;
    protected String                            originalFileName;
    protected FV_CSVExportColumns               spec;
    protected CoreSession                       session;

    protected Boolean hasCompoundReaders = false;


    FV_AbstractProducer( CoreSession session, FV_CSVExportColumns spec )
    {
        this.propertyReaders = new ArrayList<>();
        this.session = session;
        this.spec = spec;
    }

    abstract void writeLine( List<String> outputLine );
    abstract void createDefaultPropertyReaders();
    abstract void endProduction();

    public FV_CSVExportColumns getSpec() { return spec; }

    public void writeColumnNames()
    {
        List<String> outputLine = getColumnNames();

        writeLine( outputLine );
    }

    public void writeRowData( List<FV_PropertyValueWithColumnName> rowData  )
    {
        List<String> outputLine;

        if( hasCompoundReaders )
        {
            List< List<FV_PropertyValueWithColumnName> > multiLines = createOutputFromCompound( rowData );

            for( List<FV_PropertyValueWithColumnName> line : multiLines )
            {
                outputLine = createLineFromData( line );
                writeLine(outputLine);
            }
        }
        else
        {
            outputLine = createLineFromData( rowData );
            writeLine(outputLine);
        }
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
                        FV_AbstractPropertyReader instance = makePropertyReader( session, colR, this );
                        if( instance.readerType() == FV_AbstractPropertyReader.ReaderType.COMPOUND ) hasCompoundReaders = true;
                        propertyReaders.add(instance);
                    }
                    catch (Exception e)
                    {
                        e.printStackTrace();
                    }
                }
                else
                {
                   // log.warn
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
            output.add( (String)column.getReadProperty() );
        }

        return output;
    }

    public List<String> getColumnNames()
    {
        List<String> output = new ArrayList<>();

        for( FV_AbstractPropertyReader reader : propertyReaders )
        {
            StringList columnNames = reader.getColumnNameForOutput();

            output.addAll(columnNames);
         }

        return  output;
    }

    private List<List<FV_PropertyValueWithColumnName>> createOutputFromCompound( List<FV_PropertyValueWithColumnName> rowData )
    {
        List< List<FV_PropertyValueWithColumnName> > listToReturn = new ArrayList<>();
        int numOutputLines = 1;
        int scan = 1;

        // calculate how many compounds and the max number of lines needed
        do
        {
            List<FV_PropertyValueWithColumnName> singleLine = new ArrayList<>();

            for (FV_PropertyValueWithColumnName o : rowData)
            {
                int ol = o.outputLinesInProperty();
                if( ol >= scan )
                {
                    if( ol > numOutputLines ) numOutputLines = ol;
                    if( o.isMultiLine() )
                    {
                        FV_PropertyValueWithColumnName lineObject = (FV_PropertyValueWithColumnName)o.getColumnObject(scan-1);
                        List<FV_PropertyValueWithColumnName> compoundColumnObjects = (List<FV_PropertyValueWithColumnName>)lineObject.getListOfColumnObjects();

                        for( FV_PropertyValueWithColumnName colObj : compoundColumnObjects )
                        {
                            singleLine.add( colObj );
                        }
                    }
                    else
                    {
                        singleLine.add( o );
                    }
                }
                else
                {
                    if( o.isMultiLine() )
                    {
                        singleLine.addAll( writeBlanks( o.getNumberOfCompoundColumn()) );
                    }
                    else
                    {
                        singleLine.add( new FV_PropertyValueWithColumnName( o.getOutputColumnName(), "") );
                    }
                }
            }

            scan++;
            listToReturn.add(singleLine);


        } while ( scan  <= numOutputLines );

        return listToReturn;
    }


    // used for testing of compoundReader - creates empty output row
    public List<FV_PropertyValueWithColumnName> writeDummyRow( StringList columns )
    {
        List<FV_PropertyValueWithColumnName> output = new ArrayList<>();

        for (String col : columns)
        {
            output.add(new FV_PropertyValueWithColumnName( col, ""));
        }

        return output;
    }

    private List<FV_PropertyValueWithColumnName> writeBlanks( int columns )
    {
        List<FV_PropertyValueWithColumnName> output = new ArrayList<>();

        for (int i = 0; i < columns; i++ )
        {
            output.add(new FV_PropertyValueWithColumnName( "", "") );
        }

        return output;

    }

}
