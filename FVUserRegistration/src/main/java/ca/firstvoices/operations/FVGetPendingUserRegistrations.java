package ca.firstvoices.operations;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;

@Operation(id = FVGetPendingUserRegistrations.ID, category = Constants.CAT_USERS_GROUPS, label = "Get user registrations.",
        description = "Get registrations for specific dialect or when input is ALL (*) for the system. \n prune action can be 'ignore', 'approved' or 'accepted'\n.")
public class FVGetPendingUserRegistrations
{
    public static final String ID = "FVGetPendingUserRegistrations";
    private static final Log log = LogFactory.getLog(FVGetPendingUserRegistrations.class);

    public static final String IGNORE = "ignore";
    public static final String APPROVED = "approved";
    public static final String ACCEPTED = "accepted";

    @Context
    protected CoreSession session;

    @Param(name = "dialectID")
    protected String dialectID;

    @Param(name = "pruneAction", required = false, values = { APPROVED, ACCEPTED, IGNORE})
    protected String pruneAction = APPROVED;


    @OperationMethod
    public DocumentModelList run()
    {
        DocumentModelList registrations = null;

        try
        {
            // prune all items which are not part of the specific dialect
            if( !(dialectID.toLowerCase().equals("all") || dialectID.toLowerCase().equals("*")) )
            {
                registrations = session.query(String.format("Select * from Document where ecm:mixinType = 'UserRegistration' and %s = '%s'", "docinfo:documentId", dialectID));
            }
            else
            {
                registrations = session.query("Select * from Document where ecm:mixinType = 'UserRegistration'");
            }

            if( !registrations.isEmpty()) {
                registrations = pruneRegistrationList(registrations, pruneAction);
            }
        } catch (Exception e) {
            log.warn(e);
        }

        return registrations;
    }


    private DocumentModelList pruneRegistrationList( DocumentModelList registrations, String pruneAction )
    {
        if( !pruneAction.equals(IGNORE))
        {
            DocumentModelList prunned = new DocumentModelListImpl();

            for (DocumentModel uReg : registrations)
            {
                if (pruneAction.equals(APPROVED) && uReg.getCurrentLifeCycleState().equals(APPROVED))
                    prunned.add(uReg);
                else if (pruneAction.equals(ACCEPTED) && uReg.getCurrentLifeCycleState().equals(ACCEPTED))
                    prunned.add(uReg);
            }

            if( prunned.isEmpty() ) registrations.clear();
            else registrations = prunned;
        }

        return registrations;
    }
}
