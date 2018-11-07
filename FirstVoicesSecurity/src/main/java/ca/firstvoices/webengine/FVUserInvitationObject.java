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
@Path("/userInvitation")
@Produces("text/html;charset=UTF-8")
@WebObject(type = "userRegistration")
public class FVUserInvitationObject extends UserInvitationObject {
    private static final Log log = LogFactory.getLog(UserInvitationObject.class);

    protected UserInvitationService fetchService() {
        UserInvitationService usr = Framework.getLocalService(UserInvitationService.class);
        return usr;
    }

    @GET
    @Path("enterpassword/{configurationName}/{requestId}")
    public Object validatePasswordForm(@PathParam("requestId") String requestId,
                                       @PathParam("configurationName") String configurationName) {

        UserInvitationService usr = fetchService();
        try {
            usr.checkRequestId(requestId);
        } catch (AlreadyProcessedRegistrationException ape) {
            return getView("ValidationErrorTemplate").arg("exceptionMsg",
                    ctx.getMessage("label.error.requestAlreadyProcessed"));
        } catch (UserRegistrationException ue) {
            return getView("ValidationErrorTemplate").arg("exceptionMsg",
                    ctx.getMessage("label.error.requestNotExisting", requestId));
        }

        Map<String, String> data = new HashMap<String, String>();
        data.put("RequestId", requestId);
        data.put("ConfigurationName", configurationName);
        String webappName = VirtualHostHelper.getWebAppName(getContext().getRequest());
        String validationRelUrl = usr.getConfiguration(configurationName).getValidationRelUrl();
        String valUrl = "/" + webappName + "/" + validationRelUrl;
        data.put("ValidationUrl", valUrl);
        return getView("EnterPassword").arg("data", data);
    }


}