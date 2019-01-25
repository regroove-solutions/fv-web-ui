/**
 *
 */
package ca.firstvoices.utils;

import ca.firstvoices.property_readers.*;

import java.util.HashMap;

import static ca.firstvoices.utils.FVExportConstants.ExportCSVLabels.*;
import static ca.firstvoices.utils.FVExportWordProperties.MEDIA_RECORDER;
import static ca.firstvoices.utils.FVExportWordProperties.MEDIA_STATUS;

/**
 * @author dyona
 *
 */

// headers for CSV file
public final class FV_WordExportCSVColumns
{

    public  HashMap<String, ColumnRecord > columnRecordHashMap;

    public final class ColumnRecord
    {
        public String      colID;          // column label as received from UI to identify property
        public String      property;       // property string to retrieve value
        public Boolean     useForExport;   // set to true if it is ready to be used for export
        public Integer     numCols;        // max number of columns we want to allow in csv
        public Class       requiredPropertyReader;

        ColumnRecord( String cID, String prop, Boolean ufe, Integer nc, Class rpr )
        {
            colID = cID;
            property = prop;
            useForExport = ufe;
            numCols = nc;
            requiredPropertyReader = rpr;
        }
    }

    public FV_WordExportCSVColumns()
    {
        columnRecordHashMap = new HashMap<>();

        columnRecordHashMap.put( TITLE,                         new ColumnRecord( WORD_VALUE,                      FVExportWordProperties.TITLE, true, 1, FV_PropertyReader.class ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE,             new ColumnRecord( DOMINANT_LANGUAGE,               FVExportWordProperties.LANGUAGE, true, 1, FV_PropertyReader.class) );

        columnRecordHashMap.put( PART_OF_SPEECH_ID,             new ColumnRecord( PART_OF_SPEECH,                  FVExportWordProperties.PART_OF_SPEECH_ID, true, 1 , FV_PartOfSpeechPropertyReader.class ) );
        columnRecordHashMap.put( CULTURAL_NOTE,                 new ColumnRecord( CULTURAL_NOTE,                   FVExportWordProperties.CULTURAL_NOTE, true, 6,      FV_SimpleListPropertyReader.class ) );
        columnRecordHashMap.put( PHONETIC_INFO,                 new ColumnRecord( PHONETIC_INFO,                   FVExportWordProperties.PHONETIC_INFO ,true, 1,      FV_PropertyReader.class ) );
        columnRecordHashMap.put( ASSIGNED_USR_ID,               new ColumnRecord( ASSIGNED_USR_ID,                 FVExportWordProperties.ASSIGNED_USR_ID, true, 1,    FV_PropertyReader.class ) );
        columnRecordHashMap.put( CHANGE_DTTM,                   new ColumnRecord( CHANGE_DTTM,                     FVExportWordProperties.CHANGE_DTTM, true, 1,        FV_PropertyReader.class ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_WORD_VALUE,  new ColumnRecord( DOMINANT_LANGUAGE_WORD_VALUE,    FVExportWordProperties.TRANSLATION, true, 6,        FV_WordTranslationReader.class ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_DEFINITION,  new ColumnRecord( DOMINANT_LANGUAGE_DEFINITION,    FVExportWordProperties.DEFINITION, true, 6,         FV_WordTranslationReader.class ) );
        columnRecordHashMap.put( AVAILABLE_IN_GAMES,            new ColumnRecord( AVAILABLE_IN_GAMES,              FVExportWordProperties.AVAILABLE_IN_GAMES, true, 1, FV_BooleanPropertyReader.class ) );
        columnRecordHashMap.put( AVAILABLE_IN_CHILDRENS_ARCHIVE, new ColumnRecord( AVAILABLE_IN_CHILDRENS_ARCHIVE, FVExportWordProperties.AVAILABLE_IN_CHILDRENS_ARCHIVE, true, 1, FV_BooleanPropertyReader.class ) );
        columnRecordHashMap.put( REFERENCE,                     new ColumnRecord( REFERENCE,                       FVExportWordProperties.REFERENCE, true, 1,          FV_PropertyReader.class) );
        columnRecordHashMap.put( CATEGORIES,                    new ColumnRecord( CATEGORIES,                      FVExportWordProperties.WORD_CATEGORIES, true,1 ,    FV_CategoryPropertReader.class ) );
        columnRecordHashMap.put( CHILD_FOCUSED,                 new ColumnRecord( CHILD_FOCUSED,                   FVExportWordProperties.CHILD_FOCUSED, true, 1,      FV_BooleanPropertyReader.class ) );

        columnRecordHashMap.put( DOMINANT_LANGUAGE_SENTENCE,    new ColumnRecord( PHRASE_COLUMN,                   FVExportWordProperties.RELATED_PHRASES, true, 6,    FV_CategoryPropertReader.class ) );

        columnRecordHashMap.put( WORD_STATUS,                   new ColumnRecord( WORD_STATUS,                     FVExportWordProperties.STATUS_ID, true, 1,          FV_PropertyReader.class ) );
        columnRecordHashMap.put( CONTRIBUTOR,                   new ColumnRecord( CONTRIBUTOR,                     FVExportWordProperties.CONTRIBUTORS, true, 1,       FV_SimpleListPropertyReader.class ) );
        columnRecordHashMap.put( SOURCE,                        new ColumnRecord( SOURCE,                          FVExportWordProperties.MEDIA_SOURCE, true, 1,      null) );

        columnRecordHashMap.put( STATUS,                        new ColumnRecord( STATUS,                          MEDIA_STATUS, false, 1,      null) );
        columnRecordHashMap.put( RECORDER,                      new ColumnRecord( RECORDER,                        MEDIA_RECORDER, false, 1,    null) );
        columnRecordHashMap.put( CONTRIBUTER,                   new ColumnRecord( CONTRIBUTER,                     CONTRIBUTER, false, 1,       null) );


        columnRecordHashMap.put( PART_OF_SPEECH,                new ColumnRecord( PART_OF_SPEECH_ID,               "?", false, 0, null) );
        columnRecordHashMap.put( WORD_ID,                       new ColumnRecord( WORD_ID,                         "?", false, 0, null) );
        columnRecordHashMap.put( CATEGORY_ID,                   new ColumnRecord( CATEGORY_ID,                     "?", false, 0, null) );
        columnRecordHashMap.put( ID,                            new ColumnRecord( ID,                              "?", false, 0, null) );
        columnRecordHashMap.put( FILENAME,                      new ColumnRecord( FILENAME,                        "?", false, 0, null) );
        columnRecordHashMap.put( DESCR,                         new ColumnRecord( DESCR,                           "?", false, 0, null) );
        columnRecordHashMap.put( SHARED,                        new ColumnRecord( SHARED,                          "?", false, 0, null) );
        columnRecordHashMap.put( USER_ID,                       new ColumnRecord( USER_ID,                         "?", false, 0, null) );
        columnRecordHashMap.put( CODE,                          new ColumnRecord( CODE,                            "?", false, 0, null) );
        columnRecordHashMap.put( USERNAME,                      new ColumnRecord( USERNAME,                        "?", false, 0, null) );
        columnRecordHashMap.put( PHRASE,                        new ColumnRecord( PHRASE,                          "?", false, 0, null) );
        columnRecordHashMap.put( PHRASE_ID,                     new ColumnRecord( PHRASE_ID,                       "?", false, 0, null) );
        columnRecordHashMap.put( PHRASE_STATUS,                 new ColumnRecord( PHRASE_STATUS,                   "?", false, 0, null) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_PHRASE,      new ColumnRecord( DOMINANT_LANGUAGE_PHRASE,        "?", false, 0, null) );
    }
}