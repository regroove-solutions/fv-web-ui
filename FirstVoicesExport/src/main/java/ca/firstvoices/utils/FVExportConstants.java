package ca.firstvoices.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public final class FVExportConstants
{
    // Events sent to trigger start of export worker
    public static final String PRODUCE_FORMATTED_DOCUMENT = "produceFormattedDocument";
    public static final String FINISH_EXPORT_BY_WRAPPING_BLOB = "produceWrappedBlob";
    public static final String AUTO_PRODUCE_FORMATTED_DOCUMENT = "autoProduceFormattedDocument";

    // Parameters passed in Export trigger events
    public static final String DIALECT_NAME_EXPORT              = "Dialect";
    public static final String DIALECT_GUID                     = "D_GUID";
    public static final String RESOURCES                        = "FVResources";
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

    // CSV Columns to be placed in exported document
    public final class ExportCSVLabels
    {
        public static final String WORD_VALUE                       = "WORD";
        public static final String CULTURAL_NOTE                    = "CULTURAL_NOTE";
        public static final String PART_OF_SPEECH_ID                = "PART_OF_SPEECH_ID";
        public static final String PART_OF_SPEECH                   = "PART_OF_SPEECH";
        public static final String PHONETIC_INFO                    = "PRONUNCIATION";
        public static final String ASSIGNED_USR_ID                  = "ASSIGNED_USR_ID";
        public static final String CHANGE_DTTM                      = "CHANGE_DTTM";
        public static final String WORD_ID                          = "WORD_ID";
        public static final String WORD_STATUS                      = "WORD_STATUS";
        public static final String REFERENCE                        = "REFERENCE";
        public static final String PHRASE_COLUMN                    = "RELATED_PHRASE";
        public static final String DOMINANT_LANGUAGE                = "DOMINANT_LANGUAGE";
        public static final String AVAILABLE_IN_CHILDRENS_ARCHIVE   = "CHILD_FRIENDLY";
        public static final String AVAILABLE_IN_GAMES               = "INCLUDE_IN_GAMES";
        public static final String CHILD_FOCUSED                    = "CHILD_FOCUSED";
        public static final String DOMINANT_LANGUAGE_DEFINITION     = "DEFINITION";
        public static final String DOMINANT_LANGUAGE_WORD_VALUE     = "LITERAL_TRANSLATION";
        public static final String DOMINANT_LANGUAGE_SENTENCE       = "RELATED_PHRASE_LITERAL_TRANSLATION";
        public static final String DOMINANT_LANGUAGE_SENTENCE_DEFINITION = "RELATED_PHRASE_DEFINITION";
        public static final String CATEGORY_ID                      = "CATEGORY_ID";
        public static final String CATEGORY_NAME                    = "CATEGORY_NAME";
        public static final String CATEGORIES                       = "CATEGORIES";
        public static final String CONTRIBUTER                      = "CONTRIBUTER";
        public static final String ID                               = "ID";
        public static final String FILENAME                         = "FILENAME";
        public static final String DESCR                            = "DESCRIPTION";
        public static final String SHARED                           = "SHARED_WITH_OTHER_DIALECTS";
        public static final String RECORDER                         = "RECORDER";
        public static final String USER_ID                          = "USER_ID";
        public static final String CONTRIBUTOR                      = "CONTRIBUTOR";
        public static final String SOURCE                           = "SOURCE";
        public static final String STATUS                           = "STATUS";
        public static final String TITLE                            = "TITLE";
        public static final String CODE                             = "CODE";
        public static final String USERNAME                         = "USERNAME";

        public static final String PHRASE                           = "PHRASE";
        public static final String PHRASE_ID                        = "PHRASE_ID";
        public static final String PHRASE_STATUS                    = "PHRASE_STATUS";
        public static final String DOMINANT_LANGUAGE_PHRASE         = "DOMINANT_LANGUAGE_PHRASE";
    }
}
