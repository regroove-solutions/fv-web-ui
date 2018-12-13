package ca.firstvoices.utils;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.platform.usermanager.UserManager;

import java.util.List;

public class FVOperationCredentialsVerification
{
    private static int GLOBAL_ADMINISTRATOR_OR_SYSTEM   = 1;
    private static int LANGUAGE_ADMINISTRATOR           = 2;
    private static int INVALID_CREDENTIALS              = 0;

    private static String language_admin_group = null;

    private static int isValidPrincipal( NuxeoPrincipal p )
    {
        String pName =  p.getName();
        language_admin_group = null;

        if( !(pName.equals("system") || pName.equals("Administrator")))
        {
            List<String> pGroups = p.getGroups();

            for (String gn : pGroups)
            {
                if (gn.equals("administrators"))
                {
                    return GLOBAL_ADMINISTRATOR_OR_SYSTEM;
                }

                if (gn.contains("_language_administrators"))
                {
                    language_admin_group = gn;
                    return LANGUAGE_ADMINISTRATOR;
                }
            }

            return INVALID_CREDENTIALS;
        }

        return GLOBAL_ADMINISTRATOR_OR_SYSTEM;
    }

    public static boolean terminateOnInvalidCredentials_NewUserHomeChange( CoreSession session, UserManager userManager, String username, String dialectGUID )
    {
        NuxeoPrincipal invoking_principal = (NuxeoPrincipal) session.getPrincipal();

        int credentialsType = isValidPrincipal( invoking_principal );

        if( credentialsType != GLOBAL_ADMINISTRATOR_OR_SYSTEM )
        {
            // language admin can make changes to a user in their dialect
            if( credentialsType == LANGUAGE_ADMINISTRATOR )
            {
                DocumentModel userToChange = userManager.getUserModel(username);

                String userPreferences = (String) userToChange.getPropertyValue("user:preferences");

                if( userPreferences.contains(dialectGUID)) return false; // user preferred dialect has to be included in user preferences
            }

            return true; // invalid credentials
        }

        return false; // continue executing command - valid credentials
    }

    public static boolean terminateOnInvalidCredentials_UU( CoreSession session, UserManager userManager, String username )
    {
        NuxeoPrincipal invoking_principal = (NuxeoPrincipal) session.getPrincipal();

        int credentialsType = isValidPrincipal( invoking_principal );

        if( credentialsType != GLOBAL_ADMINISTRATOR_OR_SYSTEM )
        {
            // language admin can make changes to a user in their dialect
            if( credentialsType == LANGUAGE_ADMINISTRATOR )
            {
                NuxeoPrincipal userToChange = userManager.getPrincipal(username);

                int ui = language_admin_group.indexOf("_");
                String dns = language_admin_group.substring( 0, ui ); // dialect name

                List<String> upr_groups = userToChange.getGroups();

                for( String gn : upr_groups )
                {
                    if( gn.contains(dns))
                    {
                        return false; // valid credentials
                    }
                }
            }

            return true; // invalid credentials
        }

        return false; // continue executing command - valid credentials
    }

    public static boolean terminateOnInvalidCredentials_GU( CoreSession session, String groupName )
    {
        NuxeoPrincipal invoking_principal = (NuxeoPrincipal) session.getPrincipal();

        int credentialsType = isValidPrincipal( invoking_principal );

        if( credentialsType != GLOBAL_ADMINISTRATOR_OR_SYSTEM )
        {
            // language admin can make changes to a group associated with their dialect
            if( credentialsType == LANGUAGE_ADMINISTRATOR )
            {
                int ui = language_admin_group.indexOf("_");
                String dns = language_admin_group.substring( 0, ui ); // dialect name ending

                if( groupName.contains( dns )) return false; // continue executing command - valid credentials
            }

            return true; // invalid credentials
        }

        return false; // continue executing command - valid credentials
    }
}
