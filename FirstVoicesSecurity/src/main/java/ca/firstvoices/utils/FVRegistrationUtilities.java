/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.utils;

import ca.firstvoices.user.FVUserRegistrationInfo;
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

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.commons.lang.StringUtils;
import java.io.Serializable;
import java.util.*;

import static org.nuxeo.ecm.user.registration.UserRegistrationService.CONFIGURATION_NAME;
import static org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;


public class FVRegistrationUtilities
{
    private DocumentRegistrationInfo    docInfo;
    private FVUserRegistrationInfo      userInfo;
    private String                      requestedSpaceId;
    private String                      dialectTitle;
    private UnrestrictedGroupResolver   ugdr;
    private DocumentModel               dialect;
    private UserManager                 userManager;
    private CoreSession                 session;
    private AutomationService           autoService;

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

    private String getJavaMailJndiName() {
        return Framework.getProperty("jndi.java.mail", "java:/Mail");
    }

    private void generateMail( String destination,
                               String copy,
                               String title,
                               String content) throws Exception {

        InitialContext ic = new InitialContext();
        Session session = (Session) ic.lookup(getJavaMailJndiName());

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(session.getProperty("mail.from")));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse((String) destination, false));

        if (!StringUtils.isBlank(copy)) {
            msg.addRecipient(Message.RecipientType.CC, new InternetAddress( copy, false));
        }

        msg.setSubject(title, "UTF-8");
        msg.setSentDate(new Date());
        msg.setContent(content, "text/html; charset=utf-8");

        Transport.send(msg);
    }

    private String getLanguageAdministratorEmail( OperationContext ctx )
    {
        ctx.setInput(dialect);
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("permission", "Everything");
        params.put("variable name", "admin");
        params.put("prefix identifiers", "user:");
        params.put("resolve groups", true );

        try {
            DocumentModel doc = (DocumentModel) autoService.run(ctx, "Context.GetUsersGroupIdsWithPermissionOnDoc", params);
        } catch( Exception e) {
            // TODO log exception
        }

        String toStr = new String();

        Map<String, Object> val = (Map<String, Object>) ctx.getVars();

        if( val.containsKey("admin"))
        {
            StringList sL = (StringList)val.get("admin");

            for( String name : sL )
            {
                DocumentModel usr = userManager.getUserModel( name );
                String email = (String)usr.getPropertyValue("email");

                if( toStr.isEmpty() ) { toStr = email; }
                else { toStr = toStr + ", " + email; }
            }
        }

        return toStr;
    }

    public void notificationEmailsAndReminderTasks( OperationContext ctx ) throws Exception
    {
        String dialectAdminID = null;

        String title = "NOTIFICATION: New user registration";
        String body = "New self registration by " + userInfo.getFirstName() + " " + userInfo.getLastName() +
                "<br> Login name: " + userInfo.getEmail() +
                "<br> user registered to participate in " + dialectTitle +"."+
                "<br> Registration request will expire in 7 days."+
                "<br> To complete registration "+userInfo.getFirstName()+ " has to setup account password.";

        // get Administrator address & LanguageAdministrator address
        // send an email to both

        try
        {
            String toStr = (String) getLanguageAdministratorEmail( ctx );

            if( !toStr.isEmpty() ) {
                generateMail("vtr_monk@mac.com", "", title, body);
            }
        }
        catch (NamingException | MessagingException e)
        {
            throw new NuxeoException("Error while sending mail", e);
        }

        // enqueue checking tasks for registration timeout worker
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
                                 CoreSession              session,
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
        info.put("fvuserinfo:requestedSpaceId", userInfo.getRequestedSpace());
        info.put("registration:comment", comment);
        info.put("dc:title", firstName + " " + lastName + " Wants to Join " + dialectTitle);

        String registrationId = registrationService.submitRegistrationRequest(registrationService.getConfiguration(CONFIGURATION_NAME).getName(),
                userInfo, docInfo, info,
                validationMethod, autoAccept, email);

        // Set permissions on registration document
        FVRegistrationUtilities.UnrestrictedRequestPermissionResolver urpr = new FVRegistrationUtilities.UnrestrictedRequestPermissionResolver(session, registrationId, ugdr.language_admin_group);
        urpr.runUnrestricted();

        return registrationId;
    }

    protected static class UnrestrictedSourceDocumentResolver extends UnrestrictedSessionRunner {

        private final CoreSession session;
        private final String docid;

        public DocumentModel dialect;

        protected UnrestrictedSourceDocumentResolver(CoreSession session, String docId) {
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
}
