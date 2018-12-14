/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.utils;

import ca.firstvoices.user.FVUserRegistrationInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserRegistrationException;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;
import org.nuxeo.runtime.api.Framework;

import javax.security.auth.login.LoginContext;
import java.io.Serializable;
import java.util.*;

import static ca.firstvoices.utils.FVRegistrationConstants.*;
import static org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;


public class FVRegistrationUtilities
{
    private static final Log log = LogFactory.getLog(FVRegistrationUtilities.class);

    private DocumentRegistrationInfo    docInfo;
    private FVUserRegistrationInfo      userInfo;
    private String                      requestedSpaceId;
    private String                      dialectTitle;
    private UnrestrictedGroupResolver   ugdr;
    private DocumentModel               dialect;
    private UserManager                 userManager;
    private CoreSession                 session;
    private FVRegistrationMailUtilities mailUtil = new FVRegistrationMailUtilities();

    public DocumentModel getDialect()
    {
        return dialect;
    }
    public String getDialectTitle()
    {
        return dialectTitle;
    }
    public FVUserRegistrationInfo getUserInfo()
    {
        return userInfo;
    }
    public DocumentRegistrationInfo getDocInfo()
    {
        return docInfo;
    }

    /**
     * @param sl
     * @return
     */
    public static ArrayList<String> makeArrayFromStringList( StringList sl)
    {
        if( sl == null ) return null;

        ArrayList<String> al = new ArrayList<>();
        for( String s : sl )
            al.add(s);

        return al;
    }

    /**
     * @param dateRegistered
     * @return
     */
    public static long calculateRegistrationAgeInDays(Calendar dateRegistered )
    {
        //
        // 			long diffSeconds = diff / 1000 % 60;
        //			long diffMinutes = diff / (60 * 1000) % 60;
        //			long diffHours = diff / (60 * 60 * 1000) % 24;
        //			long diffDays = diff / (24 * 60 * 60 * 1000);
        // total minutes between periods
        // long diffMinutes = timeDiff / (60 * 1000) % 60 + 60*(( timeDiff / (60 * 60 * 1000) % 24) + (timeDiff / (24 * 60 * 60 * 1000)) * 24)
        // minutes are used for testing ONLY

        long timeDiff = Calendar.getInstance().getTimeInMillis() - dateRegistered.getTimeInMillis();
        long diffDays = timeDiff / (24 * 60 * 60 * 1000);

        return diffDays;
    }

    // provide hrs within the day since registration started
    public static long calculateRegistrationModHours( Calendar dateRegistered )
    {
        long timeDiff = Calendar.getInstance().getTimeInMillis() - dateRegistered.getTimeInMillis();
        long diffHours = (timeDiff / (60 * 60 * 1000)) % 24;
        return diffHours;
    }

    /**
     * @param registrationRequest
     * @param s
     * @param uM
     */
    public void preCondition(DocumentModel registrationRequest, CoreSession s, UserManager uM )
    {
        session = s;
        userManager = uM;

        requestedSpaceId = (String) registrationRequest.getPropertyValue("fvuserinfo:requestedSpace");
        userInfo = new FVUserRegistrationInfo();

        // Source lookup (unrestricted)
        UnrestrictedSourceDocumentResolver usdr = new UnrestrictedSourceDocumentResolver(session, requestedSpaceId);
        usdr.runUnrestricted();

        // Source document
        dialect = usdr.dialect;
        registrationRequest.setPropertyValue("fvuserinfo:requestedSpace", dialect.getId());

        if (dialect.getCurrentLifeCycleState().equals("disabled")) {
            throw new UserRegistrationException("Cannot request to join a disabled dialect.");
        }

        dialectTitle = (String) dialect.getPropertyValue("dc:title");

        docInfo = new DocumentRegistrationInfo();
        docInfo.setDocumentId(dialect.getId());
        docInfo.setDocumentTitle(dialectTitle);
    }

    /**
     * @param registrationRequest
     * @param session
     * @return
     */
    public void QuickUserRegistrationCondition( DocumentModel registrationRequest, CoreSession session )
    {
        ugdr = new UnrestrictedGroupResolver(session, dialect);
        ugdr.runUnrestricted();

        ArrayList<String> preSetGroup;
        NuxeoGroup memberGroup = userManager.getGroup("members");

        if( memberGroup != null )
        {
            preSetGroup = new ArrayList();
            preSetGroup.add("members");
            userInfo.setGroups(preSetGroup);
        }
        else {
            if (!ugdr.member_groups.isEmpty()) {
                userInfo.setGroups(ugdr.member_groups);

                preSetGroup = (ArrayList<String>) registrationRequest.getPropertyValue("userinfo:groups");

                if (!preSetGroup.isEmpty()) {
                    userInfo.setGroups(preSetGroup);
                }
            }
        }
    }

