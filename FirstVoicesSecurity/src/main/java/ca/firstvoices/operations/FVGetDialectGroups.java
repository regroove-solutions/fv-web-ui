/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */

package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.platform.usermanager.UserManager;


@Operation(id = ca.firstvoices.operations.FVGetDialectGroups.ID, category = Constants.CAT_USERS_GROUPS, label = "Dialect Groups",
        description = "Returns all groups specific to the dialect.")
public class FVGetDialectGroups {


    public static final String ID = "Document.FVGetGroupsForDialect";


    @Context
    protected CoreSession session;


}
