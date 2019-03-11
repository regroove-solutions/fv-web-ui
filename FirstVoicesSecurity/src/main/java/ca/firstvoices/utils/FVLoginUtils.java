package ca.firstvoices.utils;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.schema.FacetNames;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class FVLoginUtils {

    public static DocumentModelList getDialectsForUser(NuxeoPrincipal currentUser, CoreSession session) {
        DocumentModelList dialects = null;
        List<String> groups = currentUser.getGroups();

        if (groups != null) {
            Iterator it = groups.iterator();
            String inClause = "(\"" + groups.get(0) + "\"";
            it.next();
            while (it.hasNext()) {
                inClause += ",\"" + it.next() + "\"";
            }
            inClause += ")";

            String query = "SELECT * FROM FVDialect WHERE " + NXQL.ECM_MIXINTYPE + " <> '"
                    + FacetNames.HIDDEN_IN_NAVIGATION + "' AND " + NXQL.ECM_LIFECYCLESTATE + " <> '"
                    + LifeCycleConstants.DELETED_STATE + "'" + " AND ecm:isCheckedInVersion = 0 "
                    + " AND ecm:acl/*/principal IN " + inClause + " "
                    + " AND ecm:isProxy = 0 ";

            dialects = session.query(query);
        }

        if( dialects == null )
        {
            dialects = (DocumentModelList)new ArrayList<DocumentModel>();
        }

        return dialects;
    }
}
