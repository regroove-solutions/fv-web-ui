package ca.firstvoices.securitypolicies.utils;


import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.ACL;
import org.nuxeo.ecm.core.api.security.ACP;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;


public class PermissionAndACPUtils {


    // A list of document types with ReadWrite Permissions
    private static ArrayList<String> allowedDocumentTypes = new ArrayList<String>();

    /**
     * @param docType
     * @return true if document can be access by a user
     */
    public static boolean isDocumentTypeAllowed(String docType ) {
        if (allowedDocumentTypes.isEmpty()) {
            allowedDocumentTypes.add("FVCategories");
            allowedDocumentTypes.add("FVContributors");
            allowedDocumentTypes.add("FVDictionary");
            allowedDocumentTypes.add("FVResources");
            allowedDocumentTypes.add("FVBook");
            allowedDocumentTypes.add("FVBooks");
            allowedDocumentTypes.add("FVBookEntry");
            allowedDocumentTypes.add("FVPortal");
        }

        return allowedDocumentTypes.contains(docType);
    }

    /**
     * Responds with permission priority value.
     * Everything is higher than Read, etc.
     *
     * @param permission
     * @return
     */
    private static int rankPermission( String permission ) {
        switch( permission ) {
            case "Everything": return 5;
            case "Approve": return 4;
            case "Record": return 3;
            case "Browse": return 1;
            case "Read":return 1;
            case "ReadChildren": return 1;
        }

        return 0;
    }

    /**
     * Check if user permission is less or equal to document granted permission.
     *
     * @param acePermission associated with the document being accessed
     * @param principalPermission associated with user attemtpting to access docuemnt
     * @return true if permission can be granted
     */
    private static boolean grantPermission( String acePermission, String principalPermission ) {
        return rankPermission(acePermission) >= rankPermission( principalPermission);
    }

    /**
     *
     * @param docType
     * @return true if document type is on the list
     */
    public static boolean docTypeContains( String docType ) {
        return( docType.equals("FVLanguageFamily") ||
                docType.equals("FVLanguage")||
                docType.equals("FVPortal") ||
                docType.equals("FVDialect") ||
                docType.equals("FVLinks") ||
                docType.equals("FVLink") ||
                docType.equals("FVAlphabet") ||
                docType.equals("FVCharacter") ||
                docType.equals("FVDictionary") ||
                docType.equals("FVWord") ||
                docType.equals("FVPhrase") ||
                docType.equals("FVBooks") ||
                docType.equals("FVBook") ||
                docType.equals("FVBookEntry") ||
                docType.equals("FVCategories") ||
                docType.equals("FVCategory") ||
                docType.equals("FVContributors") ||
                docType.equals("FVContributor")  ||
                docType.equals("FVGallery") ||
                docType.equals("FVPage") ||
                docType.equals("FVResource") ||
                docType.equals("FVAudio")||
                docType.equals("FVPicture") ||
                docType.equals("FVVideo") );
    }

    /**
     * @param mergedACP permissions associated with a document
     * @param principal user accessing a document
     * @param permission requested by the principal
     * @return
     */
    // TODO make it faster. use hash table for mergedACLs and do not recompute rank for principal permission every time
    public static boolean hasPermissionInACP(ACP mergedACP, Principal principal, String permission) {
        List<String> principalGroups = ((NuxeoPrincipal)principal).getAllGroups();

        for (ACL acl : mergedACP.getACLs()) {
            for (ACE ace : acl.getACEs()) {
                if (ace.isGranted()) {
                    String acePermission = ace.getPermission();
                    // check if principal name is included if so check permission
                    if( principal.getName().contains(ace.getUsername() )) {
                        // now check the permission if 'Everything' skip the rest of checks
                        if( acePermission.equals("Everything")) return true;
                        if( permission.contains(acePermission) ) return true; // this handled ReadChildren as being equal to Read
                    }
                    // principal name was not found above
                    // so check if any of the groups associated with the principal are
                    for( String groupName : principalGroups ) {
                        if( !groupName.equals("members") && groupName.equals(ace.getUsername()) ) { // ignore members since this is not published
                            // check if requested permission is equal or less than granted permission
                            // Everything is higher than any other permissions
                            // Approve is higher than Record, Read, ReadChildren
                            // Record is higher than Read, ReadChildren
                            // Read and ReadChildren are the same
                            if( grantPermission( acePermission, permission) )
                                return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    /**
     * Overloaded signature. Checks permissions against principal list rather than single user.
     *
     * @param mergedAcp
     * @param additionalPrincipalsList
     * @param permission
     * @return
     */
    public static boolean hasPermissionInACP(ACP mergedAcp, List<String> additionalPrincipalsList, String permission) {

        for (ACL acl : mergedAcp.getACLs()) {
            for (ACE ace : acl.getACEs()) {
                if (ace.isGranted() && additionalPrincipalsList.contains(ace.getUsername()) && ace.getPermission().equals(permission)) {
                    return true;
                }
            }
        }

        return false;
    }
}
