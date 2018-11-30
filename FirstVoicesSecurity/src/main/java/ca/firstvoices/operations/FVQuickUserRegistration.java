package ca.firstvoices.operations;


import ca.firstvoices.utils.FVRegistrationUtilities;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import static org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;

@Operation(id = FVQuickUserRegistration.ID, category = Constants.CAT_USERS_GROUPS, label = "Guest self registration",
        description = "Starts guest registration.")
public class FVQuickUserRegistration {

    public static final String ID = "User.SelfRegistration";

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

    @Param(name ="docInfo", required = false)
    protected DocumentRegistrationInfo docInfo = null;

    @Param(name = "validationMethod", required = false)
    protected ValidationMethod validationMethod = ValidationMethod.EMAIL;

    @Param(name = "autoAccept", required = false)
    protected boolean autoAccept = false;

    @Param(name = "info", required = false)
    protected Map<String, Serializable> info = new HashMap<>();

    @Param(name = "comment", required = false)
    protected String comment;

    @Context
    protected CoreSession session;

    @OperationMethod
    public String run( DocumentModel registrationRequest )
    {
        FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();

        utilCommon.preCondition( registrationRequest, session );

        autoAccept = utilCommon.QuickUserRegistrationCondition( registrationRequest, session, autoAccept );

        String registrationId = utilCommon.postCondition( registrationService,
                                                            session,
                                                            registrationRequest,
                                                            info,
                                                            comment,
                                                            validationMethod,
                                                            autoAccept );
        // send email to Administrator
        // send email to LanguageAdministrator
        // register tasks for registration reminder worker
        utilCommon.notificationEmailsAndReminderTasks();

        return registrationId;
    }

}
