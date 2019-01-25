package ca.firstvoices.utils;

import java.util.Arrays;
import java.util.List;

public class FVExportWordProperties
{
    public static List<String> wordProperties;

    public FVExportWordProperties()
    {
        wordProperties = Arrays.asList(
                LANGUAGE, TRANSLATION, TITLE, DESCR, CULTURAL_NOTE, PART_OF_SPEECH_ID, PHONETIC_INFO,
                ASSIGNED_USR_ID, CHANGE_DTTM, IMPORT_ID, STATUS_ID, REFERENCE, AVAILABLE_IN_CHILDRENS_ARCHIVE,
                AVAILABLE_IN_GAMES, CHILD_FOCUSED, DEFINITION, RELATED_PHRASES, WORD_CATEGORIES, CONTRIBUTER,
                MEDIA_SHARED, MEDIA_RECORDER, MEDIA_SOURCE, MEDIA_STATUS, RELATED_VIDEOS, RELATED_AUDIO,
                RELATED_PICTURES, CREATOR, CONTRIBUTORS );
    }

    public List<String> getWordProperties()
    {
        return wordProperties;
    }

    public static final String LANGUAGE = "language";
    public static final String TRANSLATION = "fv:literal_translation";
    public static final String TITLE = "dc:title";
    public static final String DESCR = "dc:description";
    public static final String CULTURAL_NOTE = "fv:cultural_note";
    public static final String PART_OF_SPEECH_ID = "fv-word:part_of_speech";
    public static final String PHONETIC_INFO = "fv-word:pronunciation";
    public static final String ASSIGNED_USR_ID = "fvl:assigned_usr_id";
    public static final String CHANGE_DTTM = "fvl:change_date";
    public static final String IMPORT_ID = "fvl:import_id";
    public static final String STATUS_ID = "fvl:status_id";
    public static final String REFERENCE = "fv:reference";
    public static final String AVAILABLE_IN_CHILDRENS_ARCHIVE = "fv:available_in_childrens_archive";
    public static final String AVAILABLE_IN_GAMES = "fv-word:available_in_games";
    public static final String CHILD_FOCUSED = "fv:child_focused";
    public static final String DEFINITION = "fv:definitions";
    public static final String RELATED_PHRASES = "fv-word:related_phrases";
    public static final String WORD_CATEGORIES = "fv-word:categories";
    public static final String CONTRIBUTER = "fv:source";
    public static final String MEDIA_SHARED = "fvm:shared";
    public static final String MEDIA_RECORDER = "fvm:recorder";
    public static final String MEDIA_SOURCE = "fvm:source";
    public static final String MEDIA_STATUS = "fvl:status_id";
    public static final String RELATED_VIDEOS = "fv:related_videos";
    public static final String RELATED_AUDIO = "fv:related_audio";
    public static final String RELATED_PICTURES = "fv:related_pictures";
    //--
    public static final String CREATOR = "dc:creator";
    public static final String CONTRIBUTORS = "dc:contributors";
    //--
    public static final String PHRASE_BOOKS = "fv-phrase:phrase_books";
}
