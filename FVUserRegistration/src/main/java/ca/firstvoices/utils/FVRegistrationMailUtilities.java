package ca.firstvoices.utils;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.automation.features.PrincipalHelper;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.security.PermissionProvider;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.security.auth.login.LoginContext;
import javax.security.auth.login.LoginException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static ca.firstvoices.utils.FVRegistrationConstants.*;

public class FVRegistrationMailUtilities {

    private static final Log log = LogFactory.getLog(FVRegistrationMailUtilities.class);

    private String getJavaMailJndiName() {
        return Framework.getProperty("jndi.java.mail", "java:/Mail");
    }

    /**
     * @param destination
     * @param copy
     * @param title
     * @param content
     * @throws Exception
     */
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

    private String composeEmailString( Set<String> emailSet )
    {
        String toStr = new String();

        for( String em : emailSet )
        {
            if( em.contains("devnull")) continue;

            if( toStr.isEmpty() ) { toStr = em; }
            else { toStr = toStr + ", " + em; }
        }

        return toStr;
    }

    /**
     * @param dialect
     * @return
     */
    public String getLanguageAdministratorEmail( DocumentModel dialect ) throws LoginException
    {
        LoginContext lctx =  Framework.login();

        CoreSession session = CoreInstance.openCoreSession("default");
        UserManager umgr = Framework.getService( UserManager.class );
        PermissionProvider permissionProvider = Framework.getService( PermissionProvider.class );

        PrincipalHelper ph = new PrincipalHelper(umgr, permissionProvider);
        Set<String> result = ph.getEmailsForPermission(dialect, "Everything", false);

        session.close();
        lctx.logout();

        return composeEmailString( result );
    }

    private interface EmailContentAssembler
    {
        String getEmailTitle( int variant, Map<String, String> options );
        String getEmailBody( int variant, Map<String, String> options );
    }

    private class AdminMailContent implements EmailContentAssembler
    {
        public String getEmailTitle( int variant, Map<String, String> options )
        {
            String title = null;

            switch( variant)
            {
                case MID_REGISTRATION_PERIOD_ACT:
                    title = "NOTIFICATION User registration will expire soon.";
                    break;
                case REGISTRATION_EXPIRATION_ACT:
                    title = "NOTIFICATION User registration was not completed and will be deleted.";
                    break;
                case NEW_USER_SELF_REGISTRATION_ACT:
                    title = "NOTIFICATION New user registration";
                    break;
            }

            return title;
        }

        public String getEmailBody( int variant, Map<String, String> options )
        {
            String body = null;

            String s1 = "<br> Login name: " + options.get("email");
            String s2 = "<br><br> User registered and created password to participate in " + options.get("dialect");
            String ex7 = "<br> Please make the user a member of your dialect.";
            String ex24 =   "<br><br> Registration request will be deleted in 24 hrs. <br>";
            String endStr =  "<br><br> To complete registration "+options.get("fName")+ " has to setup account password.";
            String thankYou = " <br><br> Regards,<br> The FirstVoices team";

            switch( variant) {
                case MID_REGISTRATION_PERIOD_ACT:
                    body = "Registration for " + options.get("fName") + " " + options.get("lName") + " will expire in 3 days." + s1 +s2 + endStr + thankYou;
                     break;
                case REGISTRATION_EXPIRATION_ACT:
                    body = "Registration period for " + options.get("fName") + " " + options.get("lName") + " EXPIRED."+ s1 + s2 + ex24 + endStr + thankYou;
                    break;

                case NEW_USER_SELF_REGISTRATION_ACT:

                    body = "New self registration by " + options.get("fName") + " " + options.get("lName") + s1 + s2 + ex7 + thankYou;
                    break;
            }

            return body;
        }
    }

