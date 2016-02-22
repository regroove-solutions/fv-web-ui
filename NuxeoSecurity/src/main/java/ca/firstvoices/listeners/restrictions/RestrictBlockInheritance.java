package ca.firstvoices.listeners.restrictions;

import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;

/**
 * Block non-administrators from blocking inheritance so that they can safely use permissions.
 */
public class RestrictBlockInheritance implements EventListener {

    @Override
	public void handleEvent(Event event) throws NuxeoException {
    	/*EventContext ctx = event.getContext();
    	CoreSession session = ctx.getCoreSession();

        if (!(ctx instanceof DocumentEventContext)) {
            return;
        }

        ACP newACP = (ACP) event.getContext().getProperty(CoreEventConstants.NEW_ACP);

        ACL[] acls = newACP.getACLs();

        // Blocked ACP has two entries (local and blocked) and not member of administrators
        if (acls != null && acls.length > 1 && !((NuxeoPrincipal) session.getPrincipal()).isMemberOf("administrators")) {
        	newACP.unblockInheritance(ACL.LOCAL_ACL);
        }*/
    }

}
