package ca.firstvoices.operations;

import ca.firstvoices.utils.ExportColumnRecord;
import ca.firstvoices.utils.FV_PhraseExportCSVColumns;
import ca.firstvoices.utils.FV_WordExportCSVColumns;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.HashMap;

@Operation(id=FVSupportedQueries.ID, category= Constants.CAT_DOCUMENT, label="Get list of supported export columns.", description="Returns column options supported in export to CSV or PDF. ")
public class FVSupportedQueries
{

    public static final String ID = "Document.FVSupportedQueries";

    @Param( name = "format", values = {"CSV", "PDF"} )
    protected String format = "CSV";

    @Param( name = "exportElement", values = {"WORD", "PHRASE"} )
    protected String exportElement = "WORD";


    @OperationMethod
    public StringList run(DocumentModel input)
    {
        if( format.equals("PDF")) return null;

        StringList returnList;

        if( exportElement.equals("WORD") )
        {
            returnList = supportedWordQueries_CSV();
        }
        else
        {
            returnList = supprtedPhraseQueries_CSV();
        }

        return returnList;
    }

    private StringList supportedWordQueries_CSV()
    {
        FV_WordExportCSVColumns wc = new FV_WordExportCSVColumns();

        return getValidExportColumns(  wc.getColumnRecordHashMap() );
    }

    private StringList supprtedPhraseQueries_CSV()
    {
        FV_PhraseExportCSVColumns pc = new FV_PhraseExportCSVColumns();

        return getValidExportColumns(  pc.getColumnRecordHashMap() );
    }

    private StringList getValidExportColumns(  HashMap<String, ExportColumnRecord> map )
    {
        StringList list = new StringList();

        for ( String k : map.keySet() )
        {
            if( map.get( k ).useForExport )
            {
                list.add( k );
            }
        }

        return list;
    }

}
