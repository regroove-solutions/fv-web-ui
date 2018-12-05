package ca.firstvoices.workers;

import ca.firstvoices.utils.FVRegistrationConstants;
import ca.firstvoices.utils.FVRegistrationMailUtilities;
import org.nuxeo.ecm.core.api.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;
import javax.security.auth.login.LoginContext;
import java.util.Calendar;


import static ca.firstvoices.utils.FVRegistrationUtilities.calculateRegistrationAgeInDays;


public class FVRegistrationTimeOutWorker extends AbstractWork {

        private static final Log log = LogFactory.getLog(FVRegistrationTimeOutWorker.class);

        public static final String CATEGORY_CHECK_REGISTRATION_TIMEOUT = "checkEditLocks";

        @Override
        public String getCategory() {
            return CATEGORY_CHECK_REGISTRATION_TIMEOUT;
        }

        @Override
        public String getTitle() {
            return "Check user registration timeout.";
        }

        public FVRegistrationTimeOutWorker() {
            super("check-registration-timeout");
        }

        private int checkRegistrationTimeOut( Calendar dateRegistered )
        {
            long diffDays = calculateRegistrationAgeInDays( dateRegistered );

            int actionValue = 0;

            // currently set to check at2am, 12am, 22pm
            if( diffDays >= 8 ) actionValue = FVRegistrationConstants.REGISTRATION_DELETION;
            else if( diffDays > 7 ) actionValue =  FVRegistrationConstants.REGISTRATION_EXPIRATION;
            else if( diffDays >= 4 ) actionValue = FVRegistrationConstants.MID_REGISTRATION_PERIOD;

            return actionValue;
        }

        @Override
        public void work()
        {
            LoginContext lctx;
            CoreSession s = null;
            FVRegistrationMailUtilities mailUtil = new FVRegistrationMailUtilities();

            try
            {
                lctx = Framework.loginAsUser("Administrator");
                s = CoreInstance.openCoreSession("default");
                session = s;

                DocumentModelList registrations = s.query(String.format("Select * from Document where ecm:mixinType = 'UserRegistration'"));

                for (DocumentModel uReg : registrations)
                {
                    Calendar regCreated = (Calendar) uReg.getPropertyValue("dc:created");

                    int regTOType = checkRegistrationTimeOut( regCreated );
                    // regTOType
                    // 0 - registration still not timed out
                    // 1 - registration is closing on timeout
                    //     an email needs to be sent to a user who started registration
                    //     and email informing LanguageAdministrator that user registration will be deleted with ? days
                    // 2 - registration timed out and it has to be deleted
                    //     send an email to originator of registration request with information about cancellation
                    // 3-  registration is deleted
                    //
                    mailUtil.emailReminder( regTOType, uReg, s );

                    if( regTOType == FVRegistrationConstants.REGISTRATION_DELETION )
                    {
                        log.info( "Registration period expired for user" + uReg.getPropertyValue("userinfo:firstName") + " " + uReg.getPropertyValue("userinfo:lastName") + ". Registration was deleted");
                        s.removeDocument( uReg.getRef() );
                    }
                 }

                 s.save();

            } catch (Exception e) {
               log.warn(e);
            }
            finally {
               if( s != null ) s.close();
            }
        }

    }
