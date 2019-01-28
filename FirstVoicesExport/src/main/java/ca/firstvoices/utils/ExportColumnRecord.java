package ca.firstvoices.utils;

import ca.firstvoices.property_readers.FV_PropertyValueWithColumnName;
import org.nuxeo.ecm.automation.core.util.StringList;

import java.util.Map;

public class ExportColumnRecord
{
    public String                           colID;          // column label as received from UI to identify property
    public String                           property;       // property string to retrieve value
    public Boolean                          useForExport;   // set to true if it is ready to be used for export
    public Integer                          numCols;        // max number of columns we want to allow in csv
    public Class                            requiredPropertyReader;
    public FV_PropertyValueWithColumnName   compound[];

    ExportColumnRecord( String cID, String prop, Boolean ufe, Integer nc, Class rpr, FV_PropertyValueWithColumnName[] c )
    {
        colID = cID;
        property = prop;
        useForExport = ufe;
        numCols = nc;
        requiredPropertyReader = rpr;
        compound = c;
    }

}
