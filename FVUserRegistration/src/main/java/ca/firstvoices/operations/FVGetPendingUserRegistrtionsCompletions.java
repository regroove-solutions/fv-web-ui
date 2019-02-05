package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

@Operation(id = FVGetPendingUserRegistrtionsCompletions.ID, category = Constants.CAT_USERS_GROUPS, label = "Get registrations which are not completed.",
        description = "")
public class FVGetPendingUserRegistrtionsCompletions {
    public static final String ID = "User.FVGetPendingRegistrationCompletions";

    @Context
    protected CoreSession session;

    @OperationMethod
    public void run() {

    }
}
