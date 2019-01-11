package ca.firstvoices.utils;

public class FVExportConstants
{
    // Events sent to trigger start of export
    public static final String PRODUCE_FORMATTED_DOCUMENT = "produceFormattedDocument";
    public static final String AUTO_PRODUCE_FORMATTED_DOCUMENT = "autoProduceFormattedDocument";

    // Parameters passed in Export trigger events
    public static final String DIALECT_NAME_EXPORT  = "Dialect";
    public static final String QUERY_TO_PREPARE_WORK_FOR_EXPORT = "Query";
    public static final String INITIATING_PRINCIPAL = "Principal";
    public static final String EXPORT_FORMAT = "Format";
    public static final String COLUMNS_TO_EXPORT = "Columns";

}
