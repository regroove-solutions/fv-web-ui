/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.operations;


import ca.firstvoices.utils.FVRegistrationUtilities;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.ui.web.auth.NuxeoSecuredRequestWrapper;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.time.Year;
import java.util.Date;
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
    protected CoreSession session;

    @Context
    protected OperationContext operationContext;

    @Param(name ="docInfo", required = false)
    protected DocumentRegistrationInfo docInfo = null;

    @Param(name = "validationMethod", required = false)
    protected ValidationMethod validationMethod = ValidationMethod.EMAIL;

    @Param(name = "info", required = false)
    protected Map<String, Serializable> info = new HashMap<>();

    @Param(name = "comment", required = false)
    protected String comment;

    protected String bRange;

    @OperationMethod
    public String run( DocumentModel registrationRequest ) throws Exception
    {
        String ip = null;

        FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();

        // Extract additional information from request
        HttpServletRequest request = (HttpServletRequest) operationContext.get("request");

        // Client IP
        String ip1 = request.getHeader("Remote_Addr");
        String ip2 = request.getHeader("X-Forwarded-For");

        if (ip1 == null || ip1.isEmpty()) {
            ip = ip2;
        }

        // Referer
        String referer = request.getHeader("Referer");

        // User-agent
        String ua = request.getHeader("User-Agent");

        // Time created
        long created = System.currentTimeMillis();

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

        utilCommon.QuickUserRegistrationCondition( registrationRequest, session );

        String registrationId = utilCommon.postCondition( registrationService,
                registrationRequest,
                info,
                comment,
                validationMethod,
                true ); // we always autoAccept quick registration

        return registrationId;
    }

}
