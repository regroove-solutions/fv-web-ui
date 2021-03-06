package ca.firstvoices.operations;

import java.util.*;
import java.util.stream.Collectors;

import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.impl.ACLImpl;
import org.nuxeo.ecm.core.api.security.impl.ACPImpl;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.CoreSession;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.EMAIL_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.GROUPS_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.PASSWORD_COLUMN;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.SCHEMA_NAME;
import static org.nuxeo.ecm.platform.usermanager.UserConfig.USERNAME_COLUMN;

/**
 *
 */
@Operation(id=InitialDatabaseSetup.ID, category= Constants.CAT_DOCUMENT, label="FVInitialDatabaseSetup",
    description="This operation is used to setup the initial FirstVoices backend for development.  " +
        "It can be run multiple times without issues. Please ensure you have your environment " +
        "variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD as these will create an admin " +
        "account for you.")
public class InitialDatabaseSetup {
    
    public static final String ID = "Document.InitialDatabaseSetup";
    
    public static final String SCHEMA_PUBLISHING = "publishing";
    
    public static final String SECTIONS_PROPERTY_NAME = "publish:sections";
    
    // Environment variables for the admin account that will be created.
    private static final String username = System.getenv("CYPRESS_FV_USERNAME");
    private static final String password = System.getenv("CYPRESS_FV_PASSWORD");
    
    @Context
    protected CoreSession session;
    
    @Context
    protected UserManager userManager;
    
    @OperationMethod
    public void run() {
            /*
                Create the proper folder structure.
             */
        createNewDocument("Site", "Workspace", "/FV/Workspaces");
        createNewDocument("Site", "Section", "/FV/sections");
        createNewDocument("Resources", "FVResources", "/FV/Workspaces/Site");
        createNewDocument("Pages", "Folder", "/FV/Workspaces/Site/Resources");
        createNewDocument("Shared Categories", "FVCategories", "/FV/Workspaces/SharedData");
        createNewDocument("Shared Links", "FVLinks", "/FV/Workspaces/SharedData");
        createNewDocument("Shared Resources", "FVResources", "/FV/Workspaces/SharedData");

            /*
                Create the user groups.
             */
        createNewGroup("language_administrators", "Language Administrators");
        createNewGroup("recorders", "Recorders");
        createNewGroup("recorders_with_approval", "Recorders With Approval");
            
            /*
                Add new user groups as subgroups of group "members" and keep any existing subgroups.
             */
        DocumentModel members = userManager.getGroupModel("members");
        Object existingSubGroups = members.getProperty("group", "subGroups");
        String existingSubGroupsString = existingSubGroups.toString();
        existingSubGroupsString = existingSubGroupsString.substring(1, existingSubGroupsString.length() - 1);
        List<String> newSubGroups;
        if (existingSubGroupsString.length() == 0) {
            newSubGroups = new ArrayList<>();
        } else {
            newSubGroups = new ArrayList<>(Arrays.asList(existingSubGroupsString.split(", ")));
        }
        newSubGroups.add("language_administrators");
        newSubGroups.add("recorders");
        newSubGroups.add("recorders_with_approval");
        List<String> noDuplicates = newSubGroups.stream().distinct().collect(Collectors.toList());
        members.setProperty("group", "subGroups", noDuplicates);
        userManager.updateGroup(members);

            /*
                Setup permissions.
             */
        DocumentModel root = session.getDocument(new PathRef("/"));
        ACPImpl acp = new ACPImpl();
        ACLImpl acl = new ACLImpl("ACL.LOCAL_ACL");
        acp.addACL(acl);
        ACE ace = new ACE("members", "Read", true);
        acl.add(ace);
        root.setACP(acp, false);

        DocumentModel sections = session.getDocument(new PathRef("/FV/sections"));
        ACPImpl acpTwo = new ACPImpl();
        ACLImpl aclTwo = new ACLImpl("ACL.LOCAL_ACL");
        acpTwo.addACL(aclTwo);
        ACE aceTwo = new ACE("Guest", "Read", true);
        aclTwo.add(aceTwo);
        sections.setACP(acpTwo, false);

            /*
                Setup publication targets.
             */
        DocumentModel target = session.getDocument(new PathRef("/FV/sections/Data"));
        String targetSectionId = target.getId();
        DocumentModel sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Data"));
        addSection(targetSectionId, sourceDoc);

        target = session.getDocument(new PathRef("/FV/sections/SharedData"));
        targetSectionId = target.getId();
        sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/SharedData"));
        addSection(targetSectionId, sourceDoc);

        target = session.getDocument(new PathRef("/FV/sections/Site"));
        targetSectionId = target.getId();
        sourceDoc = session.getDocument(new PathRef("/FV/Workspaces/Site"));
        addSection(targetSectionId, sourceDoc);

            /*
                Create admin user.
             */
        if (username != null || password != null) {
            if (userManager.getUserModel(username) == null) {
                String[] groups = {"administrators"};
                DocumentModel userDoc = userManager.getBareUserModel();
                userDoc.setProperty(SCHEMA_NAME, USERNAME_COLUMN, username);
                userDoc.setProperty(SCHEMA_NAME, PASSWORD_COLUMN, password);
                userDoc.setPropertyValue(GROUPS_COLUMN, groups);
                userDoc.setProperty(SCHEMA_NAME, EMAIL_COLUMN, "@.");
                userDoc = userManager.createUser(userDoc);
            }
        }
    }
    
    /*
        Helper method to set a publication target for a document.
     */
    private void addSection(String targetSectionId, DocumentModel sourceDocument) {
        
        if (targetSectionId != null && sourceDocument.hasSchema(SCHEMA_PUBLISHING)) {
            String[] sectionIdsArray = (String[]) sourceDocument.getPropertyValue(SECTIONS_PROPERTY_NAME);
            
            List<String> sectionIdsList = new ArrayList<String>();
            
            if (sectionIdsArray != null && sectionIdsArray.length > 0) {
                sectionIdsList = Arrays.asList(sectionIdsArray);
                // make it resizable
                sectionIdsList = new ArrayList<String>(sectionIdsList);
            }
            
            sectionIdsList.add(targetSectionId);
            String[] sectionIdsListIn = new String[sectionIdsList.size()];
            sectionIdsList.toArray(sectionIdsListIn);
            
            sourceDocument.setPropertyValue(SECTIONS_PROPERTY_NAME, sectionIdsListIn);
            session.saveDocument(sourceDocument);
            session.save();
        }
    }
    
    /*
        Helper method to create the folder structure if it doesn't exist already
     */
    private void createNewDocument(String name, String type, String parentPath) {
        if (!session.exists(new PathRef(parentPath + "/" + name))) {
            DocumentModel newDoc = session.createDocumentModel(parentPath, name, type);
            newDoc.setPropertyValue("dc:title", name);
            newDoc = session.createDocument(newDoc);
            session.saveDocument(newDoc);
        }
    }
    
    /*
        Helper method to create the user groups
     */
    private void createNewGroup(String groupName, String groupLabel) {
        if (userManager.getGroup(groupName) == null) {
            DocumentModel newGroup = userManager.getBareGroupModel();
            newGroup.setProperty("group", "groupname", groupName);
            newGroup.setProperty("group", "grouplabel", groupLabel);
            userManager.createGroup(newGroup);
        }
        
    }
    
}
