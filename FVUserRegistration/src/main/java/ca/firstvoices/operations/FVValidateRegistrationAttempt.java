package ca.firstvoices.operations;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.platform.usermanager.UserManager;

import static ca.firstvoices.utils.FVRegistrationConstants.*;

/*
    public static final int REGISTRATION_CAN_PROCEED       = 0;
    public static final int EMAIL_EXISTS_ERROR             = 1;
    public static final int LOGIN_EXISTS_ERROR             = 2;
    public static final int LOGIN_AND_EMAIL_EXIST_ERROR    = 3;
    public static final int REGISTRATION_EXISTS_ERROR      = 4;

*/
@Operation(id = FVValidateRegistrationAttempt.ID, category = Constants.CAT_USERS_GROUPS, label = "FVValidateRegistrationAttempt",
        description = "Validate new user registration attempt. Input: Login and Email of the new user. Return error code (email exists, login exist, registration can be accepted)")
public class FVValidateRegistrationAttempt
{
    public static final String ID = "FVValidateRegistrationAttempt";
    private static final Log log = LogFactory.getLog(FVValidateRegistrationAttempt.class);

    @Context
    protected CoreSession session;

    @Context
    protected UserManager userManager;

    @Param(name = "Login:")
    protected String login;

    @Param(name = "email:", required = false )
    protected String email = null;


    @OperationMethod
    public int run()
    {
        DocumentModelList registrations = null;
        DocumentModel userE = null;
        DocumentModel user = null;
        int verificationState = REGISTRATION_CAN_PROCEED;

        try
        {
            user = userManager.getUserModel(login);

            if( email != null )
            {
                registrations = session.query(String.format("Select * from Document where ecm:mixinType = 'UserRegistration' AND ( %s = '%s' OR %s = '%s')", "userinfo:login", login, "userinfo:email", email));

                userE = userManager.getUserModel(email);
            }
            else
            {
                registrations = session.query(String.format("Select * from Document where ecm:mixinType = 'UserRegistration' AND  %s = '%s' ", "userinfo:login", login));
            }

            if( user != null )
            {
                verificationState = LOGIN_EXISTS_ERROR;
            }

            if( userE != null )
            {
                verificationState = LOGIN_AND_EMAIL_EXIST_ERROR;
            }

            if( registrations != null)
            {
                for( DocumentModel reg : registrations)
                {
                    if( reg.getLifeCyclePolicy().equals("approved"))
                    {
                        verificationState = REGISTRATION_EXISTS_ERROR;
                        break;
                    }
                }
            }

        }
        catch (Exception e)
        {
            log.warn(e);
        }

        return verificationState;
    }
}
