/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.operations;


import ca.firstvoices.utils.FVRegistrationUtilities;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
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
    private static final Log log = LogFactory.getLog(FVQuickUserRegistration.class);

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

    @Context
    protected AutomationService autoService;

    @Context
    protected OperationContext ctx;

    @Context
    protected CoreSession session;

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


    @OperationMethod
    public String run( DocumentModel registrationRequest ) throws Exception
    {
        FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();

        /*

            This operation has for most part similar code to sister operation UserInvite.
            The main difference is in conditions we apply for both.
            Common code is split into 2 parts
            - preCondition
            - postCondition
            Each of the operations executes it own, context specific conditions and any other operations
            following if appropriate.
            In this case it is sending of emails to both user and LanguageAdministrator informing them about actions.

         */
        utilCommon.preCondition( registrationRequest, session, userManager );

        autoAccept = utilCommon.QuickUserRegistrationCondition( registrationRequest, session, autoAccept );

        String registrationId = utilCommon.postCondition( registrationService,
                registrationRequest,
                info,
                comment,
                validationMethod,
                autoAccept );

        return registrationId;
    }

}
