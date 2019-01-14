/**
 *
 */
package ca.firstvoices.export.columns;

import java.util.HashMap;

import static ca.firstvoices.utils.FVExportConstants.*;

/**
 * @author dyona
 *
 */

public final class FVExportColumns
{

    HashMap<Object, ColumnRecord > columnRecordHashMap;

    public final class ColumnRecord
    {
        Object      colID;
        boolean     useForExport;

        void ColumnRecord( Object cID, boolean ufe)
        {
            colID = cID;
            useForExport = ufe;
        }
    }

    void FVExportColumns()
    {
        columnRecordHashMap = new HashMap<>();

        columnRecordHashMap.put( WORD_VALUE,                    new ColumnRecord(WORD_VALUE, false) );
        columnRecordHashMap.put( CULTURAL_NOTE,                 new ColumnRecord(CULTURAL_NOTE, false) );
        columnRecordHashMap.put( PART_OF_SPEECH_ID,             new ColumnRecord(PART_OF_SPEECH_ID, false) );
        columnRecordHashMap.put( PART_OF_SPEECH,                new ColumnRecord(PART_OF_SPEECH, false) );
        columnRecordHashMap.put( PHONETIC_INFO,                 new ColumnRecord(PHONETIC_INFO, false) );
        columnRecordHashMap.put( ASSIGNED_USR_ID,               new ColumnRecord(ASSIGNED_USR_ID, false) );
        columnRecordHashMap.put( CHANGE_DTTM,                   new ColumnRecord(CHANGE_DTTM, false) );
        columnRecordHashMap.put( WORD_ID,                       new ColumnRecord(WORD_ID, false) );
        columnRecordHashMap.put( WORD_STATUS,                   new ColumnRecord(WORD_STATUS, false) );
        columnRecordHashMap.put( REFERENCE,                     new ColumnRecord(REFERENCE, false) );
        columnRecordHashMap.put( PHRASE_COLUMN,                 new ColumnRecord(PHRASE_COLUMN, false) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE,             new ColumnRecord(DOMINANT_LANGUAGE, false) );
        columnRecordHashMap.put( AVAILABLE_IN_CHILDRENS_ARCHIVE, new ColumnRecord(AVAILABLE_IN_CHILDRENS_ARCHIVE, false) );
        columnRecordHashMap.put( AVAILABLE_IN_GAMES,            new ColumnRecord(AVAILABLE_IN_GAMES, false) );
        columnRecordHashMap.put( CHILD_FOCUSED,                 new ColumnRecord(CHILD_FOCUSED, false) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_DEFINITION,  new ColumnRecord(DOMINANT_LANGUAGE_DEFINITION, false) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_WORD_VALUE,  new ColumnRecord(DOMINANT_LANGUAGE_WORD_VALUE, false) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_SENTENCE,    new ColumnRecord(DOMINANT_LANGUAGE_SENTENCE, false) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_SENTENCE_DEFINITION, new ColumnRecord(DOMINANT_LANGUAGE_SENTENCE_DEFINITION, false) );
        columnRecordHashMap.put( CATEGORY_ID,                   new ColumnRecord(CATEGORY_ID, false) );
        columnRecordHashMap.put( CATEGORY_NAME,                 new ColumnRecord(CATEGORY_NAME, false) );
        columnRecordHashMap.put( CATEGORIES,                    new ColumnRecord(CATEGORIES, false) );
        columnRecordHashMap.put( CONTRIBUTER,                   new ColumnRecord(CONTRIBUTER, false) );
        columnRecordHashMap.put( ID,                            new ColumnRecord(ID, false) );
        columnRecordHashMap.put( FILENAME,                      new ColumnRecord(FILENAME, false) );
        columnRecordHashMap.put( DESCR,                         new ColumnRecord(DESCR, false) );
        columnRecordHashMap.put( SHARED,                        new ColumnRecord(SHARED, false) );
        columnRecordHashMap.put( RECORDER,                      new ColumnRecord(RECORDER, false) );
        columnRecordHashMap.put( USER_ID,                       new ColumnRecord(USER_ID, false) );
        columnRecordHashMap.put( CONTRIBUTOR,                   new ColumnRecord(CONTRIBUTOR, false) );
        columnRecordHashMap.put( SOURCE,                        new ColumnRecord(SOURCE, false) );
        columnRecordHashMap.put( STATUS,                        new ColumnRecord(STATUS, false) );
        columnRecordHashMap.put( TITLE,                         new ColumnRecord(TITLE, false) );
        columnRecordHashMap.put( CODE,                          new ColumnRecord(CODE, false) );
        columnRecordHashMap.put( USERNAME,                      new ColumnRecord(USERNAME, false) );
        columnRecordHashMap.put( PHRASE,                        new ColumnRecord(PHRASE, false) );
        columnRecordHashMap.put( PHRASE_ID,                     new ColumnRecord(PHRASE_ID, false) );
        columnRecordHashMap.put( PHRASE_STATUS,                 new ColumnRecord(PHRASE_STATUS, false) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_PHRASE,      new ColumnRecord(DOMINANT_LANGUAGE_PHRASE, false) );
    }
}