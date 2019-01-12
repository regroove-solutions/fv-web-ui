package ca.firstvoices.utils;

public class FVExportConstants
{
    // Events sent to trigger start of export
    public static final String PRODUCE_FORMATTED_DOCUMENT = "produceFormattedDocument";
    public static final String AUTO_PRODUCE_FORMATTED_DOCUMENT = "autoProduceFormattedDocument";

    // Parameters passed in Export trigger events
    public static final String DIALECT_NAME_EXPORT              = "Dialect";
    public static final String DIALECT_GUID                     = "D_GUID";
    public static final String QUERY_TO_PREPARE_WORK_FOR_EXPORT = "Query";
    public static final String INHERITED_FROM_OTHER             = "INHERITED";
    public static final String INITIATING_PRINCIPAL             = "Principal";
    public static final String EXPORT_FORMAT                    = "Format";
    public static final String COLUMNS_TO_EXPORT                = "Columns";
    public static final String CSV_FORMAT                       = "CSV";
    public static final String PDF_FORMAT                       = "PDF";
    public static final String CYCLIC_WORKER_ID                 = "cyclic-export-worker";
    public static final String CYCLIC_WORKER_QUEUE_ID           = "cyclicExportWorker";
    public static final String CYCLIC_EXPORT_WORKER_CATEGORY    = CYCLIC_WORKER_QUEUE_ID;
    public static final String ON_DEMAND_WORKER_QUEUE_ID        = "demandExportWorker";
    public static final String ON_DEMAND_WORKER_CATEGORY        = ON_DEMAND_WORKER_QUEUE_ID;
    public static final String WORDS_TO_EXPORT                  = "WORDS_TO_EXPORT";
    public static final String PHRASES_TO_EXPORT                = "PHRASES_TO_EXPORT";

}
