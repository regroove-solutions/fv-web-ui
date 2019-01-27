package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;

import java.util.List;

public abstract class FV_AbstractPropertyReader
{
    protected static final Log log = LogFactory.getLog(FVExportWorker.class);

    protected ExportColumnRecord spec;

    protected String    propertyToRead;
    protected String    columnNameForOutput;
    protected Integer   maxColumns;

    public CoreSession session;

    public FV_AbstractPropertyReader( ExportColumnRecord spec )
    {
        propertyToRead = spec.property;
        columnNameForOutput = spec.colID;
        maxColumns = spec.numCols;
        this.spec = spec;
        session = null;
    }

    public Integer expectedColumnCount()
    {
        return maxColumns;
    }
    public String getPropertyToRead() { return propertyToRead; }
    public String getColumnNameForOutput() { return columnNameForOutput; }

    public abstract List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o);
}
