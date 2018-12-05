/*
 * (C) Copyright 2016 Nuxeo SA (http://nuxeo.com/) and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     Nelson Silva <nsilva@nuxeo.com>
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.operations;

import ca.firstvoices.utils.FVRegistrationUtilities;
import ca.firstvoices.workers.FVRegistrationTimeOutWorker;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.user.registration.UserRegistrationService;
import org.nuxeo.ecm.user.registration.DocumentRegistrationInfo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import static org.nuxeo.ecm.user.invite.UserInvitationService.ValidationMethod;

/**
 * Operation to invite a User.
 */
@Operation(id = UserInvite.ID, category = Constants.CAT_USERS_GROUPS, label = "Invite a user",
        description = "Stores a registration request and returns its ID.")
public class UserInvite {

    public static final String ID = "User.Invite";
    private static final Log log = LogFactory.getLog(UserInvite.class);

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

    @Context
    protected CoreSession session;

    @Context
    protected AutomationService autoService;

    @Context
    protected OperationContext ctx;

    @Param(name ="docInfo", required = false)
    protected DocumentRegistrationInfo docInfo = null;

    @Param(name = "validationMethod", required = false)
    protected ValidationMethod validationMethod = ValidationMethod.EMAIL;

    @Param(name = "autoAccept", required = false)
    protected boolean autoAccept = false;

    @Param(name = "info", required = false)
    protected Map<String, Serializable> info = new HashMap<>();

    @Param(name = "comment", required = false)
    protected String comment;


    @OperationMethod
    public String run(DocumentModel registrationRequest) {
        FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();

        utilCommon.preCondition(registrationRequest, session, userManager, autoService);

        autoAccept = utilCommon.UserInviteCondition( registrationRequest, session, autoAccept );

        String registrationId = utilCommon.postCondition(registrationService,
                session,
                registrationRequest,
                info,
                comment,
                validationMethod,
                autoAccept);

        return registrationId;
    }
}