    private class UserReminderMailContent implements EmailContentAssembler
    {
        public String getEmailTitle( int variant, Map<String, String> options )
        {
            String title = null;

            switch( variant ) {
                case MID_REGISTRATION_PERIOD_ACT:
                    title = "NOTIFICATION Your registration will expire soon.";
                    break;
                case REGISTRATION_EXPIRATION_ACT:
                    title = "NOTIFICATION Your registration was not completed and will be deleted.";
                    break;
                case REGISTRATION_DELETION_ACT:
                    title = "Your registration to FirstVoices was deleted.";
                    break;
                default:
            }
            return title;
        }

        public String getEmailBody( int variant, Map<String, String> options )
        {
            String body = null;
            String g =  "Dear "+ options.get("fName") +",";
            String e3 = "<br> Your registration to FirstVoices.com will expire in 3 days.";
            String e24 = "<br> Your registration to FirstVoices.com expired and will be deleted in 24 hrs.";
            String del = "<br> Your registration to FirstVoices.com was deleted.";
            String ln =  "<br><br> Your login name is: " + options.get("email");
            String dp =  "<br><br> You registered to participate in " + options.get("dialect") +". <br>";
            String endStr =  "<br> Please setup account password to complete registration.";
            String re = "<br> In order to participate in FirstVoices you will need to register again.";
            String endStr_D =  "<br><br> If you do so please complete registration by setting up you account password.";
            String thankYou = " <br><br> Regards,<br> The FirstVoices team";

            switch( variant ) {
                case MID_REGISTRATION_PERIOD_ACT:
                    body =  g + e3 + ln + dp + endStr + thankYou;
                    break;
                case REGISTRATION_EXPIRATION_ACT:
                    body =  g + e24 + ln + dp + endStr + thankYou;
                    break;
                case REGISTRATION_DELETION_ACT:
                    body =  g + del + re + endStr_D + thankYou;
                    break;
                default:
            }

            return body;
        }
    }

    /**
     * @param variant
     * @param prep
     * @param options
     * @param toStr
     * @throws Exception
     */
    private void registrationMailSender(int variant, EmailContentAssembler prep, Map<String, String> options, String toStr ) throws Exception
    {
        String title = prep.getEmailTitle( variant, options );
        String body = prep.getEmailBody( variant, options );

        try
        {
            if( title != null && body != null )
            {
                if (!toStr.isEmpty()) {
                    generateMail(toStr, "", title, body);
                } else {
                    generateMail(options.get("email"), "", title, body);
                }
            }
        }
        catch (NamingException | MessagingException e)
        {
            log.warn(e);
            throw new NuxeoException("Error while sending mail", e);
        }
    }

    /**
     * @param variant
     * @param options
     * @param toStr
     * @throws Exception
     */
    public void registrationAdminMailSender(int variant, Map<String, String> options, String toStr ) throws Exception
    {
        registrationMailSender( variant, new AdminMailContent(), options, toStr );
    }

    /**
     * @param variant
     * @param registrationRequest
     * @param session
     * @throws Exception
     */
    public void emailReminder( int variant, DocumentModel registrationRequest, CoreSession session ) throws Exception
    {
        String requestedSpaceId = (String) registrationRequest.getPropertyValue("docinfo:documentId");

        // Source lookup (unrestricted)
        FVRegistrationUtilities.UnrestrictedSourceDocumentResolver usdr = new FVRegistrationUtilities.UnrestrictedSourceDocumentResolver(session, requestedSpaceId);
        usdr.runUnrestricted();

        // Source document
        DocumentModel dialect = usdr.dialect;
        String dialectTitle = (String) dialect.getPropertyValue("dc:title");

        Map<String, String> options = new HashMap<>();
        options.put("fName", (String) registrationRequest.getPropertyValue("userinfo:firstName"));
        options.put("lName", (String) registrationRequest.getPropertyValue("userinfo:lastName"));
        options.put("email", (String) registrationRequest.getPropertyValue("userinfo:email"));
        options.put("dialect", dialectTitle);

        String toStr = getLanguageAdministratorEmail( dialect );

        registrationMailSender( variant, new UserReminderMailContent(), options , "" );

        registrationMailSender( variant, new AdminMailContent(), options , toStr );
    }
}
