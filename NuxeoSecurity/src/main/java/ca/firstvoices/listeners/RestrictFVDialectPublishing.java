package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 * Approves or Rejects Language Administrators' publishing a dialect based on whether it is their dialect.
 */
public class RestrictFVDialectPublishing implements EventListener {

	@Override
	public void handleEvent(Event event) throws NuxeoException {
	       EventContext ctx = event.getContext();
	       CoreSession session = ctx.getCoreSession();

	       if (!(ctx instanceof DocumentEventContext)) {
	           return;
	       }

	       //session.hasPer

	       for (Object doc : ctx.getArguments()) {
	    	   if (doc instanceof DocumentModel) {
	    		   //if (((DocumentModel) doc).getType().equals("FVDialect") && (NuxeoPrincipal) ctx.getPrincipal()) {

	    		   //}
	    	   }
	       }

	}
}