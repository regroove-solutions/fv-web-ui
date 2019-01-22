package ca.firstvoices.format_producers;

/*
    Producer assembling output formatted as PDF.
*/

import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import ca.firstvoices.utils.FVExportWorkInfo;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.List;

public class FV_PDF_Producer extends FV_AbstractProducer
{
    @Override
    public void writeRowData( List<FV_PropertyValueWithColumnName> rowData  )
    {
    }

    @Override
    public void writeColumnNames()
    {
    }

    @Override
    public void close(CoreSession session, DocumentModel dialect, FVExportWorkInfo info )
    {

    }
}