    /**
     * @throws Exception
     */
    private void notificationEmailsAndReminderTasks( DocumentModel dialect, DocumentModel ureg)  throws Exception
    {
        Map<String,String> options = new HashMap<>();
        options.put("fName", (String) ureg.getPropertyValue("userinfo:firstName"));
        options.put("lName", (String) ureg.getPropertyValue("userinfo:lastName"));
        options.put("email", (String) ureg.getPropertyValue("userinfo:email"));
        options.put("dialect", dialect.getTitle() );

        String adminTO = mailUtil.getLanguageAdministratorEmail( dialect );
        mailUtil.registrationAdminMailSender(NEW_USER_SELF_REGISTRATION_ACT, options, adminTO );
     }

    /**
     * @param registrationRequest
     * @param session
     * @param autoAccept
     * @return
     */
    public boolean UserInviteCondition( DocumentModel registrationRequest, CoreSession session, boolean autoAccept )
    {
        NuxeoPrincipal currentUser = (NuxeoPrincipal) session.getPrincipal();

        ugdr = new UnrestrictedGroupResolver(session, dialect);
        ugdr.runUnrestricted();

        // If no group found (somehow), add Read permission directly.
        if (!ugdr.member_groups.isEmpty()) {
            userInfo.setGroups(ugdr.member_groups);
        } else {
            docInfo.setPermission("Read");
        }

        // If authorized, use preset groups
        if (currentUser.isAdministrator() || currentUser.isMemberOf(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
            autoAccept = true;

            @SuppressWarnings("unchecked")
            List<String> preSetGroup = (List<String>) registrationRequest.getPropertyValue("userinfo:groups");

            if (!preSetGroup.isEmpty()) {
                userInfo.setGroups(preSetGroup);
            }
        }
        // If not authorized, never autoAccept
        else {
            autoAccept = false;
        }

        return autoAccept;
    }

    /**
     * @param registrationService
     * @param registrationRequest
     * @param info
     * @param comment
     * @param validationMethod
     * @param autoAccept
     * @return
     */
    public String postCondition( UserRegistrationService  registrationService,
                                 DocumentModel            registrationRequest,
                                 Map<String, Serializable> info,
                                 String                   comment,
                                 ValidationMethod         validationMethod,
                                 boolean                  autoAccept ) throws Exception
    {
        String firstName = (String) registrationRequest.getPropertyValue("userinfo:firstName");
        String lastName = (String) registrationRequest.getPropertyValue("userinfo:lastName");
        String email = (String) registrationRequest.getPropertyValue("userinfo:email");
        LoginContext lctx = null;
        CoreSession s = null;

        int validationStatus;

        try
        {
            AutomationService automationService = Framework.getService(AutomationService.class);
            OperationContext ctx = new OperationContext(session);
            Map<String, Object> params = new HashMap<>();
            params.put("Login:", email);
            params.put("email:", email);

            validationStatus = (int)automationService.run(ctx, "FVValidateRegistrationAttempt", params);
        }
        catch( Exception e)
        {
            log.warn("Exception while validating registration.");
            throw new UserRegistrationException( "Exception while invoking registration validation. " + e );
        }

        if( validationStatus != REGISTRATION_CAN_PROCEED )
        {
            switch ( validationStatus )
            {
                case EMAIL_EXISTS_ERROR:
                    throw new UserRegistrationException("Exception validation: Login the same as submitted email is present.");

                case LOGIN_EXISTS_ERROR:
                    throw new UserRegistrationException("Exception validation: Login name already present.");

                case LOGIN_AND_EMAIL_EXIST_ERROR:
                    throw new UserRegistrationException("Exception validation: Login name and email already present.");

                case REGISTRATION_EXISTS_ERROR:
                    throw new UserRegistrationException("Exception validation: Pending registration with the same credentials is present.");

            }
        }

        userInfo.setEmail(email);
        userInfo.setFirstName(firstName);
        userInfo.setLastName(lastName);
        userInfo.setRequestedSpace(requestedSpaceId);

        // Additional information from registration
        info.put("fvuserinfo:requestedSpaceId", dialect.getId());
        info.put("registration:comment", comment);
        info.put("dc:title", firstName + " " + lastName + " Wants to Join " + dialectTitle);

        // Set permissions on registration document
        String registrationId = null;

        try
        {
             registrationId = registrationService.submitRegistrationRequest(registrationService.getConfiguration(UserRegistrationService.CONFIGURATION_NAME).getName(),
                userInfo, docInfo, info,
                validationMethod, autoAccept, email);

            lctx = Framework.login();
            s = CoreInstance.openCoreSession("default");

            UnrestrictedRequestPermissionResolver urpr = new UnrestrictedRequestPermissionResolver(s, registrationId, ugdr.language_admin_group);
            urpr.runUnrestricted();

            lctx.logout();
         }
        catch( Exception e )
        {
            log.warn( e );
            throw e;
        }
        finally
        {
            if( s!= null ) s.close();

        }

        return registrationId;
    }

    protected static class UnrestrictedSourceDocumentResolver extends UnrestrictedSessionRunner {

        //private final CoreSession session;
        private final String docid;

        public DocumentModel dialect;

        protected UnrestrictedSourceDocumentResolver(CoreSession session, String docId ) {
            super(session);
            //this.session = session;
            docid = docId;
        }

        @Override
        public void run() {
            // Get requested space (dialect)
            dialect = session.getDocument(new IdRef(docid));

            if (dialect.isProxy()) {
                dialect = session.getSourceDocument(dialect.getRef());
            }
        }
    }

    protected static class UnrestrictedGroupResolver extends UnrestrictedSessionRunner {

        //private final CoreSession session;
        private DocumentModel dialect;

        private ArrayList<String> member_groups = new ArrayList<String>();
        private String language_admin_group;

        protected UnrestrictedGroupResolver(CoreSession session, DocumentModel dialect) {
            super(session);
            //this.session = session;
            this.dialect = dialect;
        }

        @Override
        public void run() {
            DocumentModel dialect1 = session.getDocument(new IdRef(dialect.getId()));
            // Add user to relevant group
            for (ACE ace : dialect1.getACP().getACL(ACL.LOCAL_ACL).getACEs()){

                String username = ace.getUsername();

                if (SecurityConstants.READ.equals(ace.getPermission())) {
                    if (username.contains("_members") && ace.isGranted()) {
                        member_groups.add(username);
                    }
                }

                if (SecurityConstants.EVERYTHING.equals(ace.getPermission()) && ace.isGranted()) {
                    if (username.contains(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
                        language_admin_group = username;
                    }
                }
            }
        }
    }

    protected static class UnrestrictedRequestPermissionResolver extends UnrestrictedSessionRunner {

        private final CoreSession session;
        private String registrationDocId;
        private String language_admin_group;

        protected UnrestrictedRequestPermissionResolver(CoreSession session, String registrationDocId, String language_admin_group) {
            super(session);
            this.session = session;
            this.registrationDocId = registrationDocId;
            this.language_admin_group = language_admin_group;
        }

        @Override
        public void run() {
            DocumentModel registrationDoc = session.getDocument(new IdRef(registrationDocId));

            ACE registrationACE = new ACE(language_admin_group, "Everything");

            ACP registrationDocACP = registrationDoc.getACP();
            registrationDocACP.addACE("local", registrationACE);
            registrationDoc.setACP(registrationDocACP, false);
        }
    }

    /**
     * @param ureg
     */
    public void registrationValidationHandler( DocumentModel ureg )
    {
        AutomationService automationService = Framework.getService(AutomationService.class);
        LoginContext lctx;

        try
        {
            //String newUserGroup = (String) ureg.getPropertyValue("docinfo:documentTitle") + "_members";

            lctx = Framework.login();
            session = CoreInstance.openCoreSession("default");

            userManager = Framework.getService(UserManager.class);

            dialect = session.getDocument( new IdRef((String) ureg.getPropertyValue("docinfo:documentId")));

            FVUserPreferencesSetup up = new FVUserPreferencesSetup();
            String username = (String) ureg.getPropertyValue("userinfo:login");
            DocumentModel userDoc = userManager.getUserModel( username );

            try
            {
                String defaultUserPrefs = up.createDefaultUserPreferencesWithRegistration( ureg );
                userDoc.setPropertyValue("user:preferences", defaultUserPrefs);
                session.saveDocument(userDoc);
             }
            catch ( Exception e)
            {
                log.warn("Exception while updating user preferences "+e );
            }

            //userManager.updateUser(userDoc);

            notificationEmailsAndReminderTasks( dialect, ureg );

            // TODO decide if we need to remove the registration document for created document at this point
            lctx.logout();
        }
        catch( Exception e )
        {
            log.warn( e );
        }
        finally
        {
            session.close();
        }
    }
}
