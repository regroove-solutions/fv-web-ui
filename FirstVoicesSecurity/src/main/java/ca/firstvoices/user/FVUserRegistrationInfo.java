package ca.firstvoices.user;

import org.nuxeo.ecm.user.invite.UserRegistrationInfo;

public class FVUserRegistrationInfo extends UserRegistrationInfo{

    protected String requestedSpace;

    public String getRequestedSpace() {
        return requestedSpace;
    }

    public void setRequestedSpace(String requestedSpace) {
        this.requestedSpace = requestedSpace;
    }
}