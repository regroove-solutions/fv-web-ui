package ca.firstvoices.utils;

import java.util.Iterator;
import java.util.List;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.LifeCycleConstants;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.core.schema.FacetNames;

public class FVLoginUtils {

    public static DocumentModelList getDialectsForUser(NuxeoPrincipal currentUser, CoreSession session) {
        DocumentModelList dialects = null;
        List<String> groups = currentUser.getGroups();

        if (groups != null && groups.size() >= 1) {
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
                    + " AND ecm:acl/*/principal IN " + inClause + " " + " AND ecm:isProxy = 0 ";

            dialects = session.query(query);
        }

        if (dialects == null) {
            dialects = new DocumentModelListImpl();
        }

        return dialects;
    }
}
