/**
 * 
 */

package ca.firstvoices.publisher.seam;

import java.io.Serializable;

import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;
import org.jboss.seam.faces.FacesMessages;
import org.jboss.seam.international.StatusMessage;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.platform.ui.web.api.NavigationContext;
import org.nuxeo.runtime.api.Framework;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;

@Name("publishDialectAction")
@Scope(ScopeType.EVENT)
public class PublishDialectActionBean implements Serializable {

    private static final long serialVersionUID = 1L;

    @In(create = true, required = false)
    protected transient CoreSession documentManager;

    @In(create = true)
    protected NavigationContext navigationContext;

    @In(create = true, required = false)
    protected transient FacesMessages facesMessages;

    // This the method that will be called when the action button/link is
    // clicked
    public String doGet() {
        FirstVoicesPublisherService service = Framework.getService(FirstVoicesPublisherService.class);
        if (service == null) {
            facesMessages.add(StatusMessage.Severity.FATAL, "Dialect has been published");
            return null;
        }
        service.publishDialect(navigationContext.getCurrentDocument());
        facesMessages.add(StatusMessage.Severity.INFO, "Dialect has been published");

        // stay on the same view
        return null;
    }

    public boolean accept() {
        return navigationContext.getCurrentDocument() != null && 
                "FVDialect".equals(navigationContext.getCurrentDocument().getDocumentType().getName())
                && "Enabled".equals(navigationContext.getCurrentDocument().getCurrentLifeCycleState())
                && navigationContext.getCurrentDocument().getCoreSession().getProxies(navigationContext.getCurrentDocument().getRef(), null).size() == 0;
    }

}
