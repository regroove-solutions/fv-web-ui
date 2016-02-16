package ca.bc.gov.listeners.security;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.api.event.CoreEventConstants;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

/**
 * Block non-administrators from blocking inheritance so that they can safely use permissions.
 */
public class BlockInheritance implements EventListener {

    public void handleEvent(Event event) throws NuxeoException {
    	EventContext ctx = event.getContext();
    	CoreSession session = ctx.getCoreSession();
    	
        if (!(ctx instanceof DocumentEventContext)) {
            return;
        }

        ACP newACP = (ACP) event.getContext().getProperty(CoreEventConstants.NEW_ACP);
        
        ACL[] acls = newACP.getACLs();
        
        // Blocked ACP has two entries (local and blocked) and not member of administrators
        if (acls != null && acls.length > 1 && !((NuxeoPrincipal) session.getPrincipal()).isMemberOf("administrators")) {
        	newACP.unblockInheritance(ACL.LOCAL_ACL);
        } 	
    }

}
