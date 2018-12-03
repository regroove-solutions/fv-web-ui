package ca.firstvoices.workers;

import ca.firstvoices.user.FVUserRegistrationInfo;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
import org.nuxeo.ecm.core.work.AbstractWork;

import java.util.Calendar;
import java.util.Date;



public class FVRegistrationTimeOutWorker extends AbstractWork {

        private static final Log log = LogFactory.getLog(FVRegistrationTimeOutWorker.class);

        private static final int LOCK_EXPIRATION_DURATION_IN_DAYS = 7; // days
        private static final int REGISTRATION_REMINDER_AFTER_DAYS = 4; // days

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

        private int checkRegistrationTimeOut( Date dateRegistered )
        {
            Date now = Calendar.getInstance().getTime();

            long timeDiff = now.getTime() - dateRegistered.getTime();

            //
            // 			long diffSeconds = diff / 1000 % 60;
            //			long diffMinutes = diff / (60 * 1000) % 60;
            //			long diffHours = diff / (60 * 60 * 1000) % 24;
            //			long diffDays = diff / (24 * 60 * 60 * 1000);


            // long diffDays = diff / (24 * 60 * 60 * 1000);
            long diffMinutes = timeDiff / (60 * 1000) % 60; // TODO this is temporary

            int actionValue = 0;

            // if( diffDays > REGISTRATION_REMINDER_AFTER_DAYS ) actionValue = 1;
            // if( diffMinutes > LOCK_EXPIRATION_DURATION_IN_DAYS ) actionValue = 2;

            // TODO replace to calculate in days
            // minutes are used for testing ONLY

            if( diffMinutes > 4 ) actionValue = 1;
            if( diffMinutes > 7 ) actionValue = 2;

            return actionValue;
        }

        @Override
        public void work()
        {
            try
            {
                new UnrestrictedSessionRunner(session)
                {
                    @Override
                    public void run()
                    {
                        DocumentModelList registrations = session.query(String.format("Select * from Document where ecm:mixinType = 'UserRegistration'"));

                        for (DocumentModel uReg : registrations)
                        {
                            Date regCreated = (Date) uReg.getPropertyValue("dc:created");

                            int regTOType = checkRegistrationTimeOut( regCreated );
                            // regTOType
                            // 0 - registration still not timed out
                            // 1 - registration is closing on timeout
                            //     an email needs to be sent to a user who started registration
                            //     and email informing LanguageAdministrator that user registration will be deleted with ? days
                            // 2 - registration timed out and it has to be deleted
                            //     send an email to originator of registration request with information about cancellation
                            //
                            if( regTOType != 0 )
                            {
                                switch( regTOType )
                                {
                                    case 1:
                                        break;

                                    case 2:
                                        break;

                                    default:
                                }

                            }
                        }
                    }
                };
            } catch (Exception e) {
               log.warn(e);
            }
        }

    }
