package ca.firstvoices.listeners;

import ca.firstvoices.workers.FVRegistrationTimeOutWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
public class FVRegistrationTimeOutListener implements EventListener {
    private static final Log log = LogFactory.getLog(FVRegistrationTimeOutListener.class);

    public static final String CHECK_REGISTRETION_TIMEOUT_EVENT_NAME = "checkRegistrationTimeout";

    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Override
    public void handleEvent(Event event) {
        if (CHECK_REGISTRETION_TIMEOUT_EVENT_NAME.equals(event.getName())) {
            FVRegistrationTimeOutWorker doCheckRegTimeOut = new FVRegistrationTimeOutWorker();
            workManager.schedule(doCheckRegTimeOut, true);
        }
    }
}
