package ca.firstvoices.listeners;

import ca.firstvoices.utils.FVRegistrationUtilities;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

public class FVRegistrationCompletionListener implements EventListener {

    private static final Log log = LogFactory.getLog(ca.firstvoices.listeners.FVRegistrationCompletionListener.class);

    // accepts documentRemoved && registrationValidated

    @Override
    public void handleEvent(Event event) {
        EventContext ctx;
        ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext)) return;

        DocumentEventContext docCtx = (DocumentEventContext) ctx;
        DocumentModel registration = docCtx.getSourceDocument();

        FVRegistrationUtilities regUtil = new FVRegistrationUtilities();

        switch (event.getName()) {
            case "documentRemoved":
                // TODO: use it to make sure user name is not left in the system when registration is deleted on time out
                break;

            case "registrationValidated":
                Object[] args = docCtx.getArguments();
                String principal = docCtx.getCoreSession().getPrincipal().getName();

                for (Object o : args) {
                    if (o == null) break;

                    DocumentModel ureg = (DocumentModel) o;
                    String oT = ureg.getType();

                    if (oT.equals("FVUserRegistration")) {
                        regUtil.registrationValidationHandler(ureg);
                    }
                }
                break;
        }
    }
}