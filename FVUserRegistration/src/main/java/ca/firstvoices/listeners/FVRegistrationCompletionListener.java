package ca.firstvoices.listeners;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

import java.io.Serializable;
import java.util.Map;

public class FVRegistrationCompletionListener implements EventListener {

   private static final Log log = LogFactory.getLog(ca.firstvoices.listeners.FVRegistrationCompletionListener.class);

   // accepts documentRemoved && registrationValidated
    protected WorkManager workManager = Framework.getService(WorkManager.class);

    @Override
    public void handleEvent(Event event)
    {
        EventContext ctx;

        switch (event.getName())
        {
            case "documentRemoved":
                log.info("GOT EVENT documentRemoved");
                break;
            case "registrationValidated":
                ctx = event.getContext();
                Object[] args = ctx.getArguments();

                for( Object o: args )
                {
                    if( o.getClass().getTypeName().equals("FVUserRegistration"))
                    {
                        DocumentModel reg = (DocumentModel)o;


                    }
                }
                log.info("GOT EVENT registrationValidated");
            break;

        }
    }
}
