/**
 *
 */
package ca.firstvoices.utils;

import java.util.HashMap;

import static ca.firstvoices.utils.FVExportConstants.ExportCSVLabels.*;

/**
 * @author dyona
 *
 */

// headers for CSV file
public final class FVExportCSVColumns
{

    public  HashMap<Object, ColumnRecord > columnRecordHashMap;

    public final class ColumnRecord
    {
        Object      colID;
        Object      property;
        boolean     useForExport;

        ColumnRecord( Object cID, Object prop, boolean ufe)
        {
            colID = cID;
            property = prop;
            useForExport = ufe;
        }
    }
//
//    void FVExportColumns()
//    {
//        columnRecordHashMap = new HashMap<>();
//
//        columnRecordHashMap.put( WORD_VALUE,                    new ColumnRecord(ExportCSVLabels.WORD_VALUE,                      "#", false) );
//        columnRecordHashMap.put( CULTURAL_NOTE,                 new ColumnRecord(ExportCSVLabels.CULTURAL_NOTE,                   Properties.CULTURAL_NOTE false) );
//        columnRecordHashMap.put( PART_OF_SPEECH_ID,             new ColumnRecord(ExportCSVLabels.PART_OF_SPEECH_ID,               Properties.PART_OF_SPEECH_ID, false) );
//        columnRecordHashMap.put( PART_OF_SPEECH,                new ColumnRecord(ExportCSVLabels.PART_OF_SPEECH,                  "#", false) );
//        columnRecordHashMap.put( PHONETIC_INFO,                 new ColumnRecord(ExportCSVLabels.PHONETIC_INFO,                   Properties.PHONETIC_INFO ,false) );
//        columnRecordHashMap.put( ASSIGNED_USR_ID,               new ColumnRecord(ExportCSVLabels.ASSIGNED_USR_ID,                 Properties.ASSIGNED_USR_ID, false) );
//        columnRecordHashMap.put( CHANGE_DTTM,                   new ColumnRecord(ExportCSVLabels.CHANGE_DTTM,                     Properties.CHANGE_DTTM, false) );
//        columnRecordHashMap.put( WORD_ID,                       new ColumnRecord(ExportCSVLabels.WORD_ID,                         "#", false) );
//        columnRecordHashMap.put( WORD_STATUS,                   new ColumnRecord(ExportCSVLabels.WORD_STATUS,                     Properties.STATUS_ID, false) );
//        columnRecordHashMap.put( REFERENCE,                     new ColumnRecord(ExportCSVLabels.REFERENCE,                       Properties.REFERENCE, false) );
//        columnRecordHashMap.put( PHRASE_COLUMN,                 new ColumnRecord(ExportCSVLabels.PHRASE_COLUMN,                   "?", false) );
//        columnRecordHashMap.put( DOMINANT_LANGUAGE,             new ColumnRecord(ExportCSVLabels.DOMINANT_LANGUAGE,               "#", false) );
//        columnRecordHashMap.put( AVAILABLE_IN_CHILDRENS_ARCHIVE, new ColumnRecord(ExportCSVLabels.AVAILABLE_IN_CHILDRENS_ARCHIVE, Properties.AVAILABLE_IN_CHILDRENS_ARCHIVE, false) );
//        columnRecordHashMap.put( AVAILABLE_IN_GAMES,            new ColumnRecord(ExportCSVLabels.AVAILABLE_IN_GAMES,              Properties.AVAILABLE_IN_GAMES, false) );
//        columnRecordHashMap.put( CHILD_FOCUSED,                 new ColumnRecord(ExportCSVLabels.CHILD_FOCUSED,                   Properties.CHILD_FOCUSED, false) );
//        columnRecordHashMap.put( DOMINANT_LANGUAGE_DEFINITION,  new ColumnRecord(ExportCSVLabels.DOMINANT_LANGUAGE_DEFINITION,    "*", false) );
//        columnRecordHashMap.put( DOMINANT_LANGUAGE_WORD_VALUE,  new ColumnRecord(ExportCSVLabels.DOMINANT_LANGUAGE_WORD_VALUE,    "@", false) );
//        columnRecordHashMap.put( DOMINANT_LANGUAGE_SENTENCE,    new ColumnRecord(ExportCSVLabels.DOMINANT_LANGUAGE_SENTENCE,      "@", false) );
//        columnRecordHashMap.put( DOMINANT_LANGUAGE_SENTENCE_DEFINITION, new ColumnRecord(ExportCSVLabels.DOMINANT_LANGUAGE_SENTENCE_DEFINITION, "@", false) );
//        columnRecordHashMap.put( CATEGORY_ID,                   new ColumnRecord(ExportCSVLabels.CATEGORY_ID,                     "@", false) );
//        columnRecordHashMap.put( CATEGORY_NAME,                 new ColumnRecord(ExportCSVLabels.CATEGORY_NAME,                   "@", false) );
//        columnRecordHashMap.put( CATEGORIES,                    new ColumnRecord(ExportCSVLabels.CATEGORIES,                      Properties.WORD_CATEGORIES, false) );
//        columnRecordHashMap.put( CONTRIBUTER,                   new ColumnRecord(ExportCSVLabels.CONTRIBUTER,                     Properties.CONTRIBUTER, false) );
//        columnRecordHashMap.put( ID,                            new ColumnRecord(ExportCSVLabels.ID,                              "#", false) );
//        columnRecordHashMap.put( FILENAME,                      new ColumnRecord(ExportCSVLabels.FILENAME,                        "#", false) );
//        columnRecordHashMap.put( DESCR,                         new ColumnRecord(ExportCSVLabels.DESCR,                           "?", false) );
//        columnRecordHashMap.put( SHARED,                        new ColumnRecord(ExportCSVLabels.SHARED,                          "?", false) );
//        columnRecordHashMap.put( RECORDER,                      new ColumnRecord(ExportCSVLabels.RECORDER,                        Properties.MEDIA_RECORDER, false) );
//        columnRecordHashMap.put( USER_ID,                       new ColumnRecord(ExportCSVLabels.USER_ID,                         "?", false) );
//        columnRecordHashMap.put( CONTRIBUTOR,                   new ColumnRecord(ExportCSVLabels.CONTRIBUTOR,                     Properties.CONTRIBUTORS, false) );
//        columnRecordHashMap.put( SOURCE,                        new ColumnRecord(ExportCSVLabels.SOURCE,                          Properties.MEDIA_SOURCE, false) );
//        columnRecordHashMap.put( STATUS,                        new ColumnRecord(ExportCSVLabels.STATUS,                          Properties.MEDIA_STATUS, false) );
//        columnRecordHashMap.put( TITLE,                         new ColumnRecord(ExportCSVLabels.TITLE,                           "#", false) );
//        columnRecordHashMap.put( CODE,                          new ColumnRecord(ExportCSVLabels.CODE,                            "?", false) );
//        columnRecordHashMap.put( USERNAME,                      new ColumnRecord(ExportCSVLabels.USERNAME,                        "?", false) );
//        columnRecordHashMap.put( PHRASE,                        new ColumnRecord(ExportCSVLabels.PHRASE,                          "?", false) );
//        columnRecordHashMap.put( PHRASE_ID,                     new ColumnRecord(ExportCSVLabels.PHRASE_ID,                       "?", false) );
//        columnRecordHashMap.put( PHRASE_STATUS,                 new ColumnRecord(ExportCSVLabels.PHRASE_STATUS,                   "?", false) );
//        columnRecordHashMap.put( DOMINANT_LANGUAGE_PHRASE,      new ColumnRecord(ExportCSVLabels.DOMINANT_LANGUAGE_PHRASE,        "?", false) );
//    }
}