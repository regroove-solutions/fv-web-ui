package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.workers.FVExportWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;

import java.util.List;

public abstract class FV_AbstractPropertyReader
{
    protected static final Log log = LogFactory.getLog(FVExportWorker.class);
    protected Object[] columns;

    public enum ReaderType
    {
        BOOLEAN, CATEGORY, COMPOUND, ID_PROP, SPEECH_PART, SIMPLE_LIST, WORD_TRANSLATION, PROPERTY
    }

    protected ExportColumnRecord spec;

    protected String    propertyToRead;
    protected String    columnNameForOutput;
    protected Integer   maxColumns;

    public CoreSession session;

    public FV_AbstractPropertyReader( CoreSession session, ExportColumnRecord spec )
    {
        propertyToRead = spec.property;
        columnNameForOutput = spec.colID;
        maxColumns = spec.numCols;
        this.spec = spec;
        this.session = session;
    }

    public Integer expectedColumnCount()
    {
        return maxColumns;
    }

    public abstract ReaderType readerType();
    public String getPropertyToRead() { return propertyToRead; }

    public StringList getColumnNameForOutput()
    {
        StringList output = new StringList();

        String modColumnName = columnNameForOutput;
        Integer counter = 1;

        for( Integer col = 0; col < maxColumns; col++ )
        {
            output.add(modColumnName);
            modColumnName = columnNameForOutput + "_" + counter.toString();
            counter++;
        }

        columns = output.toArray();
        return output;
    }

    public abstract List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o);
}
