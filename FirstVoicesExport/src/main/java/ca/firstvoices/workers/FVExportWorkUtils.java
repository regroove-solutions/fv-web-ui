package ca.firstvoices.workers;

import ca.firstvoices.utils.FVExportConstants;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;


public class FVExportWorkUtils
{
    public static List<String> makeOutputLine(DocumentModel word, List columns)
    {
        List<String> strL = new ArrayList<>();

        for( Object col: columns )
        {

            Object wordProperty = word.getPropertyValue(col.toString());
            strL.add(wordProperty.toString());
        }

        return strL;
    }
}
