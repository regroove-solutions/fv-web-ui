package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as PDF.
*/

import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import ca.firstvoices.utils.FVExportWorkInfo;
import ca.firstvoices.utils.FV_CSVExportColumns;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.List;

public class FV_PDF_Producer extends FV_AbstractProducer
{

    FV_PDF_Producer(String fileName, StringList columns  )
    {
        super( null );
    }

    @Override
    public void writeRowData( List<FV_PropertyValueWithColumnName> rowData  )
    {
    }

    public void writeLine( List<String> outputLine )
    {
    }

    protected void endProduction()
    {
    }

    protected void createDefaultPropertyReaders()
    {
    }
}
