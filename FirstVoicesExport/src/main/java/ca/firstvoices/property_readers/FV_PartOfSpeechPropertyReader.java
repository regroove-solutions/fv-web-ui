package ca.firstvoices.property_readers;

import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PartOfSpeechPropertyReader extends FV_AbstractPropertyReader
{

    public FV_PartOfSpeechPropertyReader( String ptr, String cnfo )
    {
        super( ptr, cnfo );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_PropertyValueWithColumnName> readValues = new ArrayList<>();

        readValues.add( new FV_PropertyValueWithColumnName("", columnNameForOutput ));

        return readValues;
    }
}

//        propertyReaders.add(new PropertyReader(Properties.TITLE, Columns.WORD_VALUE));
//        propertyReaders.add(new PartOfSpeechPropertyReader(Properties.PART_OF_SPEECH_ID, Columns.PART_OF_SPEECH));
//        propertyReaders.add(new SimpleListPropertyReader(Properties.CULTURAL_NOTE, culturalNoteCols));
//        propertyReaders.add(new PropertyReader(Properties.PHONETIC_INFO, Columns.PHONETIC_INFO));
//        propertyReaders.add(new PropertyReader(Properties.ASSIGNED_USR_ID, Columns.ASSIGNED_USR_ID));
//        propertyReaders.add(new PropertyReader(Properties.CHANGE_DTTM, Columns.CHANGE_DTTM));
//        propertyReaders.add(new PropertyReader(Properties.IMPORT_ID, Columns.WORD_ID));
//        propertyReaders.add(new PropertyReader(Properties.REFERENCE, Columns.REFERENCE));
//        propertyReaders.add(new PropertyReader(Properties.AVAILABLE_IN_CHILDRENS_ARCHIVE, Columns.AVAILABLE_IN_CHILDRENS_ARCHIVE));
//        propertyReaders.add(new PropertyReader(Properties.AVAILABLE_IN_GAMES, Columns.AVAILABLE_IN_GAMES));
//        //propertyReaders.add(new PropertyReader(Properties.STATUS_ID, Columns.WORD_STATUS));
