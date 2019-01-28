/**
 *
 */
package ca.firstvoices.utils;

import ca.firstvoices.property_readers.*;

import static ca.firstvoices.utils.FVExportConstants.ExportCSVLabels.*;

// headers for CSV file
public final class FV_WordExportCSVColumns extends FV_CSVExportColumns
{
    public FV_WordExportCSVColumns()
    {
        super();

        //                       IDENTIFIER from UI                                     COLUMN NAME                      PROPERTY                                                  READER TO CREATE
        columnRecordHashMap.put( TITLE,                         new ExportColumnRecord( WORD_VALUE,                      FVExportProperties.TITLE, true, 1,              FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE,             new ExportColumnRecord( DOMINANT_LANGUAGE,               FVExportProperties.LANGUAGE, true, 1,           FV_PropertyReader.class, null) );

        columnRecordHashMap.put( PART_OF_SPEECH_ID,             new ExportColumnRecord( PART_OF_SPEECH,                  FVExportProperties.PART_OF_SPEECH_ID, true, 1 , FV_PartOfSpeechPropertyReader.class, null ) );
        columnRecordHashMap.put( CULTURAL_NOTE,                 new ExportColumnRecord( CULTURAL_NOTE,                   FVExportProperties.CULTURAL_NOTE, true, 6,      FV_SimpleListPropertyReader.class, null ) );
        columnRecordHashMap.put( PHONETIC_INFO,                 new ExportColumnRecord( PHONETIC_INFO,                   FVExportProperties.PHONETIC_INFO ,true, 1,      FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( ASSIGNED_USR_ID,               new ExportColumnRecord( ASSIGNED_USR_ID,                 FVExportProperties.ASSIGNED_USR_ID, true, 1,    FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( CHANGE_DTTM,                   new ExportColumnRecord( CHANGE_DTTM,                     FVExportProperties.CHANGE_DTTM, true, 1,        FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( LITERAL_TRANSLATION,           new ExportColumnRecord( LITERAL_TRANSLATION,             FVExportProperties.TRANSLATION, true, 6,        FV_WordTranslationReader.class, null ) );
        columnRecordHashMap.put( DOMINANT_LANGUAGE_DEFINITION,  new ExportColumnRecord( DOMINANT_LANGUAGE_DEFINITION,    FVExportProperties.DEFINITION, true, 6,         FV_WordTranslationReader.class, null ) );
        columnRecordHashMap.put( AVAILABLE_IN_GAMES,            new ExportColumnRecord( AVAILABLE_IN_GAMES,              FVExportProperties.AVAILABLE_IN_GAMES, true, 1, FV_BooleanPropertyReader.class, null ) );
        columnRecordHashMap.put( AVAILABLE_IN_CHILDRENS_ARCHIVE, new ExportColumnRecord( AVAILABLE_IN_CHILDRENS_ARCHIVE, FVExportProperties.AVAILABLE_IN_CHILDRENS_ARCHIVE, true, 1, FV_BooleanPropertyReader.class, null ) );
        columnRecordHashMap.put( REFERENCE,                     new ExportColumnRecord( REFERENCE,                       FVExportProperties.REFERENCE, true, 1,          FV_PropertyReader.class, null) );
        columnRecordHashMap.put( CATEGORIES,                    new ExportColumnRecord( CATEGORIES,                      FVExportProperties.WORD_CATEGORIES, true,1 ,    FV_CategoryPropertyReader.class, null ) );
        columnRecordHashMap.put( CHILD_FOCUSED,                 new ExportColumnRecord( CHILD_FOCUSED,                   FVExportProperties.CHILD_FOCUSED, true, 1,      FV_BooleanPropertyReader.class, null ) );

        columnRecordHashMap.put( REALTED_PHRASE,                new ExportColumnRecord( PHRASE_COLUMN,                   FVExportProperties.RELATED_PHRASES, true, 6,    FV_CategoryPropertyReader.class, null ) );

        columnRecordHashMap.put( WORD_STATUS,                   new ExportColumnRecord( WORD_STATUS,                     FVExportProperties.STATUS_ID, true, 1,          FV_PropertyReader.class, null ) );
        columnRecordHashMap.put( CONTRIBUTOR,                   new ExportColumnRecord( CONTRIBUTOR,                     FVExportProperties.CONTRIBUTORS, true, 1,       FV_SimpleListPropertyReader.class, null ) );

        // COMPOUND READERS
        columnRecordHashMap.put( IMAGE,                         new ExportColumnRecord( IMAGE,                           FVExportProperties.IMAGE_COMPUND, true, 0,      FV_CompoundPropertyReader.class, FVExportProperties.imgCompoundA ) );
        columnRecordHashMap.put( AUDIO,                         new ExportColumnRecord( AUDIO,                           FVExportProperties.AUDIO_COMPUND, true, 0,      FV_CompoundPropertyReader.class, FVExportProperties.audioCompoundA ) );
        columnRecordHashMap.put( VIDEO,                         new ExportColumnRecord( VIDEO,                           FVExportProperties.VIDEO_COMPUND, true, 0,      FV_CompoundPropertyReader.class, FVExportProperties.videoCompoundA ) );

        // AUDIO COMPOUND
        columnRecordHashMap.put( AUDIO_TITLE,                   new ExportColumnRecord( AUDIO_TITLE,                     FVExportProperties.TITLE, false, 1,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_FILENAME,                new ExportColumnRecord( AUDIO_FILENAME,                  FVExportProperties.MEDIA_FILENAME, false, 1,       FV_PropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_DESCRIPTION,             new ExportColumnRecord( AUDIO_DESCRIPTION,               FVExportProperties.DESCR, false, 1,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_SHARED_WITH_OTHER_DIALECTS,  new ExportColumnRecord( AUDIO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1,    FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_SOURCE,                  new ExportColumnRecord( AUDIO_SOURCE,                    FVExportProperties.MEDIA_SOURCE, false, 2,         FV_SimpleListPropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_CHILD_FOCUSED,           new ExportColumnRecord( AUDIO_CHILD_FOCUSED,             FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,  FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( AUDIO_RECORDER,                new ExportColumnRecord( AUDIO_RECORDER,                  FVExportProperties.MEDIA_RECORDER, false, 2,       FV_SimpleListPropertyReader.class, null) );

        // IMAGE COMPOUND
        columnRecordHashMap.put( IMG_TITLE,                   new ExportColumnRecord( IMG_TITLE,                        FVExportProperties.TITLE, false, 1,                 FV_PropertyReader.class, null) );
        columnRecordHashMap.put( IMG_FILENAME,                new ExportColumnRecord( IMG_FILENAME,                     FVExportProperties.MEDIA_FILENAME, false, 1,        FV_PropertyReader.class, null) );
        columnRecordHashMap.put( IMG_DESCRIPTION,             new ExportColumnRecord( IMG_DESCRIPTION,                  FVExportProperties.DESCR, false, 1,                 FV_PropertyReader.class, null) );
        columnRecordHashMap.put( IMG_SHARED_WITH_OTHER_DIALECTS,  new ExportColumnRecord( IMG_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1,        FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( IMG_SOURCE,                  new ExportColumnRecord( IMG_SOURCE,                       FVExportProperties.MEDIA_SOURCE, false, 2,          FV_SimpleListPropertyReader.class, null) );
        columnRecordHashMap.put( IMG_CHILD_FOCUSED,           new ExportColumnRecord( IMG_CHILD_FOCUSED,                FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,   FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( IMG_RECORDER,                new ExportColumnRecord( IMG_RECORDER,                     FVExportProperties.MEDIA_RECORDER, false, 2,        FV_SimpleListPropertyReader.class, null) );

        // VIDEO COMPOUND
        columnRecordHashMap.put( VIDEO_TITLE,                   new ExportColumnRecord( VIDEO_TITLE,                     FVExportProperties.TITLE, false, 1,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_FILENAME,                new ExportColumnRecord( VIDEO_FILENAME,                  FVExportProperties.MEDIA_FILENAME, false, 1,       FV_PropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_DESCRIPTION,             new ExportColumnRecord( AUDIO_DESCRIPTION,               FVExportProperties.DESCR, false, 0,                FV_PropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_SHARED_WITH_OTHER_DIALECTS,  new ExportColumnRecord( VIDEO_SHARED_WITH_OTHER_DIALECTS, FVExportProperties.MEDIA_SHARED, false, 1,    FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_SOURCE,                  new ExportColumnRecord( VIDEO_SOURCE,                    FVExportProperties.MEDIA_SOURCE, false, 2,         FV_SimpleListPropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_CHILD_FOCUSED,           new ExportColumnRecord( VIDEO_CHILD_FOCUSED,             FVExportProperties.MEDIA_CHILD_FOCUSED, false, 1,  FV_BooleanPropertyReader.class, null) );
        columnRecordHashMap.put( VIDEO_RECORDER,                new ExportColumnRecord( VIDEO_RECORDER,                  FVExportProperties.MEDIA_RECORDER, false, 2,       FV_SimpleListPropertyReader.class, null) );

        // not done
        columnRecordHashMap.put( CONTRIBUTER,                   new ExportColumnRecord( CONTRIBUTER,                    "?", false, 1,       null, null) );
        columnRecordHashMap.put( PHRASE_BOOKS_C,                new ExportColumnRecord( PHRASE_BOOKS_C,                  FVExportProperties.PHRASE_BOOKS, false, 1, null, null) );
        columnRecordHashMap.put( WORD_ID,                       new ExportColumnRecord( WORD_ID,                         "?", false, 0, null, null) );
        columnRecordHashMap.put( CATEGORY_ID,                   new ExportColumnRecord( CATEGORY_ID,                     "?", false, 0, null, null) );
        columnRecordHashMap.put( ID,                            new ExportColumnRecord( ID,                              "?", false, 0, null, null) );
        columnRecordHashMap.put( FILENAME,                      new ExportColumnRecord( FILENAME,                        "?", false, 0, null, null) );
        columnRecordHashMap.put( DESCR,                         new ExportColumnRecord( DESCR,                           "?", false, 0, null, null) );
        columnRecordHashMap.put( SHARED,                        new ExportColumnRecord( SHARED,                          "?", false, 0, null, null) );
        columnRecordHashMap.put( USER_ID,                       new ExportColumnRecord( USER_ID,                         "?", false, 0, null, null) );
        columnRecordHashMap.put( CODE,                          new ExportColumnRecord( CODE,                            "?", false, 0, null, null) );
        columnRecordHashMap.put( USERNAME,                      new ExportColumnRecord( USERNAME,                        "?", false, 0, null, null) );
     }
}