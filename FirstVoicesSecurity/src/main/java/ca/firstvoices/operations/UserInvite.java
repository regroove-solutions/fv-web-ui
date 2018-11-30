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
 */
package ca.firstvoices.operations;

import ca.firstvoices.utils.FVRegistrationUtilities;
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

    @Context
    protected UserManager userManager;

    @Context
    protected UserRegistrationService registrationService;

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

    @Context
    protected CoreSession session;

    @OperationMethod
    public String run(DocumentModel registrationRequest) {

        FVRegistrationUtilities utilCommon = new FVRegistrationUtilities();

        utilCommon.preCondition( registrationRequest, session );

//        NuxeoPrincipal currentUser = (NuxeoPrincipal) session.getPrincipal();
//
//        DocumentRegistrationInfo docInfo = new DocumentRegistrationInfo();
//        FVUserRegistrationInfo userInfo = new FVUserRegistrationInfo();
//
//        String requestedSpaceId = (String) registrationRequest.getPropertyValue("fvuserinfo:requestedSpace");
//        String firstName = (String) registrationRequest.getPropertyValue("userinfo:firstName");
//        String lastName = (String) registrationRequest.getPropertyValue("userinfo:lastName");
//        String email = (String) registrationRequest.getPropertyValue("userinfo:email");
//
//        // Source lookup (unrestricted)
//        UnrestrictedSourceDocumentResolver usdr = new UnrestrictedSourceDocumentResolver(session, requestedSpaceId);
//        usdr.runUnrestricted();
//
//        // Source document
//        DocumentModel dialect = usdr.dialect;
//
//        String dialectTitle = (String) dialect.getPropertyValue("dc:title");
//
//        docInfo.setDocumentId(dialect.getId());
//
//        if (dialect.getCurrentLifeCycleState().equals("disabled")) {
//            throw new UserRegistrationException("Cannot request to join a disabled dialect.");
//        }
//
//        docInfo.setDocumentTitle(dialectTitle);

//        // Group lookup (unrestricted)
//        UnrestrictedGroupResolver ugdr = new UnrestrictedGroupResolver(session, dialect);
//        ugdr.runUnrestricted();
//
//        // If no group found (somehow), add Read permission directly.
//        if (!ugdr.member_groups.isEmpty()) {
//            userInfo.setGroups(ugdr.member_groups);
//        } else {
//            docInfo.setPermission("Read");
//        }
//
//        // If authorized, use preset groups
//        if (currentUser.isAdministrator() || currentUser.isMemberOf(CustomSecurityConstants.LANGUAGE_ADMINS_GROUP)) {
//            autoAccept = true;
//
//            @SuppressWarnings("unchecked")
//            List<String> preSetGroup = (List<String>) registrationRequest.getPropertyValue("userinfo:groups");
//
//            if (!preSetGroup.isEmpty()) {
//                userInfo.setGroups(preSetGroup);
//            }
//        }
//        // If not authorized, never autoaccept
//        else {
//            autoAccept = false;
//        }

        autoAccept = utilCommon.UserInviteCondition( registrationRequest, session, autoAccept );

//        userInfo.setEmail(email);
//        userInfo.setFirstName(firstName);
//        userInfo.setLastName(lastName);
//        userInfo.setRequestedSpace(requestedSpaceId);
//
//        // Additional information from registration
//        info.put("fvuserinfo:requestedSpaceId", userInfo.getRequestedSpace());
//        info.put("registration:comment", comment);
//        info.put("dc:title", firstName + " " + lastName + " Wants to Join " + dialectTitle);
//
//        String registrationId = registrationService.submitRegistrationRequest(registrationService.getConfiguration(CONFIGURATION_NAME).getName(), userInfo, docInfo, info,
//                validationMethod, autoAccept, email);
//
//        // Set permissions on registration document
//        UnrestrictedRequestPermissionResolver urpr = new UnrestrictedRequestPermissionResolver(session, registrationId, ugdr.language_admin_group);
//        urpr.runUnrestricted();

        return utilCommon.postCondition( registrationService,
                                         session,
                                         registrationRequest,
                                         info,
                                         comment,
                                         validationMethod,
                                         autoAccept );
    }

}
