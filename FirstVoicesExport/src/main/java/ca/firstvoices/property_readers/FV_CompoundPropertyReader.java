package ca.firstvoices.property_readers;

import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;

import java.util.ArrayList;
import java.util.List;

public class FV_CompoundPropertyReader extends FV_AbstractPropertyReader
{

    public FV_CompoundPropertyReader(String ptr, String cnfo, Integer mc )
    {
        super( ptr, cnfo, mc );
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o)
    {
        return null;
    }
}
