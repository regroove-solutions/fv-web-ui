package ca.firstvoices.utils;

import ca.firstvoices.operations.UserInvite;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
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
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class FVRegistrationMailUtilities {

    private static final Log log = LogFactory.getLog(FVRegistrationMailUtilities.class);

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

    public String getLanguageAdministratorEmail( DocumentModel dialect )
    {
        Map<String, Object> params = new HashMap<>();
        params.put("permission", "Everything");
        params.put("variable name", "admin");
        params.put("prefix identifiers", "user:");
        params.put("resolve groups", true );

        UserManager um = Framework.getService( UserManager.class);
        AutomationService automationService = Framework.getService(AutomationService.class);
        OperationContext ctx = new OperationContext();
        ctx.setInput( dialect );

        try {
            DocumentModel doc = (DocumentModel) automationService.run(ctx, "Context.GetUsersGroupIdsWithPermissionOnDoc", params);
        } catch( Exception e) {
          log.warn( e );
        }

        String toStr = new String();

        Map<String, Object> val = (Map<String, Object>) ctx.getVars();

        if( val.containsKey("admin"))
        {
            StringList sL = (StringList)val.get("admin");

            for( String name : sL )
            {
                if( name.equals("Administrator")) continue;;

                DocumentModel usr = um.getUserModel( name );
                String email = (String)usr.getPropertyValue("email");

                if( toStr.isEmpty() ) { toStr = email; }
                else { toStr = toStr + ", " + email; }
            }
        }

        return toStr;
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
                case FVRegistrationConstants.MID_REGISTRATION_PERIOD:
                    title = "NOTIFICATION User registration will expire soon.";
                    break;
                case FVRegistrationConstants.REGISTRATION_EXPIRATION:
                    title = "NOTIFICATION User registration was not completed and will be deleted.";
                    break;
                case FVRegistrationConstants.NEW_USER_SELF_REGISTRATION:
                    title = "NOTIFICATION New user registration";
                    break;
            }

            return title;
        }

        public String getEmailBody( int variant, Map<String, String> options )
        {
            String body = null;

            String s1 = "<br> Login name: " + options.get("email");
            String s2 = "<br><br> User registered to participate in " + options.get("dialect") +".";
            String ex7 = "<br> Registration request will expire in 7 days.";
            String ex24 =   "<br><br> Registration request will be deleted in 24 hrs. <br>";
            String endStr =  "<br><br> To complete registration "+options.get("fName")+ " has to setup account password.";

            switch( variant) {
                case FVRegistrationConstants.MID_REGISTRATION_PERIOD:
                    body = "Registration for " + options.get("fName") + " " + options.get("lName") + " will expire in 3 days." + s1 +s2 + endStr;
                     break;
                case FVRegistrationConstants.REGISTRATION_EXPIRATION:
                    body = "Registration period for " + options.get("fName") + " " + options.get("lName") + " EXPIRED."+ s1 + s2 + ex24 + endStr;
                    break;

                case FVRegistrationConstants.NEW_USER_SELF_REGISTRATION:
                    body = "New self registration by " + options.get("fName") + " " + options.get("lName") + s1 + s2 + ex7 + endStr;
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
                case FVRegistrationConstants.MID_REGISTRATION_PERIOD:
                    title = "NOTIFICATION Your registration will expire soon.";
                    break;
                case FVRegistrationConstants.REGISTRATION_EXPIRATION:
                    title = "NOTIFICATION Your registration was not completed and will be deleted.";
                    break;
                case FVRegistrationConstants.REGISTRATION_DELETION:
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
            String e3 = "<br> Your registration to FirstVoices will expire in 3 days.";
            String e24 = "<br> Your registration to FirstVoices expired and will be deleted in 24 hrs.";
            String del = "<br> Your registration to FirstVoices was deleted.";
            String ln =  "<br><br> Your login name is: " + options.get("email");
            String dp =  "<br><br> You registered to participate in " + options.get("dialect") +". <br>";
            String endStr =  "<br> Please setup account password to complete registration.";
            String re = "<br> In order to participate in FirstVoices you will need to register again.";
            String endStr_D =  "<br> If you do so please complete registration by setting up you account password.";

            switch( variant ) {
                case FVRegistrationConstants.MID_REGISTRATION_PERIOD:
                    body =  g + e3 + ln + dp + endStr;
                    break;
                case FVRegistrationConstants.REGISTRATION_EXPIRATION:
                    body =  g + e24 + ln + dp + endStr;
                    break;
                case FVRegistrationConstants.REGISTRATION_DELETION:
                    body =  g + del + re + endStr_D;
                    break;
                default:
            }

            return body;
        }
    }

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

    public void registrationAdminMailSender(int variant, Map<String, String> options, String toStr ) throws Exception
    {
        registrationMailSender( variant, new AdminMailContent(), options, toStr );
    }

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

        registrationMailSender( variant, new AdminMailContent(), options , toStr );
        registrationMailSender( variant, new UserReminderMailContent(), options , "" );
    }
}
