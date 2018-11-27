package ca.firstvoices.operations;


import ca.firstvoices.user.FVUserRegistrationInfo;
import ca.firstvoices.utils.CustomSecurityConstants;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.invite.UserInvitationService;
import org.nuxeo.ecm.user.invite.UserRegistrationException;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;
import org.nuxeo.ecm.user.registration.UserRegistrationService;
import org.nuxeo.runtime.api.Framework;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Operation(id = FVQuickUserRegistration.ID, category = Constants.CAT_USERS_GROUPS, label = "Guest self registration",
        description = "Starts guest registration.")
public class FVQuickUserRegistration {

    public static final String ID = "User.SelfRegistration";

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

    @Param(name ="Email address" )
    protected String email; // this will be the same as login information, has to be unique

    @Param(name = "First name" )
    protected String firstName;

    @Param(name = "Last name" )
    protected String lastName;

    @Param(name = "comment", required = false)
    protected String comment;

    @Context
    protected CoreSession session;

    @OperationMethod
    public String run( String dialectUUid )
    {

        UserManager userManager = Framework.getService(UserManager.class);
        DocumentRegistrationInfo docInfo = new DocumentRegistrationInfo(); //?
        FVUserRegistrationInfo userInfo = new FVUserRegistrationInfo(); //?

        // Source lookup (unrestricted)
        UserInvite.UnrestrictedSourceDocumentResolver usdr = new UserInvite.UnrestrictedSourceDocumentResolver( session, dialectUUid );
        usdr.runUnrestricted();

        // Source document
        DocumentModel dialect = session.getDocument( new IdRef(dialectUUid) );
        String dialectTitle = (String) dialect.getPropertyValue("dc:title" );
        docInfo.setDocumentId( dialect.getId() );

        // disabled UI should be NEVER passed on for selection to join
        if (dialect.getCurrentLifeCycleState().equals("disabled"))
        {
            throw new UserRegistrationException("Cannot request to join a disabled dialect.");
        }

        docInfo.setDocumentTitle( dialectTitle ); // ?

        // Group lookup (unrestricted)
        UserInvite.UnrestrictedGroupResolver ugdr = new UserInvite.UnrestrictedGroupResolver( session, dialect );
        ugdr.runUnrestricted();

        DocumentModel newUser = userManager.getBareUserModel();

        newUser.setProperty("user", "username", email);
        newUser.setProperty("user", "firstName", firstName);
        newUser.setProperty("user", "lastName", lastName);
        newUser.setProperty("user", "email", email );
        newUser.setProperty("user", "company", "" );
        newUser.setProperty("user", "groups", ugdr.member_groups );

        // If no group found (somehow), add Read permission directly.
        if (!ugdr.member_groups.isEmpty())
        {
            userInfo.setGroups(ugdr.member_groups);

        }
        else
        {
            docInfo.setPermission("Read"); // dont need it
        }
        // TODO: check if the above code can be replaced with call to User.CreateOrUpdate
        // or if we can create a user and add values
        //
        // TODO: make sure all properties for the new user are entered
        // create user using newUser:BareUserModel as model
        // log information about self registration
        // send notification email to LanguageAdministrator
        // send notification email to Administrator
        // send email to user with request to complete registration by setting password
        // add userId to registration completion timeout worker

        return newUser.getId(); // is this enough?
    }

    protected static class UnrestrictedSourceDocumentResolver extends UnrestrictedSessionRunner {

        private final String docid;

        public DocumentModel dialect;

        protected UnrestrictedSourceDocumentResolver(CoreSession session, String docId) {
            super(session);
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

        private DocumentModel dialect;

        public ArrayList<String> member_groups = new ArrayList<String>();
        public String language_admin_group;

        protected UnrestrictedGroupResolver(CoreSession session, DocumentModel dialect) {
            super(session);
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
}
