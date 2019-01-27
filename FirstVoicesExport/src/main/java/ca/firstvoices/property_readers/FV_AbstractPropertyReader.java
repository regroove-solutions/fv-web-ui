package ca.firstvoices.property_readers;

import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;

import java.util.List;

public abstract class FV_AbstractPropertyReader
{
    protected static final Log log = LogFactory.getLog(FVExportWorker.class);

    protected String propertyToRead;
    protected String columnNameForOutput;
    protected Integer maxColumns = 1;
    public CoreSession session;


    public FV_AbstractPropertyReader( String ptr, String cnfo, Integer mc )
    {
        propertyToRead = ptr;
        columnNameForOutput = cnfo;
        maxColumns = mc;
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
