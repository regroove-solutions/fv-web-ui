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

import java.util.Calendar;


import static ca.firstvoices.utils.FVRegistrationUtilities.calculateRegistrationAgeInDays;

@Operation(id = FVGetPendingUserRegistrations.ID, category = Constants.CAT_USERS_GROUPS, label = "Get user registrations.",
        description = "Get registrations for specific dialect or when input is ALL for the system.")
public class FVGetPendingUserRegistrations
{
    public static final String ID = "FVGetPendingUserRegistrations";
    private static final Log log = LogFactory.getLog(FVGetPendingUserRegistrations.class);

    @Context
    protected CoreSession session;

    @Param(name = "dialectID", required = true)
    protected String dialectID;


    @OperationMethod
    public DocumentModelList run()
    {
        DocumentModelList registrations = null;
        DocumentModelList prunned = new DocumentModelListImpl();

        try
        {
            registrations = session.query("Select * from Document where ecm:mixinType = 'UserRegistration'");

            // prune all items which are not part of the specific dialect
            if( !(dialectID.toLowerCase().equals("all") || dialectID.toLowerCase().equals("*")) )
            {
                for (DocumentModel uReg : registrations)
                {
                    Calendar regCreated = (Calendar) uReg.getPropertyValue("dc:created");

                    if( uReg.getPropertyValue("docinfo:documentId").equals(dialectID))
                    {
                        long age = calculateRegistrationAgeInDays( regCreated );
                        prunned.add( uReg );
                    }
                }

                if( prunned.isEmpty() ) registrations.clear();
                else registrations = prunned;
            }

        } catch (Exception e) {
            log.warn(e);
        }

        return registrations;
    }
}
