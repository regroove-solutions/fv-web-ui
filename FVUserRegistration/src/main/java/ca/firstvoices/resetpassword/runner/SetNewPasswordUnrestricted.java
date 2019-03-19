package ca.firstvoices.resetpassword.runner;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.core.Response;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.api.Framework;

/**
 * Set the new password for the user.
 */
public class SetNewPasswordUnrestricted extends UnrestrictedSessionRunner {

    public static final Log log = LogFactory.getLog(SetNewPasswordUnrestricted.class);

    protected Response response;

    protected String passwordKey;

    protected String password;

    protected String errorMessage;

    public SetNewPasswordUnrestricted(String defaultRepositoryName, String password, String passwordKey) {
        super(defaultRepositoryName);
        this.password = password;
        this.passwordKey = passwordKey;
    }

    public Response getResponse() {
        return response;
    }

    @Override
    public void run() {

        SearchRegistrationByResetPassKeyUnrestricted runner = new SearchRegistrationByResetPassKeyUnrestricted(session,
                passwordKey);
        runner.runUnrestricted();
        DocumentModel registration = runner.getRegistration();
        if (registration == null) {
            // No key found
            errorMessage = "label.resetPassForm.registrationnotfound";
            return;
        }
        String email = registration.getProperty("resetPasswordKeys:email").getValue(String.class);

        UserManager userManager = Framework.getService(UserManager.class);
        DocumentModel userModel = searchCorrectUserByEmail(email);
        userModel.setPropertyValue("user:password", password);
        userManager.updateUser(userModel);

        try (Session session = Framework.getService(DirectoryService.class).open("resetPasswordKeys")) {
            session.deleteEntry(passwordKey);
        }

    }

    public DocumentModel searchCorrectUserByEmail(String email) {

        Map<String, Serializable> params = new HashMap<String, Serializable>();
        params.put("email", email);

        DocumentModelList users = Framework.getService(UserManager.class).searchUsers(params, null);
        if (users.size() > 0) {
            // normally we should have only one registered email
            return users.get(0);
        }
        return null;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

}
