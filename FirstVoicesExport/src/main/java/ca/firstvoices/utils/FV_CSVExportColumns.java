package ca.firstvoices.utils;

import java.util.HashMap;

public class FV_CSVExportColumns
{
    protected HashMap<String, ExportColumnRecord > columnRecordHashMap;

    protected FV_CSVExportColumns()
    {
        columnRecordHashMap = new HashMap<>();
    }

    public ExportColumnRecord getColumnExportRecord( String columnToExport )
    {
        return  columnRecordHashMap.get( columnToExport );
    }

    public HashMap<String, ExportColumnRecord > getColumnRecordHashMap()
    {
        return columnRecordHashMap;
    }
}
