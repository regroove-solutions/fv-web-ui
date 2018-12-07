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

import static org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;



public class FVRegistrationUtilities
{
    private static final Log log = LogFactory.getLog(FVRegistrationUtilities.class);

    public static final String APPEND = "append";
    public static final String UPDATE = "update";
    public static final String REMOVE = "remove";

    private DocumentRegistrationInfo    docInfo;
    private FVUserRegistrationInfo      userInfo;
    private String                      requestedSpaceId;
    private String                      dialectTitle;
    private UnrestrictedGroupResolver   ugdr;
    private DocumentModel               dialect;
    private UserManager                 userManager;
    private CoreSession                 session;
    private AutomationService           autoService;
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

    public static ArrayList<String> makeArrayFromStringList( StringList sl)
    {
        if( sl == null ) return null;

        ArrayList<String> al = new ArrayList<>();
        for( String s : sl )
        {
            al.add( s );
        }

        return al;
    }

    public static void updateFVProperty( String action, DocumentModel doc, StringList data, String schemaName, String field )
    {
        ArrayList<String> arrayData = FVRegistrationUtilities.makeArrayFromStringList( data );

        if( !action.equals(UPDATE) )
        {
            ArrayList<String> pA =  (ArrayList<String>)doc.getProperty(schemaName, field);

            for (String g : arrayData) {
                switch (action) {
                    case APPEND:
                        pA.add(g);
                        break;
                    case REMOVE:
                        pA.remove(g);
                        break;
                }
            }

            arrayData = pA;
        }

        doc.setProperty(schemaName, field, arrayData);
    }

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

    public void preCondition(DocumentModel registrationRequest, CoreSession s, UserManager uM, AutomationService as )
    {
        session = s;
        userManager = uM;
        autoService = as;

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

    public boolean QuickUserRegistrationCondition( DocumentModel registrationRequest, CoreSession session, boolean autoAccept )
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

        return true;
    }

    private void notificationEmailsAndReminderTasks( OperationContext ctx )  throws Exception
    {
        Map<String,String> options = new HashMap<>();
        options.put("fName", userInfo.getFirstName());
        options.put("lName", userInfo.getLastName());
        options.put("email", userInfo.getEmail());
        options.put("dialect", dialectTitle);

        ctx.setInput(dialect);
        String adminTO = mailUtil.getLanguageAdministratorEmail( dialect );
        mailUtil.registrationAdminMailSender(FVRegistrationConstants.NEW_USER_SELF_REGISTRATION, options, adminTO );
     }

    public void quickRegistrationFinal(  OperationContext ctx )
    {
        try
        {
            // send email to Administrator
            // send email to LanguageAdministrator
            notificationEmailsAndReminderTasks( ctx );
        }
        catch(Exception e)
        {
            log.warn( e );
        }
    }

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
        // If not authorized, never autoaccept
        else {
            autoAccept = false;
        }

        return autoAccept;
    }

    public String postCondition( UserRegistrationService  registrationService,
                                 DocumentModel            registrationRequest,
                                 Map<String, Serializable> info,
                                 String                   comment,
                                 ValidationMethod         validationMethod,
                                 boolean                  autoAccept )
    {
        String firstName = (String) registrationRequest.getPropertyValue("userinfo:firstName");
        String lastName = (String) registrationRequest.getPropertyValue("userinfo:lastName");
        String email = (String) registrationRequest.getPropertyValue("userinfo:email");

        userInfo.setEmail(email);
        userInfo.setFirstName(firstName);
        userInfo.setLastName(lastName);
        userInfo.setRequestedSpace(requestedSpaceId);

        // Additional information from registration
        info.put("fvuserinfo:requestedSpaceId", dialect.getId());
        info.put("registration:comment", comment);
        info.put("dc:title", firstName + " " + lastName + " Wants to Join " + dialectTitle);

        // Set permissions on registration document
        LoginContext lctx = null;
        CoreSession s = null;
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
        }
        finally
        {
            s.close();
        }

        return registrationId;
    }

    protected static class UnrestrictedSourceDocumentResolver extends UnrestrictedSessionRunner {

        private final CoreSession session;
        private final String docid;

        public DocumentModel dialect;

        protected UnrestrictedSourceDocumentResolver(CoreSession session, String docId ) {
            super(session);
            this.session = session;
            docid = docId;
        }

        @Override
        public void run() {
            // Get requested space (dialect)
            dialect = session.getDocument(new IdRef(docid));

            if (dialect.isProxy()) {
                dialect = session.getSourceDocument(dialect.getRef());

                if (dialect.isVersion()) {
                    dialect = session.getSourceDocument(dialect.getRef());
                }
            }
        }
    }

    protected static class UnrestrictedGroupResolver extends UnrestrictedSessionRunner {

        private final CoreSession session;
        private DocumentModel dialect;

        public ArrayList<String> member_groups = new ArrayList<String>();
        public String language_admin_group;

        protected UnrestrictedGroupResolver(CoreSession session, DocumentModel dialect) {
            super(session);
            this.session = session;
            this.dialect = dialect;
        }

        @Override
        public void run() {

            // Add user to relevant group
            for (ACE ace : dialect.getACP().getACL(ACL.LOCAL_ACL).getACEs()){

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

    public void registrationValidationHandler( DocumentModel ureg )
    {
        CoreSession s = null;
        AutomationService automationService = Framework.getService(AutomationService.class);
        OperationContext ctx = new OperationContext();

        try
        {
            String newUserGroup = (String) ureg.getPropertyValue("docinfo:documentTitle") + "_members";
            String username = (String) ureg.getPropertyValue("userinfo:login");

            Map<String, Object> params = new HashMap<>();
            params.put("groupname", "members");
            params.put("members", username );
            params.put("membersAction", REMOVE );

            automationService.run(ctx, "FVUpdateGroup", params);

            ctx = new OperationContext(); // do I need to do it?
            params.clear();
            params.put("username", username);
            params.put("groups", newUserGroup);
            params.put("groupsAction", UPDATE);
            automationService.run(ctx, "FVUpdateUser", params);


        }
        catch( Exception e )
        {
            log.warn( e );
        }
        finally
        {
        }

    }
}
