package ca.firstvoices.webengine;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.platform.web.common.vh.VirtualHostHelper;
import org.nuxeo.ecm.user.invite.AlreadyProcessedRegistrationException;
import org.nuxeo.ecm.user.invite.UserInvitationService;
import org.nuxeo.ecm.user.invite.UserRegistrationException;
import org.nuxeo.ecm.webengine.invite.UserInvitationObject;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.runtime.api.Framework;

/**
 * @author <a href="mailto:akervern@nuxeo.com">Arnaud Kervern</a>
 */
@Path("/fv/users")
@Produces("text/html;charset=UTF-8")
@WebObject(type = "FVUserRegistration", superType = "userRegistration")
public class FVUserInvitationObject extends UserInvitationObject {
}